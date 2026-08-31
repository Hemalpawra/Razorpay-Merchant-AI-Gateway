import { streamText, convertToModelMessages, tool, type UIMessage } from "ai";
import { createClient } from "@/utils/supabase/server";
import { MerchantAuditService } from "@/utils/audit";
import { z } from "zod";
import {
  searchCatalog,
  getProductDetails,
  compareProducts,
  createRazorpayOrder,
  verifyPayment,
  getOrderStatus,
} from "@/lib/ai-tools";

const MODEL = "openai/gpt-5-mini-fast";
const MAX_HISTORY = 12;

const SYSTEM_PROMPT = `You are Merchant AI, the official in-store shopping assistant for ElectroStore (a Razorpay Merchant AI Gateway demo store). You operate ONLY inside this storefront and must never discuss other merchants, external marketplaces, or share links outside this store.

Your capabilities (via tools):
- search_catalog: Find products matching user query, category, price, stock
- get_product_details: Get full product info by SKU
- compare_products: Compare 2-4 products side by side
- create_razorpay_order: Create a Razorpay order when user wants to buy
- verify_payment: Verify payment after Razorpay checkout
- get_order_status: Get order/tracking/invoice info by order ID

Response format (ALWAYS use this structured format):
{
  "quickAnswer": "One short direct answer",
  "keyDetails": ["price: ₹X", "stock: Y available", "features: ...", "warranty: ...", "shipping: ...", "returns: ..."],
  "whyFits": ["Reason 1", "Reason 2", "Reason 3"],
  "betterOptions": [{"name": "...", "price": "₹X", "bestFor": "...", "mainDifference": "...", "suggestion": "..."}],
  "nextStep": {"action": "add_to_cart|buy_now|compare_more|ask_shipping", "label": "Button label", "data": {...}}
}

Rules:
- ALWAYS call search_catalog first when user asks about products
- Use get_product_details when user asks for specific product info
- Use compare_products when user wants to compare
- Use create_razorpay_order ONLY when user confirms they want to buy and you have shipping details
- NEVER invent product availability, prices, or order status
- NEVER claim payment is complete until verify_payment confirms it
- If user asks about order status, call get_order_status
- Stay within store domain only`;

const searchCatalogSchema = z.object({
  query: z.string().describe("User search query (e.g., 'headphones under 5000')"),
  category: z.string().optional().describe("Filter by product category"),
  max_price: z.number().optional().describe("Maximum price filter in INR"),
  in_stock_only: z.boolean().optional().describe("Only return products with stock > 0"),
  limit: z.number().optional().describe("Maximum number of results (default 4)"),
});

const getProductDetailsSchema = z.object({
  sku: z.string().describe("Product SKU"),
});

const compareProductsSchema = z.object({
  skus: z.array(z.string()).describe("Array of product SKUs to compare (2-4)"),
});

const createOrderSchema = z.object({
  session_id: z.string().describe("Current buyer session ID"),
  items: z.array(z.object({ sku: z.string(), qty: z.number() })),
  customer: z.object({
    full_name: z.string(),
    email: z.string(),
    phone: z.string(),
    line1: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    payment_mode: z.enum(["upi", "card", "netbanking"]),
  }),
  shipping_method: z.enum(["standard", "express"]),
  currency: z.enum(["INR"]),
});

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  db_order_id: z.string(),
});

const getOrderStatusSchema = z.object({
  order_id: z.string().describe("Internal order ID or Razorpay order ID"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      messages?: UIMessage[];
      message?: string;
      history?: Array<{ sender: string; text: string }>;
      session_id?: string | null;
      mode?: string;
      agent_name?: string | null;
      approve?: boolean;
    };

    const isApprove = !!body.approve;
    const messages =
      body.messages?.slice(-MAX_HISTORY) ??
      (body.message
        ? [
            {
              id: crypto.randomUUID(),
              role: "user",
              parts: [{ type: "text", text: body.message }],
            },
          ]
        : isApprove
          ? [
              {
                id: crypto.randomUUID(),
                role: "user",
                parts: [{ type: "text", text: "approve and complete the purchase now" }],
              },
            ]
          : []);
    if (!messages.length) {
      return Response.json({ error: "A message is required." }, { status: 400 });
    }

    const lastUserPart = [...messages]
      .reverse()
      .find((m) => m.role === "user")
      ?.parts?.find(
        (p): p is { type: "text"; text: string } => p.type === "text",
      );
    const cleanMessage = (
      isApprove
        ? "approve and complete the purchase now"
        : lastUserPart?.text || body.message || ""
    ).trim();
    if (!cleanMessage) {
      return Response.json({ error: "A message is required." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: products } = await supabase
      .from("products")
      .select("sku,name,category,price,stock_qty,description,image_url")
      .eq("status", "active")
      .limit(100);

    const isAgentMode = body.mode === "agent_to_agent";
    const mode = isAgentMode ? "agent_to_agent" : "customer";
    const agentName = (body.agent_name || "").trim() || (isAgentMode ? "External Buyer AI" : "Customer");

    // --- Session handling ---
    let sessionId = body.session_id ?? null;
    const merchantRow = (
      await supabase.from("merchants").select("id").limit(1).maybeSingle()
    ).data;
    const merchantId = merchantRow?.id || "";

    if (!sessionId) {
      const { data: sess } = await supabase
        .from("buyer_sessions")
        .insert({
          merchant_id: merchantId,
          external_ai_name: isAgentMode ? agentName : "Customer",
          channel: isAgentMode ? "agent_to_agent" : "storefront",
          customer_query: cleanMessage,
          buyer_request_text: cleanMessage,
          status: "active",
        })
        .select("id")
        .single();
      sessionId = sess?.id ?? null;
      if (sessionId) {
        await MerchantAuditService.logEvent({
          supabase,
          merchant_id: merchantId,
          session_id: sessionId,
          actor_type: "customer",
          event_type: "conversation_started",
          title: "Conversation Started",
          description: cleanMessage.slice(0, 200),
          result: "info",
        });
      }
    } else {
      await supabase
        .from("buyer_sessions")
        .update({ customer_query: cleanMessage, updated_at: new Date().toISOString() })
        .eq("id", sessionId);
    }

    // --- Tool calling with Vercel AI SDK v4 ---
    const result = streamText({
      model: MODEL,
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 1500,
      tools: {
        search_catalog: tool({
          description: "Find products matching user query, category, price, stock",
          inputSchema: searchCatalogSchema,
          execute: async (args: z.infer<typeof searchCatalogSchema>) => searchCatalog(args),
        }),
        get_product_details: tool({
          description: "Get full product info by SKU",
          inputSchema: getProductDetailsSchema,
          execute: async (args: z.infer<typeof getProductDetailsSchema>) => getProductDetails(args),
        }),
        compare_products: tool({
          description: "Compare 2-4 products side by side",
          inputSchema: compareProductsSchema,
          execute: async (args: z.infer<typeof compareProductsSchema>) => compareProducts(args),
        }),
        create_razorpay_order: tool({
          description: "Create a Razorpay order when user wants to buy",
          inputSchema: createOrderSchema,
          execute: async (args: z.infer<typeof createOrderSchema>) => createRazorpayOrder(args),
        }),
        verify_payment: tool({
          description: "Verify payment after Razorpay checkout",
          inputSchema: verifyPaymentSchema,
          execute: async (args: z.infer<typeof verifyPaymentSchema>) => verifyPayment(args),
        }),
        get_order_status: tool({
          description: "Get order/tracking/invoice info by order ID",
          inputSchema: getOrderStatusSchema,
          execute: async (args: z.infer<typeof getOrderStatusSchema>) => getOrderStatus(args),
        }),
      },
    });

    const reply = await result.text;

    // --- Parse structured response from AI ---
    let structuredResponse: {
      quickAnswer: string;
      keyDetails: string[];
      whyFits: string[];
      betterOptions: Array<{ name: string; price: string; bestFor: string; mainDifference: string; suggestion: string }>;
      nextStep: { action: string; label: string; data: Record<string, unknown> };
    } | null = null;

    try {
      const jsonMatch = reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        structuredResponse = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Fallback to keyword matching for GenUI cards
    }

    // --- Fallback keyword matching for GenUI cards (if no structured response) ---
    const lower = cleanMessage.toLowerCase();
    const isGreeting =
      lower.length <= 3 ||
      /^(hi|hello|hey|help|thanks|thank you|ok|okay|yes|no)\b/i.test(lower);
    const budgetMatch = lower.match(
      /(?:under|below|less than|budget of?)\s*₹?\s*(\d[\d,]*)/,
    );
    const maxBudget = budgetMatch
      ? parseInt(budgetMatch[1].replace(/,/g, ""), 10)
      : null;
    const keywords = lower
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);
    const matchedProducts = isGreeting
      ? []
      : (products ?? [])
          .filter((p: any) => {
            if (maxBudget !== null && Number(p.price) > maxBudget) return false;
            const hay = `${p.name} ${p.category} ${p.description ?? ""}`.toLowerCase();
            return keywords.some((kw) => hay.includes(kw));
          })
          .slice(0, 4);

    // --- Audit + conversation logging ---
    if (merchantId && sessionId) {
      if (matchedProducts.length > 0) {
        await supabase.from("product_matches").upsert(
          matchedProducts.map((p: any, index: number) => ({
            session_id: sessionId,
            product_id: p.id,
            rank: index + 1,
            match_score: null,
            reason_text: "Matched from customer request",
          })),
          { onConflict: "session_id,product_id", ignoreDuplicates: true },
        );
        await MerchantAuditService.logEvent({
          supabase,
          merchant_id: merchantId,
          session_id: sessionId,
          actor_type: "ai_assistant",
          event_type: "catalog_search_completed",
          title: "Products Searched & Matched",
          description: `Found ${matchedProducts.length} matching product(s) for "${cleanMessage.slice(0, 120)}"`,
          result: "success",
          meta_json: { matched_count: matchedProducts.length },
        });
      }
      await supabase.from("ai_conversation_messages").insert([
        { session_id: sessionId, role: "user", content: cleanMessage },
        {
          session_id: sessionId,
          role: "assistant",
          content: reply,
          meta_json: {
            model_used: MODEL,
            matched_count: matchedProducts.length,
            structured: !!structuredResponse,
          },
        },
      ]);
    }

    const normalize = (arr: any[]) => arr.map((p) => ({ ...p, stock: p.stock_qty }));

    return Response.json({
      reply,
      session_id: sessionId,
      model_used: MODEL,
      matched_products: normalize(
        matchedProducts.length > 0
          ? matchedProducts
          : isGreeting
            ? []
            : (products ?? []).slice(0, 3),
      ),
      is_fallback: false,
      structured: structuredResponse,
    });
  } catch (error) {
    console.error("[AI Chat Route Error]", error);
    return Response.json(
      { error: "The Merchant AI assistant is temporarily unavailable." },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
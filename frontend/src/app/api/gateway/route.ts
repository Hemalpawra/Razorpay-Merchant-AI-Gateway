import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { callOpenRouterLLM, OpenChatMessage } from '@/lib/openrouter';
import { MerchantAuditService } from '@/utils/audit';
import { searchCatalog, getProductDetails, compareProducts, type SearchCatalogArgs } from '@/lib/ai-tools';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      merchant_id, 
      buyer_request_text, 
      external_ai_name = 'External Buyer AI Agent',
      budget_max,
      history = [],
    } = body;

    if (!buyer_request_text) {
      return NextResponse.json(
        { error: 'Missing required field: buyer_request_text is required.' },
        { status: 400 }
      );
    }

    const fullMessage = budget_max 
      ? `${buyer_request_text} under ₹${budget_max}` 
      : buyer_request_text;

    const supabase = await createClient();

    // 1. Get or create merchant
    const { data: merchants } = await supabase
      .from('merchants')
      .select('id')
      .limit(1);
    const merchantId = merchants && merchants.length > 0 ? merchants[0].id : 'm_demo_101';

    // 2. Create or get buyer session
    let sessionId = body.session_id ?? null;
    if (!sessionId) {
      const { data: sess } = await supabase
        .from('buyer_sessions')
        .insert({
          merchant_id: merchantId,
          external_ai_name,
          channel: 'agent_to_agent',
          customer_query: fullMessage,
          buyer_request_text: fullMessage,
          status: 'active',
        })
        .select('id')
        .single();
      sessionId = sess?.id ?? null;
    } else {
      await supabase
        .from('buyer_sessions')
        .update({ customer_query: fullMessage, buyer_request_text: fullMessage, updated_at: new Date().toISOString() })
        .eq('id', sessionId);
    }

    if (sessionId) {
      await MerchantAuditService.logEvent({
        supabase,
        merchant_id: merchantId,
        session_id: sessionId,
        actor_type: 'ai_assistant',
        event_type: 'a2a_request_received',
        title: 'A2A Request Received',
        description: fullMessage.slice(0, 200),
        result: 'info',
      });
    }

    // 3. Search catalog using tool harness
    const searchArgs: SearchCatalogArgs = {
      query: fullMessage,
      max_price: budget_max,
      in_stock_only: true,
      limit: 4,
    };
    const catalogResult = await searchCatalog(searchArgs);

    const matchedProducts = catalogResult.success ? (catalogResult.data ?? []) : [];

    // 4. Build catalog context for LLM
    const productsList = matchedProducts.map(m => m.product);
    const catalogContextStr = productsList
      .map(p => `- ${p.name} (Category: ${p.category}, Price: ₹${p.price}, SKU: ${p.sku}, Stock: ${p.stock_qty})`)
      .join('\n');

    const isGreeting = fullMessage.trim().length <= 3 || /^(hi|hello|hey|greetings|help|thanks|thank you|ok|okay|yes|no)$/i.test(fullMessage.trim());

    const systemPrompt = `You are ElectroStore Merchant AI Gateway Assistant.
You are helping an external Buyer AI Agent find products and complete instant Razorpay checkouts.
Current Active Merchant Catalog:
${catalogContextStr || 'The catalog is currently empty.'}

Instructions:
- If the agent says "Hi", "Hello", or greets you, respond warmly and ask what product or specs they are looking for today.
- For product questions, be warm, helpful, concise, and professional.
- Focus on answering questions using the merchant's catalog products.
- Always include accurate prices in INR (₹).
- Never dump the full catalog or repeat product lists. Recommend at most 3 relevant products and keep the response under 80 words.
- If the message is a greeting or casual acknowledgement, do not recommend products or mention catalog items unless asked.
- Use short paragraphs or bullets, not a long comma-separated list.
- Mention that purchases can be completed instantly via Razorpay Checkout.
- Respond in structured JSON format:
{
  "quickAnswer": "One short direct answer",
  "keyDetails": ["price: ₹X", "stock: Y available", "features: ...", "warranty: ...", "shipping: ...", "returns: ..."],
  "whyFits": ["Reason 1", "Reason 2", "Reason 3"],
  "betterOptions": [{"name": "...", "price": "₹X", "bestFor": "...", "mainDifference": "...", "suggestion": "..."}],
  "nextStep": {"action": "add_to_cart|buy_now|compare_more|ask_shipping", "label": "Button label", "data": {...}}
}`;

    const openRouterMessages: OpenChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-4).map((h: any) => ({
        role: h.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: h.text,
      })),
      { role: 'user', content: fullMessage },
    ];

    // Call OpenRouter LLM
    const llmResult = await callOpenRouterLLM(openRouterMessages);
    let replyText = llmResult.text;
    const modelUsed = llmResult.modelUsed || 'openrouter-fallback';

    if (!replyText || llmResult.isFallback) {
      if (isGreeting) {
        replyText = `Hello! Welcome to ElectroStore Merchant AI Gateway. I can help you find products and complete instant Razorpay checkouts. What are you looking for today?`;
      } else if (matchedProducts.length > 0) {
        replyText = `I found ${matchedProducts.length} matching product(s) from our live catalog.`;
      } else {
        replyText = `I couldn't find matching products for "${fullMessage}". Could you try a different search?`;
      }
    }

    // Persist session messages
    if (sessionId) {
      await supabase.from('ai_conversation_messages').insert([
        { session_id: sessionId, role: 'user', content: fullMessage },
        { session_id: sessionId, role: 'assistant', content: replyText, meta_json: { model_used: modelUsed, matched_count: matchedProducts.length } },
      ]);
    }

    // Log audit event
    if (sessionId) {
      await MerchantAuditService.logEvent({
        supabase,
        merchant_id: merchantId,
        session_id: sessionId,
        actor_type: 'ai_assistant',
        event_type: 'catalog_search_completed',
        title: 'AI Gateway Response Generated',
        description: `Found ${matchedProducts.length} matched product(s).`,
        result: 'success',
        meta_json: { model_used: modelUsed, matched_count: matchedProducts.length },
      });
    }

    return NextResponse.json({
      session_id: sessionId,
      status: 'success',
      reply: replyText,
      model_used: modelUsed,
      matches: matchedProducts.map(m => m.product),
      message: matchedProducts.length > 0 
        ? `Found ${matchedProducts.length} product(s) matching the criteria.` 
        : 'No products found matching the request.',
      structured: matchedProducts.length > 0 ? {
        quickAnswer: `Found ${matchedProducts.length} matching product(s)`,
        keyDetails: matchedProducts.slice(0, 3).flatMap(m => [
          `${m.product.name}: ₹${m.product.price}`,
          `Stock: ${m.product.stock_qty} available`,
        ]),
        whyFits: matchedProducts.slice(0, 2).map(m => `Matches your request for ${fullMessage}`),
        betterOptions: matchedProducts.slice(1, 3).map(m => ({
          name: m.product.name,
          price: `₹${m.product.price}`,
          bestFor: m.product.category,
          mainDifference: `Alternative option`,
          suggestion: `Consider if ${m.product.name} better fits your needs`,
        })),
        nextStep: {
          action: matchedProducts.length > 0 ? 'buy_now' : 'compare_more',
          label: matchedProducts.length > 0 ? 'Buy Now' : 'Search More',
          data: { sku: matchedProducts[0]?.product.sku },
        },
      } : undefined,
    });

  } catch (error: any) {
    console.error('[Gateway API Error]', error);
    return NextResponse.json(
      { error: 'Internal server error processing the AI request.', details: error.message },
      { status: 500 }
    );
  }
}
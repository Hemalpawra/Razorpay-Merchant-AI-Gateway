import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { createClient } from '@/utils/supabase/server';
import { MerchantAuditService } from '@/utils/audit';

const MODEL = 'openai/gpt-5-mini-fast';
const MAX_HISTORY = 12;

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      messages?: UIMessage[];
      message?: string;
      history?: Array<{ sender: string; text: string }>;
      session_id?: string | null;
      mode?: string;
      agent_name?: string | null;
    };
    const messages = body.messages?.slice(-MAX_HISTORY) ?? (body.message ? [{ id: crypto.randomUUID(), role: 'user', parts: [{ type: 'text', text: body.message }] }] : []);
    if (!messages.length) return Response.json({ error: 'A message is required.' }, { status: 400 });

    const lastUserPart = [...messages].reverse().find((m) => m.role === 'user')
      ?.parts?.find((p): p is { type: 'text'; text: string } => p.type === 'text');
    const cleanMessage = (lastUserPart?.text || body.message || '').trim();
    if (!cleanMessage) return Response.json({ error: 'A message is required.' }, { status: 400 });

    const supabase = await createClient();
    const { data: products } = await supabase.from('products').select('sku,name,category,price,stock_qty,description').eq('status', 'active').limit(100);
    const catalog = (products ?? []).map((product: any) => `${product.name} | SKU: ${product.sku} | ${product.category} | ₹${product.price} | stock: ${product.stock_qty ?? 0} | ${product.description ?? ''}`).join('\n');

    const result = streamText({
      model: MODEL,
      system: `You are Merchant AI, a concise and helpful shopping assistant for Razorpay Merchant AI Gateway. Use only the live catalog below for product facts, prices, and stock. Never invent availability or order status. You can recommend products and compare them, but do not claim to create payments or orders. Ask a short clarifying question when needed.\n\nLIVE CATALOG:\n${catalog || 'The catalog is currently empty.'}`,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 600,
    });

    const reply = await result.text;

    // --- Persist session, messages, matches and audit trail ---
    let sessionId = body.session_id ?? null;
    const isNewSession = !sessionId;
    const isAgentMode = body.mode === 'agent_to_agent';
    const agentName = (body.agent_name || '').trim() || (isAgentMode ? 'External Buyer AI' : 'Customer');
    const merchantId = (await supabase.from('merchants').select('id').limit(1).maybeSingle()).data?.id;

    if (merchantId && !sessionId) {
      const { data: sess } = await supabase
        .from('buyer_sessions')
        .insert({
          merchant_id: merchantId,
          external_ai_name: isAgentMode ? agentName : 'Customer',
          channel: isAgentMode ? 'agent_to_agent' : 'storefront',
          customer_query: cleanMessage,
          buyer_request_text: cleanMessage,
          status: 'active',
        })
        .select('id')
        .single();
      sessionId = sess?.id ?? null;
      if (sessionId) {
        await MerchantAuditService.logEvent({
          supabase,
          merchant_id: merchantId,
          session_id: sessionId,
          actor_type: 'customer',
          event_type: 'conversation_started',
          title: 'Conversation Started',
          description: cleanMessage.slice(0, 200),
          result: 'info',
        });
      }
    } else if (merchantId && sessionId) {
      await supabase
        .from('buyer_sessions')
        .update({ customer_query: cleanMessage, updated_at: new Date().toISOString() })
        .eq('id', sessionId);
    }

    // Lightweight keyword matching so the drawer shows relevant products instead of the whole catalog.
    const lower = cleanMessage.toLowerCase();
    const isGreeting = lower.length <= 3 || /^(hi|hello|hey|help|thanks|thank you|ok|okay|yes|no)\b/i.test(lower);
    const budgetMatch = lower.match(/(?:under|below|less than|budget of?)\s*₹?\s*(\d[\d,]*)/);
    const maxBudget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, ''), 10) : null;
    const keywords = lower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
    const matchedProducts = isGreeting ? [] : (products ?? []).filter((p: any) => {
      if (maxBudget !== null && Number(p.price) > maxBudget) return false;
      const hay = `${p.name} ${p.category} ${p.description ?? ''}`.toLowerCase();
      return keywords.some((kw) => hay.includes(kw));
    }).slice(0, 4);

    if (merchantId && sessionId) {
      if (matchedProducts.length > 0) {
        await supabase.from('product_matches').upsert(
          matchedProducts.map((p: any, index: number) => ({
            session_id: sessionId,
            product_id: p.id,
            rank: index + 1,
            match_score: null,
            reason_text: 'Matched from customer request',
          })),
          { onConflict: 'session_id,product_id', ignoreDuplicates: true },
        );
        await MerchantAuditService.logEvent({
          supabase,
          merchant_id: merchantId,
          session_id: sessionId,
          actor_type: 'ai_assistant',
          event_type: 'catalog_search_completed',
          title: 'Products Searched & Matched',
          description: `Found ${matchedProducts.length} matching product(s) for "${cleanMessage.slice(0, 120)}"`,
          result: 'success',
          meta_json: { matched_count: matchedProducts.length },
        });
        if (matchedProducts.length > 1) {
          await MerchantAuditService.logEvent({
            supabase,
            merchant_id: merchantId,
            session_id: sessionId,
            actor_type: 'ai_assistant',
            event_type: 'products_compared',
            title: 'Products Compared',
            description: `Compared ${matchedProducts.length} options: ${matchedProducts.map((p: any) => p.name).join(', ').slice(0, 200)}`,
            result: 'success',
            meta_json: { product_names: matchedProducts.map((p: any) => p.name) },
          });
          await MerchantAuditService.logEvent({
            supabase,
            merchant_id: merchantId,
            session_id: sessionId,
            actor_type: 'ai_assistant',
            event_type: 'upsell_shown',
            title: 'Upsell / Cross-sell Shown',
            description: `Recommended ${matchedProducts.length - 1} complementary option(s) alongside top match`,
            result: 'success',
            meta_json: { matched_count: matchedProducts.length },
          });
        }
      }
      await supabase.from('ai_conversation_messages').insert([
        { session_id: sessionId, role: 'user', content: cleanMessage },
        { session_id: sessionId, role: 'assistant', content: reply, meta_json: { model_used: MODEL, matched_count: matchedProducts.length } },
      ]);
    }

    return Response.json({
      reply,
      session_id: sessionId,
      model_used: MODEL,
      matched_products: matchedProducts.length > 0 ? matchedProducts : isGreeting ? [] : (products ?? []).slice(0, 3),
      is_fallback: false,
    });
  } catch (error) {
    console.error('[AI Chat Route Error]', error);
    return Response.json({ error: 'The Merchant AI assistant is temporarily unavailable.' }, { status: 500 });
  }
}

export const runtime = 'nodejs';

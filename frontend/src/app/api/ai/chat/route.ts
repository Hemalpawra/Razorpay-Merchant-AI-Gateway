import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { callOpenRouterLLM, OpenChatMessage } from '@/lib/openrouter';
import { logAuditEvent } from '@/utils/audit';

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const body = await request.json();
    const { 
      message, 
      merchant_id = 'm_demo_101', 
      session_id, 
      history = [],
      mode = 'customer' // 'customer' or 'agent_to_agent'
    } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message parameter is required.' }, { status: 400 });
    }

    // 1. Ensure Buyer Session exists
    let activeSessionId = session_id;
    if (!activeSessionId) {
      const { data: sess, error: sessErr } = await supabase
        .from('buyer_sessions')
        .insert({
          merchant_id,
          external_ai_name: mode === 'agent_to_agent' ? 'External Buyer AI Agent' : 'Customer Store AI',
          buyer_request_text: message,
          status: 'active'
        })
        .select('id')
        .single();

      if (!sessErr && sess) {
        activeSessionId = sess.id;
      }
    }

    // Log request in audit trail
    if (activeSessionId) {
      await logAuditEvent({
        supabase,
        merchant_id,
        session_id: activeSessionId,
        actor_type: mode === 'agent_to_agent' ? 'ai_assistant' : 'customer',
        event_type: 'request_received',
        title: mode === 'agent_to_agent' ? 'A2A Protocol Request' : 'Customer AI Chat Prompt',
        description: message,
        result: 'info'
      });
    }

    // 2. Fetch Catalog Products from Supabase DB (RAG Context)
    const { data: dbProducts } = await supabase
      .from('products')
      .select('*')
      .eq('merchant_id', merchant_id)
      .eq('status', 'active');

    const productsList = dbProducts || [];

    // Simple RAG relevance search
    const lower = message.toLowerCase();
    const matchedProducts = productsList.filter((p: any) => {
      const nameMatch = p.name.toLowerCase().includes(lower) || lower.split(' ').some((w: string) => w.length > 3 && p.name.toLowerCase().includes(w));
      const descMatch = p.description && p.description.toLowerCase().includes(lower);
      const catMatch = p.category && p.category.toLowerCase().includes(lower);
      return nameMatch || descMatch || catMatch;
    });

    const finalMatched = matchedProducts.length > 0 ? matchedProducts.slice(0, 3) : productsList.slice(0, 3);

    // 3. System Prompt for OpenRouter LLM
    const catalogContextStr = productsList.map(p => `- ${p.name} (SKU: ${p.sku}, Category: ${p.category}, Price: ₹${p.price}, Stock: ${p.stock_qty}, Desc: ${p.description || 'N/A'})`).join('\n');

    const systemPrompt = `You are Razorpay Merchant AI Gateway Assistant.
You are helping ${mode === 'agent_to_agent' ? 'an external Buyer AI Agent' : 'a customer'} with shopping, product search, comparisons, and automated Razorpay checkout.
Current Active Merchant Catalog:\n${catalogContextStr}

Instructions:
- Be helpful, polite, concise, and professional.
- Focus on answering questions using the merchant's catalog products.
- Always include accurate prices in INR (₹).
- If the user asks for comparison, compare products clearly based on specs and value.
- Mention that purchases can be completed instantly via Razorpay Checkout.`;

    const openRouterMessages: OpenChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-4).map((h: any) => ({
        role: h.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: h.text
      })),
      { role: 'user', content: message }
    ];

    // 4. Call OpenRouter LLM
    const llmResult = await callOpenRouterLLM(openRouterMessages);

    let replyText = llmResult.text;
    const modelUsed = llmResult.modelUsed || 'local-rag-fallback';

    // If LLM returned empty or fallback mode was triggered, use local RAG generator
    if (!replyText || llmResult.isFallback) {
      if (lower.includes('compare')) {
        replyText = `Here is a side-by-side comparison of top matched items in our catalog for your request.`;
      } else if (finalMatched.length > 0) {
        replyText = `I searched our live Merchant AI Gateway catalog and found ${finalMatched.length} matching item(s) ready for instant Razorpay Checkout.`;
      } else {
        replyText = `I couldn't find exact matches for "${message}" in the active catalog, but here are our top featured products available for purchase.`;
      }
    }

    // 5. Log completion in audit trail
    if (activeSessionId) {
      await logAuditEvent({
        supabase,
        merchant_id,
        session_id: activeSessionId,
        actor_type: 'ai_assistant',
        event_type: 'catalog_search_completed',
        title: `AI Gateway Response Generated (${modelUsed})`,
        description: `Matched ${finalMatched.length} product(s).`,
        result: 'success',
        meta_json: { model_used: modelUsed, is_fallback: llmResult.isFallback }
      });
    }

    return NextResponse.json({
      session_id: activeSessionId,
      reply: replyText,
      model_used: modelUsed,
      is_fallback: llmResult.isFallback,
      matched_products: finalMatched.map(p => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock_qty,
        description: p.description,
        image_url: p.image_url
      })),
      suggested_chips: [
        'Compare Specs',
        'Check Shipping & Delivery',
        'Proceed to Razorpay Checkout'
      ]
    });

  } catch (error: any) {
    console.error('[AI Chat Route Error]', error);
    return NextResponse.json(
      { error: 'Internal AI Chat Error', details: error.message },
      { status: 500 }
    );
  }
}

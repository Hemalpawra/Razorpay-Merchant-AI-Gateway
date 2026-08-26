import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { createClient } from '@/utils/supabase/server';

const MODEL = 'openai/gpt-5-mini-fast';
const MAX_HISTORY = 12;

export async function POST(request: Request) {
  try {
    const body = await request.json() as { messages?: UIMessage[]; message?: string; history?: Array<{ sender: string; text: string }> };
    const messages = body.messages?.slice(-MAX_HISTORY) ?? (body.message ? [{ id: crypto.randomUUID(), role: 'user', parts: [{ type: 'text', text: body.message }] }] : []);
    if (!messages.length) return Response.json({ error: 'A message is required.' }, { status: 400 });

    const supabase = await createClient();
    const { data: products } = await supabase.from('products').select('sku,name,category,price,stock_qty,description').eq('status', 'active').limit(100);
    const catalog = (products ?? []).map((product: any) => `${product.name} | SKU: ${product.sku} | ${product.category} | ₹${product.price} | stock: ${product.stock_qty ?? 0} | ${product.description ?? ''}`).join('\n');

    const result = streamText({
      model: MODEL,
      system: `You are Merchant AI, a concise and helpful shopping assistant for Razorpay Merchant AI Gateway. Use only the live catalog below for product facts, prices, and stock. Never invent availability or order status. You can recommend products and compare them, but do not claim to create payments or orders. Ask a short clarifying question when needed.\n\nLIVE CATALOG:\n${catalog || 'The catalog is currently empty.'}`,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 600,
    });

    return Response.json({
      reply: await result.text,
      model_used: MODEL,
      matched_products: products ?? [],
      is_fallback: false,
    });
  } catch (error) {
    console.error('[AI Chat Route Error]', error);
    return Response.json({ error: 'The Merchant AI assistant is temporarily unavailable.' }, { status: 500 });
  }
}

export const runtime = 'nodejs';

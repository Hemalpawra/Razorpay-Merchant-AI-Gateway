import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { CatalogGatewayEngine } from '@/lib/gateway/catalog-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      merchant_id, 
      buyer_request_text, 
      external_ai_name = 'External Buyer AI Agent',
      budget_max
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

    const engineResult = await CatalogGatewayEngine.processQuery({
      message: fullMessage,
      mode: 'agent_to_agent'
    });

    const supabase = await createClient();

    // Record matches in product_matches table if session exists
    if (engineResult.session_id && engineResult.matched_products.length > 0) {
      const matchInserts = engineResult.matched_products.map((product, index) => ({
        session_id: engineResult.session_id,
        product_id: product.id,
        rank: index + 1,
        match_score: 1.0 - index * 0.1,
        reason_text: `Matched catalog query via Merchant AI Gateway.`
      }));

      await supabase.from('product_matches').insert(matchInserts);
    }

    return NextResponse.json({
      session_id: engineResult.session_id,
      status: 'success',
      reply: engineResult.reply,
      model_used: engineResult.model_used,
      matches: engineResult.matched_products,
      message: engineResult.matched_products.length > 0 
        ? `Found ${engineResult.matched_products.length} product(s) matching the criteria.` 
        : 'No products found matching the request.'
    });

  } catch (error: any) {
    console.error('[Gateway API Error]', error);
    return NextResponse.json(
      { error: 'Internal server error processing the AI request.', details: error.message },
      { status: 500 }
    );
  }
}

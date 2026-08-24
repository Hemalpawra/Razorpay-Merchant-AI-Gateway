import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { logAuditEvent } from '@/utils/audit';

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const body = await request.json();
    const { 
      merchant_id, 
      buyer_request_text, 
      external_ai_name = 'Unknown AI',
      budget_min,
      budget_max
    } = body;

    if (!merchant_id || !buyer_request_text) {
      return NextResponse.json(
        { error: 'Missing required fields: merchant_id and buyer_request_text are required.' },
        { status: 400 }
      );
    }

    // 1. Create the Buyer Session
    const { data: sessionData, error: sessionError } = await supabase
      .from('buyer_sessions')
      .insert({
        merchant_id,
        external_ai_name,
        buyer_request_text,
        budget_min,
        budget_max,
        status: 'searching'
      })
      .select('id')
      .single();

    if (sessionError || !sessionData) {
      throw new Error(`Failed to create session: ${sessionError?.message}`);
    }

    const session_id = sessionData.id;

    // 2. Log Request Received
    await logAuditEvent({
      supabase,
      merchant_id,
      session_id,
      actor_type: 'ai_assistant',
      event_type: 'request_received',
      title: 'Received buyer request from AI',
      description: `Request: "${buyer_request_text}"`,
      result: 'success',
      meta_json: { external_ai_name, budget_min, budget_max }
    });

    // 3. Search Catalog (Basic MVP Keyword Search)
    // We will do a simple ILIKE on the name or description
    await logAuditEvent({
      supabase,
      merchant_id,
      session_id,
      actor_type: 'system',
      event_type: 'catalog_search_started',
      title: 'Searching product catalog',
      result: 'info'
    });

    // Extract some keywords naively (in a real app, use pgvector or FTS)
    const keywords = buyer_request_text.split(' ').filter((w: string) => w.length > 3);
    
    let query = supabase
      .from('products')
      .select('*')
      .eq('merchant_id', merchant_id)
      .eq('status', 'active');
      
    if (budget_max) query = query.lte('price', budget_max);
    if (budget_min) query = query.gte('price', budget_min);

    // If keywords exist, we do a very basic text search on the first keyword for the MVP
    if (keywords.length > 0) {
      query = query.or(`name.ilike.%${keywords[0]}%,description.ilike.%${keywords[0]}%`);
    }

    const { data: products, error: productsError } = await query.limit(5);

    if (productsError) {
      throw new Error(`Failed to search products: ${productsError.message}`);
    }

    // 4. Record matches in product_matches table
    if (products && products.length > 0) {
      const matchInserts = products.map((product, index) => ({
        session_id,
        product_id: product.id,
        rank: index + 1,
        match_score: 1.0 - (index * 0.1), // Mock score
        reason_text: `Matched keyword or category.`
      }));

      await supabase.from('product_matches').insert(matchInserts);
    }

    // Update session status to awaiting_confirmation
    await supabase
      .from('buyer_sessions')
      .update({ status: 'awaiting_confirmation' })
      .eq('id', session_id);

    // 5. Log Search Completed
    await logAuditEvent({
      supabase,
      merchant_id,
      session_id,
      actor_type: 'system',
      event_type: 'catalog_search_completed',
      title: 'Completed catalog search',
      description: `Found ${products?.length || 0} products.`,
      result: 'success'
    });

    // 6. Return response to external AI
    return NextResponse.json({
      session_id,
      status: 'success',
      matches: products || [],
      message: products && products.length > 0 
        ? `Found ${products.length} product(s) matching the criteria.` 
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

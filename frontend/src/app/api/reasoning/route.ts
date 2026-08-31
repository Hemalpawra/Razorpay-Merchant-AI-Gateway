import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'session_id required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get reasoning steps from audit logs
    const { data: reasoningSteps } = await supabase
      .from('audit_logs')
      .select(`
        id,
        event_type,
        title,
        description,
        created_at,
        meta_json,
        result
      `)
      .eq('session_id', sessionId)
      .in('event_type', [
        'products_searched',
        'products_compared',
        'product_recommended',
        'upsell_shown',
        'cross_sell_shown',
        'missing_details_requested',
        'cart_created',
        'order_created',
        'payment_initiated',
        'payment_completed'
      ])
      .order('created_at', { ascending: true });

    const reasoning = (reasoningSteps || []).map((step: any, index: number) => ({
      id: step.id,
      time: new Date(step.created_at).toLocaleString([], { 
        dateStyle: 'short', 
        timeStyle: 'short' 
      }),
      action: step.title,
      result: step.result === 'success' ? 'Success' : 'Failed',
      note: step.description,
      stepNumber: index + 1,
      metadata: step.meta_json
    }));

    return NextResponse.json({ reasoning });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
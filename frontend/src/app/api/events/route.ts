import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { logAuditEvent } from '@/utils/audit';

const ALLOWED_EVENTS = new Set([
  'product_selected',
  'payment_failed',
  'tracking_viewed',
]);

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      event_type?: string;
      session_id?: string;
      order_id?: string;
      title?: string;
      description?: string;
      meta_json?: Record<string, any>;
    };

    const eventType = body.event_type || '';
    if (!ALLOWED_EVENTS.has(eventType)) {
      return NextResponse.json({ error: 'Unsupported event type' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: merchant } = await supabase.from('merchants').select('id').limit(1).maybeSingle();
    if (!merchant) {
      return NextResponse.json({ error: 'No merchant configured' }, { status: 400 });
    }

    await logAuditEvent({
      supabase,
      merchant_id: merchant.id,
      session_id: body.session_id,
      order_id: body.order_id,
      actor_type: eventType === 'payment_failed' ? 'system' : 'customer',
      event_type: eventType,
      title: body.title || (eventType === 'product_selected' ? 'Product Selected' : eventType === 'payment_failed' ? 'Payment Failed' : 'Tracking Viewed'),
      description: body.description,
      result: eventType === 'payment_failed' ? 'failure' : 'success',
      meta_json: body.meta_json,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Could not record event' }, { status: 500 });
  }
}

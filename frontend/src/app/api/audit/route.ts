import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get('merchant_id');
    const actorType = searchParams.get('actor_type');
    const eventType = searchParams.get('event_type');
    const search = searchParams.get('search');
    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const supabase = await createClient();

    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (merchantId) {
      query = query.eq('merchant_id', merchantId);
    }
    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }
    if (orderId) {
      query = query.eq('order_id', orderId);
    }
    if (actorType && actorType !== 'all') {
      query = query.eq('actor_type', actorType);
    }
    if (eventType && eventType !== 'all') {
      query = query.eq('event_type', eventType);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: auditLogs, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ audit_logs: auditLogs || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

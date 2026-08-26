import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { logAuditEvent } from '@/utils/audit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get('merchant_id');
    const status = searchParams.get('status');

    const supabase = await createClient();

    let query = supabase
      .from('buyer_sessions')
      .select(`
        *,
        product_matches (*, product:products (*)),
        session_checks (*),
        ai_conversation_messages (*)
      `)
      .order('created_at', { ascending: false });

    if (merchantId) {
      query = query.eq('merchant_id', merchantId);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: sessions, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ sessions: sessions || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { session_id, status, claimed_by, merchant_id } = body;

    if (!session_id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (claimed_by) {
      updates.claimed_by = claimed_by;
      updates.claimed_at = new Date().toISOString();
    }

    const { data: session, error } = await supabase
      .from('buyer_sessions')
      .update(updates)
      .eq('id', session_id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const finalMerchantId = merchant_id || session?.merchant_id;
    if (finalMerchantId) {
      await logAuditEvent({
        supabase,
        merchant_id: finalMerchantId,
        session_id,
        actor_type: claimed_by ? 'merchant' : 'system',
        event_type: 'session_updated',
        title: `Session status updated to ${status}`,
        description: claimed_by ? `Claimed by ${claimed_by}` : undefined,
        result: 'success',
        meta_json: { status, claimed_by }
      });
    }

    return NextResponse.json({ session });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

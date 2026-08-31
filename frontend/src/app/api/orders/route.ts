import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { logAuditEvent } from '@/utils/audit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get('merchant_id');
    const orderId = searchParams.get('order_id');
    const sessionId = searchParams.get('session_id');
    const status = searchParams.get('status');

    const supabase = await createClient();

    let query = supabase
      .from('orders')
      .select(`
        *,
        buyer_sessions (*)
      `)
      .order('created_at', { ascending: false });

    if (orderId) {
      query = query.or(`id.eq.${orderId},razorpay_order_id.eq.${orderId}`);
    }
    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }
    if (merchantId) {
      query = query.eq('merchant_id', merchantId);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: orders, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: orders || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { order_id, status, razorpay_payment_id } = body;

    if (!order_id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (razorpay_payment_id) updates.razorpay_payment_id = razorpay_payment_id;

    const { data: order, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', order_id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (order?.merchant_id) {
      await logAuditEvent({
        supabase,
        merchant_id: order.merchant_id,
        order_id: order.id,
        session_id: order.session_id,
        actor_type: 'merchant',
        event_type: 'order_updated',
        title: `Order status updated to ${status}`,
        description: `Order ID ${order.id} updated.`,
        result: 'success',
        meta_json: { status, razorpay_payment_id }
      });
    }

    return NextResponse.json({ order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

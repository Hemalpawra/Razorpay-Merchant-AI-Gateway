import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { logAuditEvent } from '@/utils/audit';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { order_id, type, amount, reason } = body;

    if (!order_id || !type) {
      return NextResponse.json({ error: 'order_id and type required' }, { status: 400 });
    }

    // Get the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (type === 'refund') {
      // Process refund
      // In a real app, this would call Razorpay Refund API
      // For demo, we just update the database
      
      const refundAmount = amount || order.amount;
      const refundId = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const { data: refund, error: refundError } = await supabase
        .from('order_refunds')
        .insert({
          order_id,
          refund_id: refundId,
          amount: refundAmount,
          status: 'processed',
          reason: reason || 'Merchant initiated refund',
          processed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (refundError) {
        // If refunds table doesn't exist, update order status directly
        await supabase
          .from('orders')
          .update({ 
            status: 'refunded',
            refund_status: 'processed',
            refund_amount: refundAmount,
            refund_id: refundId,
            refunded_at: new Date().toISOString()
          })
          .eq('id', order_id);
      }

      await logAuditEvent({
        supabase,
        merchant_id: order.merchant_id,
        order_id: order.id,
        session_id: order.session_id,
        actor_type: 'merchant',
        event_type: 'refund_processed',
        title: `Refund of ₹${refundAmount} processed`,
        description: `Full refund for order ${order.id}`,
        result: 'success',
        meta_json: { refund_id: refundId, amount: refundAmount, reason }
      });

      return NextResponse.json({ 
        success: true, 
        refund_id: refundId,
        amount: refundAmount,
        status: 'processed'
      });
    }

    if (type === 'retry') {
      // Retry payment
      // In a real app, this would trigger a new Razorpay payment link
      
      const retryPaymentLink = `https://rzp.io/i/${order.razorpay_order_id}/retry`;

      await logAuditEvent({
        supabase,
        merchant_id: order.merchant_id,
        order_id: order.id,
        session_id: order.session_id,
        actor_type: 'merchant',
        event_type: 'payment_retry_initiated',
        title: 'Payment retry initiated',
        description: `Payment retry requested for order ${order.id}`,
        result: 'success',
        meta_json: { retry_link: retryPaymentLink }
      });

      return NextResponse.json({
        success: true,
        payment_link: retryPaymentLink,
        expires_in: '15m'
      });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json({ error: 'order_id required' }, { status: 400 });
    }

    // Get refunds for order
    const { data: refunds } = await supabase
      .from('order_refunds')
      .select('*')
      .eq('order_id', orderId)
      .order('processed_at', { ascending: false });

    // Get order refund status
    const { data: order } = await supabase
      .from('orders')
      .select('refund_status, refund_amount, refunded_at')
      .eq('id', orderId)
      .single();

    return NextResponse.json({
      refunds: refunds || [],
      refund_status: order?.refund_status,
      refund_amount: order?.refund_amount,
      refunded_at: order?.refunded_at
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
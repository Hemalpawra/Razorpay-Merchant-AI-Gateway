import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { logAuditEvent } from '@/utils/audit';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      db_order_id,
      customer
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: 'Missing required Razorpay payment IDs' }, { status: 400 });
    }

    // Verify signature
    const isValid = verifyRazorpaySignature({
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature || 'mock_sig'
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid Razorpay payment signature' }, { status: 400 });
    }

    // Update DB Order
    let query = supabase.from('orders').update({
      status: 'paid',
      razorpay_payment_id,
      updated_at: new Date().toISOString()
    });

    if (db_order_id) {
      query = query.eq('id', db_order_id);
    } else {
      query = query.eq('razorpay_order_id', razorpay_order_id);
    }

    const { data: updatedOrder, error: updateError } = await query.select('*').single();

    if (updateError) {
      console.error('Error updating order to paid:', updateError);
    }

    // Update customer details if provided
    if (customer && updatedOrder?.session_id) {
      await supabase.from('customer_details').upsert({
        session_id: updatedOrder.session_id,
        full_name: customer.full_name || customer.name,
        email: customer.email,
        phone: customer.phone,
        shipping_address_line1: customer.line1 || customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        payment_mode: customer.payment_mode || 'UPI'
      });
    }

    // Audit Log
    if (updatedOrder?.merchant_id) {
      await logAuditEvent({
        supabase,
        merchant_id: updatedOrder.merchant_id,
        order_id: updatedOrder.id,
        session_id: updatedOrder.session_id || undefined,
        actor_type: 'system',
        event_type: 'payment_captured',
        title: 'Payment Successfully Captured',
        description: `Payment ${razorpay_payment_id} verified for order ${updatedOrder.id} (₹${updatedOrder.amount})`,
        result: 'success',
        meta_json: { razorpay_order_id, razorpay_payment_id }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order confirmed!',
      order: updatedOrder
    });
  } catch (err: any) {
    console.error('[Payment Verification Error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createRazorpayOrder, RAZORPAY_KEY_ID } from '@/lib/razorpay';
import { logAuditEvent } from '@/utils/audit';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      amount, // Amount in INR
      currency = 'INR',
      merchant_id,
      session_id,
      customer, // { full_name, email, phone, address... }
      items = []
    } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid checkout amount is required' }, { status: 400 });
    }

    // Get default merchant ID if not provided
    let finalMerchantId = merchant_id;
    if (!finalMerchantId) {
      const { data: m } = await supabase.from('merchants').select('id').limit(1).single();
      finalMerchantId = m?.id;
    }

    // Amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    // Call Razorpay API helper
    const razorpayOrder = await createRazorpayOrder({
      amount: amountInPaise,
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        merchant_id: finalMerchantId || '',
        session_id: session_id || '',
        item_count: String(items.length)
      }
    });

    // Save order in Supabase orders table
    const { data: dbOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        merchant_id: finalMerchantId,
        session_id: session_id || null,
        razorpay_order_id: razorpayOrder.id,
        amount,
        currency,
        status: 'draft',
        checkout_url: `/store/checkout`
      })
      .select('*')
      .single();

    if (orderError) {
      console.error('Database Error saving order:', orderError);
    }

    // Save Customer Details if provided
    if (dbOrder && customer) {
      await supabase.from('customer_details').insert({
        session_id: session_id || null,
        full_name: customer.full_name || customer.name || 'Customer',
        email: customer.email,
        phone: customer.phone,
        shipping_address_line1: customer.line1 || customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        country: customer.country || 'India',
        payment_mode: customer.payment_mode || 'UPI'
      });
    }

    // Audit Log
    if (finalMerchantId) {
      await logAuditEvent({
        supabase,
        merchant_id: finalMerchantId,
        session_id: session_id || undefined,
        order_id: dbOrder?.id || undefined,
        actor_type: 'customer',
        event_type: 'checkout_initiated',
        title: 'Razorpay Checkout Initiated',
        description: `Order created for ₹${amount} (Razorpay ID: ${razorpayOrder.id})`,
        result: 'success',
        meta_json: { razorpay_order_id: razorpayOrder.id, amount, currency }
      });
    }

    return NextResponse.json({
      success: true,
      key_id: RAZORPAY_KEY_ID,
      razorpay_order_id: razorpayOrder.id,
      db_order_id: dbOrder?.id,
      amount: amountInPaise,
      currency
    });
  } catch (err: any) {
    console.error('[Create Order Error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

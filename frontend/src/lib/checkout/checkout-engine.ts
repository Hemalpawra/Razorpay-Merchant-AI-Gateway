import { createClient } from '@/utils/supabase/server';
import { createRazorpayOrder, verifyRazorpaySignature, RAZORPAY_KEY_ID } from '@/lib/razorpay';
import { MerchantAuditService } from '@/utils/audit';

export interface CreateOrderParams {
  amount: number;
  currency?: string;
  merchant_id?: string;
  session_id?: string;
  customer?: any;
  items?: any[];
}

export interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature?: string;
  db_order_id?: string;
  customer?: any;
}

export class OrderCheckoutEngine {
  /**
   * Create a new Razorpay checkout order and record it in Supabase DB
   */
  static async createCheckoutSession(params: CreateOrderParams) {
    const { amount, currency = 'INR', merchant_id, session_id, customer, items = [] } = params;

    if (!amount || amount <= 0) {
      throw new Error('Valid checkout amount is required');
    }

    const supabase = await createClient();

    let finalMerchantId: string = merchant_id || '';
    if (!finalMerchantId) {
      const { data: m } = await supabase.from('merchants').select('id').limit(1).single();
      finalMerchantId = m?.id || 'm_demo_101';
    }

    const amountInPaise = Math.round(amount * 100);

    const razorpayOrder = await createRazorpayOrder({
      amount: amountInPaise,
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        merchant_id: finalMerchantId,
        session_id: session_id || '',
        item_count: String(items.length)
      }
    });

    const { data: dbOrder } = await supabase
      .from('orders')
      .insert({
        merchant_id: finalMerchantId,
        session_id: session_id || null,
        razorpay_order_id: razorpayOrder.id,
        amount,
        currency,
        status: 'draft',
        checkout_url: '/store/checkout'
      })
      .select('*')
      .single();

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

    if (finalMerchantId) {
      await MerchantAuditService.logEvent({
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

    return {
      success: true,
      key_id: RAZORPAY_KEY_ID,
      razorpay_order_id: razorpayOrder.id,
      db_order_id: dbOrder?.id,
      amount: amountInPaise,
      currency
    };
  }

  /**
   * Verify Razorpay payment signature and mark order as paid
   */
  static async verifyPaymentSession(params: VerifyPaymentParams) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, db_order_id, customer } = params;

    if (!razorpay_order_id || !razorpay_payment_id) {
      throw new Error('Missing required Razorpay payment IDs');
    }

    const isValid = verifyRazorpaySignature({
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature || 'mock_sig'
    });

    if (!isValid) {
      throw new Error('Invalid Razorpay payment signature');
    }

    const supabase = await createClient();

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

    const { data: updatedOrder } = await query.select('*').single();

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

    if (updatedOrder?.merchant_id) {
      await MerchantAuditService.logPaymentVerified(
        supabase,
        updatedOrder.merchant_id,
        updatedOrder.id,
        razorpay_payment_id
      );
    }

    return {
      success: true,
      message: 'Payment verified and order confirmed!',
      order: updatedOrder
    };
  }
}

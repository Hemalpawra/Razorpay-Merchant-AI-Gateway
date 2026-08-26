import { createClient } from '@/utils/supabase/server';
import { createRazorpayOrder, verifyRazorpaySignature, RAZORPAY_KEY_ID } from '@/lib/razorpay';
import { MerchantAuditService } from '@/utils/audit';

export interface CreateOrderParams {
  currency?: string;
  merchant_id?: string;
  session_id?: string;
  customer?: any;
  items?: Array<{ sku: string; qty: number }>;
  shipping_method?: 'standard' | 'express';
}

const SHIPPING_METHODS: Record<string, number> = {
  standard: 0,
  express: 149,
};

const TAX_RATE = 0.18;
const MAX_QTY_PER_LINE = 10;
const MAX_LINES_PER_ORDER = 50;

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
    const { currency = 'INR', merchant_id, session_id, customer, items = [], shipping_method = 'standard' } = params;

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Cart is empty');
    }
    if (items.length > MAX_LINES_PER_ORDER) {
      throw new Error('Too many distinct items in this order');
    }
    if (!(shipping_method in SHIPPING_METHODS)) {
      throw new Error('Invalid shipping method');
    }

    // Normalize and validate quantities before trusting anything from the client.
    const requestedQtyBySku = new Map<string, number>();
    for (const raw of items) {
      const sku = String(raw?.sku ?? '').trim();
      const qty = Number(raw?.qty);
      if (!sku) throw new Error('Every cart line must reference a product SKU');
      if (!Number.isInteger(qty) || qty <= 0 || qty > MAX_QTY_PER_LINE) {
        throw new Error(`Invalid quantity for ${sku}`);
      }
      requestedQtyBySku.set(sku, (requestedQtyBySku.get(sku) ?? 0) + qty);
    }

    const supabase = await createClient();

    let finalMerchantId: string = merchant_id || '';
    if (!finalMerchantId) {
      const { data: m } = await supabase.from('merchants').select('id').limit(1).single();
      finalMerchantId = m?.id || '';
    }
    if (!finalMerchantId) {
      throw new Error('No merchant is configured for this store');
    }

    // Recompute the total from live, server-side product prices — never trust client-submitted prices.
    const skus = Array.from(requestedQtyBySku.keys());
    const { data: dbProducts, error: productsErr } = await supabase
      .from('products')
      .select('sku, price, status, stock_qty')
      .eq('merchant_id', finalMerchantId)
      .in('sku', skus);

    if (productsErr) {
      throw new Error(`Could not verify cart items: ${productsErr.message}`);
    }

    type DbProductRow = { sku: string; price: number; status: string; stock_qty: number };
    const productRows = (dbProducts ?? []) as unknown as DbProductRow[];
    const productBySku = new Map<string, DbProductRow>(productRows.map((p) => [p.sku, p]));
    let subtotal = 0;
    for (const [sku, qty] of requestedQtyBySku.entries()) {
      const product = productBySku.get(sku);
      if (!product || product.status !== 'active') {
        throw new Error(`Product ${sku} is no longer available`);
      }
      if (Number(product.stock_qty ?? 0) < qty) {
        throw new Error(`Not enough stock for ${sku}`);
      }
      subtotal += Number(product.price) * qty;
    }

    const shippingFee = SHIPPING_METHODS[shipping_method];
    const tax = Math.round(subtotal * TAX_RATE);
    const amount = subtotal + shippingFee + tax;

    if (amount <= 0) {
      throw new Error('Valid checkout amount is required');
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
   * Verify Razorpay payment signature, mark order as paid, and issue an official Invoice
   */
  static async verifyPaymentSession(params: VerifyPaymentParams) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, db_order_id, customer } = params;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error('Missing required Razorpay payment verification fields');
    }

    const isValid = verifyRazorpaySignature({
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature
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

    const { data: updatedOrder, error: orderErr } = await query.select('*').single();
    if (orderErr) {
      console.error('Error updating order status:', orderErr.message);
    }

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

    // Generate Official Attached Invoice
    let invoiceData = null;
    if (updatedOrder) {
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const subtotal = Number(updatedOrder.amount) || 0;
      const taxAmount = Math.round(subtotal * 0.18 * 100) / 100;
      const grandTotal = Math.round((subtotal + taxAmount) * 100) / 100;

      const generatedInvoice = {
        invoice_number: invoiceNumber,
        order_id: updatedOrder.id,
        merchant_id: updatedOrder.merchant_id,
        customer_name: customer?.full_name || customer?.name || 'Customer',
        customer_email: customer?.email || 'customer@example.com',
        subtotal,
        tax_amount: taxAmount,
        discount_amount: 0,
        grand_total: grandTotal,
        currency: updatedOrder.currency || 'INR',
        status: 'issued'
      };

      try {
        const { data: newInv, error: invErr } = await supabase
          .from('invoices')
          .insert(generatedInvoice)
          .select('*')
          .single();

        if (!invErr && newInv) {
          invoiceData = newInv;
        } else {
          invoiceData = generatedInvoice;
        }
      } catch {
        invoiceData = generatedInvoice;
      }
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
      message: 'Payment verified and official order invoice generated!',
      order: updatedOrder,
      invoice: invoiceData
    };
  }
}

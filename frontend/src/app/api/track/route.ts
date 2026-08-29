import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { order_id, phone, email } = await request.json();

    if (!order_id || !phone || !email) {
      return NextResponse.json(
        { error: 'Order ID, phone, and email are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify order exists and matches contact info
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer_details (phone, email),
        order_items (sku, name, qty, unit_price),
        invoices (invoice_number, grand_total)
      `)
      .or(`id.eq.${order_id},razorpay_order_id.eq.${order_id}`)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found or verification failed' },
        { status: 404 }
      );
    }

    const customer = order.customer_details?.[0];
    if (!customer || customer.phone !== phone || customer.email !== email) {
      return NextResponse.json(
        { error: 'Order not found or verification failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
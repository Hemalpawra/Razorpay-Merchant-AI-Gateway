import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');

    if (!productId) {
      return NextResponse.json({ error: 'product_id required' }, { status: 400 });
    }

    // Get product with extended details
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get related AI conversations (where this product was mentioned)
    const { data: conversations } = await supabase
      .from('product_matches')
      .select(`
        id,
        score,
        created_at,
        buyer_sessions (
          id,
          customer_name,
          status
        )
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .limit(20);

    // Get linked orders
    const { data: orders } = await supabase
      .from('order_items')
      .select(`
        id,
        quantity,
        orders (
          id,
          amount,
          status,
          created_at,
          customer_name
        )
      `)
      .eq('product_id', productId)
      .order('orders(created_at)', { ascending: false })
      .limit(20);

    const relatedConversations = (conversations || []).map((c: any) => ({
      id: c.id,
      customerName: (c as any).buyer_sessions?.customer_name || 'Unknown',
      sessionId: (c as any).buyer_sessions?.id,
      status: (c as any).buyer_sessions?.status,
      score: c.score,
      timestamp: c.created_at
    }));

    const linkedOrders = (orders || []).map((o: any) => ({
      id: (o as any).orders?.id,
      amount: (o as any).orders?.amount,
      status: (o as any).orders?.status,
      customerName: (o as any).orders?.customer_name,
      createdAt: (o as any).orders?.created_at,
      quantity: o.quantity
    }));

    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        category: product.category,
        description: product.description,
        tags: product.tags || [],
        shippingNote: product.shipping_note,
        returnNote: product.return_note,
        aiVisibility: product.ai_visibility !== false, // Default true
        status: product.status,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        imageUrl: product.image_url
      },
      relatedConversations,
      linkedOrders
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { product_id, ...updates } = body;

    if (!product_id) {
      return NextResponse.json({ error: 'product_id required' }, { status: 400 });
    }

    const { data: product, error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', product_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
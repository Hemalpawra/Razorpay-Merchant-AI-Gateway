import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { logAuditEvent } from '@/utils/audit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get('merchant_id');
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'active';
    const search = searchParams.get('search');
    const aiVisible = searchParams.get('ai_visibility');

    const supabase = await createClient();

    let query = supabase.from('products').select('*');

    if (merchantId) {
      query = query.eq('merchant_id', merchantId);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`);
    }
    if (aiVisible === 'true') {
      query = query.eq('meta_json->>ai_visibility', 'true');
    }

    query = query.order('created_at', { ascending: false });

    const { data: products, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response = NextResponse.json({ products: products || [] });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      merchant_id,
      sku,
      name,
      description,
      category = 'Electronics',
      price,
      currency = 'INR',
      stock_qty = 10,
      image_url,
      tags = [],
      status = 'active',
      meta_json = {}
    } = body;

    if (!name || !price || !sku) {
      return NextResponse.json(
        { error: 'Missing required product fields: name, sku, price' },
        { status: 400 }
      );
    }

    // Get default merchant ID if not provided
    let finalMerchantId = merchant_id;
    if (!finalMerchantId) {
      const { data: merchant } = await supabase.from('merchants').select('id').limit(1).single();
      finalMerchantId = merchant?.id;
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        merchant_id: finalMerchantId,
        sku,
        name,
        description,
        category,
        price,
        currency,
        stock_qty,
        image_url,
        tags,
        status,
        meta_json
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log Audit Event
    if (finalMerchantId) {
      await logAuditEvent({
        supabase,
        merchant_id: finalMerchantId,
        actor_type: 'merchant',
        event_type: 'product_created',
        title: `Product created: ${name}`,
        description: `Added SKU ${sku} priced at ₹${price}`,
        result: 'success',
        meta_json: { product_id: product.id, sku, price }
      });
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required for update' }, { status: 400 });
    }

    updates.updated_at = new Date().toISOString();

    const { data: product, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (product?.merchant_id) {
      await logAuditEvent({
        supabase,
        merchant_id: product.merchant_id,
        actor_type: 'merchant',
        event_type: 'product_updated',
        title: `Product updated: ${product.name}`,
        description: `Updated stock/price/details for SKU ${product.sku}`,
        result: 'success',
        meta_json: { product_id: id, updates }
      });
    }

    return NextResponse.json({ product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required for deletion' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: product } = await supabase.from('products').select('*').eq('id', id).single();

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (product?.merchant_id) {
      await logAuditEvent({
        supabase,
        merchant_id: product.merchant_id,
        actor_type: 'merchant',
        event_type: 'product_deleted',
        title: `Product deleted: ${product.name}`,
        description: `Removed SKU ${product.sku}`,
        result: 'success',
        meta_json: { product_id: id }
      });
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

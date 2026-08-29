import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface RelationProduct {
  id: string;
  sku: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string;
  stock: 'In stock' | 'Low stock';
  rating: number;
}

interface ProductRelations {
  similar: RelationProduct[];
  better: RelationProduct[];
  frequently_bought: RelationProduct[];
  upgrade: RelationProduct[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const sku = searchParams.get('sku');
    const typesParam = searchParams.get('types') || 'similar,better,frequently_bought,upgrade';

    const supabase = await createClient();

    if (!productId && !sku) {
      return NextResponse.json({ error: 'product_id or sku is required' }, { status: 400 });
    }

    // Get the base product details
    let query = supabase.from('products').select('*');
    if (productId) {
      query = query.eq('id', productId);
    } else if (sku) {
      query = query.eq('sku', sku);
    }
    const { data: product, error: prodError } = await query.single();

    if (prodError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const meta = product.meta_json ?? {};
    const category = product.category;
    const price = Number(product.price);
    const brand = meta.brand ?? '';

    // Build query with ai_visibility filter
    const visibilityCondition = 'meta_json->>ai_visibility.is.null,meta_json->>ai_visibility.eq.true';

    // Get all active products in same category (excluding current)
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('id,sku,name,category,price,stock_qty,image_url,meta_json')
      .eq('status', 'active')
      .or(visibilityCondition);

    if (allError) {
      return NextResponse.json({ error: allError.message }, { status: 500 });
    }

    const otherProducts = (allProducts || []).filter(
      (p: any) => p.id !== productId && p.category === category
    );

    // 1. Similar: same category, price within ±20%
    const similar = (otherProducts || [])
      .filter((p: any) => Math.abs(Number(p.price) - price) / price <= 0.2 && Number(p.stock_qty ?? 0) > 0)
      .slice(0, 4)
      .map((p: any) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        price: Number(p.price),
        image_url: p.image_url,
        category: p.category,
        stock: Number(p.stock_qty ?? 0) > 0 ? 'In stock' : 'Low stock',
        rating: meta.rating ?? 4.5,
      }));

    // 2. Better: same category, higher price AND higher rating
    const better = (otherProducts || [])
      .filter((p: any) => 
        Number(p.price) > price && 
        (meta.rating ?? 4.5) < (p.rating ?? 4.5) &&
        Number(p.stock_qty ?? 0) > 0
      )
      .slice(0, 4)
      .map((p: any) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        price: Number(p.price),
        image_url: p.image_url,
        category: p.category,
        stock: Number(p.stock_qty ?? 0) > 0 ? 'In stock' : 'Low stock',
        rating: p.rating ?? 4.5,
      }));

    // 3. Frequently bought: products that appear together in orders
    // Get orders containing this product
    const { data: ordersWithProduct, error: ordersError } = await supabase
      .from('order_items')
      .select('order_id, product_id, qty, unit_price')
      .eq('product_id', productId);

    if (ordersError) {
      return NextResponse.json({ error: ordersError.message }, { status: 500 });
    }

    const orderIds = (ordersWithProduct || []).map((oi: any) => oi.order_id);
    const uniqueOrderIds = [...new Set(orderIds)];

    let frequently_bought: RelationProduct[] = [];
    if (uniqueOrderIds.length > 0) {
      const { data: itemsInOrders, error: itemsError } = await supabase
        .from('order_items')
        .select('product_id, qty, unit_price')
        .in('order_id', uniqueOrderIds);

      if (!itemsError && itemsInOrders) {
        // Count product co-occurrences
        const productCounts: Record<string, number> = {};
        itemsInOrders.forEach((item: any) => {
          if (item.product_id !== productId) {
            productCounts[item.product_id] = (productCounts[item.product_id] || 0) + 1;
          }
        });

        // Get top co-occurring products
        const sortedProducts = Object.entries(productCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4);

        const productIds = sortedProducts.map(([pid]) => pid);

        if (productIds.length > 0) {
          const { data: coProducts, error: coError } = await supabase
            .from('products')
            .select('id,sku,name,category,price,stock_qty,image_url,meta_json')
            .in('id', productIds)
            .or(visibilityCondition);

          if (!coError && coProducts) {
            frequently_bought = coProducts.map((p: any) => ({
              id: p.id,
              sku: p.sku,
              name: p.name,
              price: Number(p.price),
              image_url: p.image_url,
              category: p.category,
              stock: Number(p.stock_qty ?? 0) > 0 ? 'In stock' : 'Low stock',
              rating: meta.rating ?? 4.5,
            }));
          }
        }
      }
    }

    // 4. Upgrade: same category, premium tier (higher price, same category, from tags)
    const upgrade = (otherProducts || [])
      .filter((p: any) => Number(p.price) > price * 1.5 && Number(p.stock_qty ?? 0) > 0)
      .slice(0, 4)
      .map((p: any) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        price: Number(p.price),
        image_url: p.image_url,
        category: p.category,
        stock: Number(p.stock_qty ?? 0) > 0 ? 'In stock' : 'Low stock',
        rating: meta.rating ?? 4.5,
      }));

    return NextResponse.json({ relations: { similar, better, frequently_bought, upgrade } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
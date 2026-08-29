import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { MerchantAuditService } from '@/utils/audit';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { product_ids, action, value } = body;

    if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
      return NextResponse.json({ error: 'product_ids array required' }, { status: 400 });
    }

    if (!action) {
      return NextResponse.json({ error: 'action required' }, { status: 400 });
    }

    // Get merchant ID
    let merchantId;
    const { data: merchant } = await supabase
      .from('merchants')
      .select('id')
      .limit(1)
      .single();
    merchantId = merchant?.id;

    let updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    switch (action) {
      case 'archive':
        updateData.status = 'archived';
        break;
      case 'activate':
        updateData.status = 'active';
        break;
      case 'delete':
        updateData.status = 'deleted';
        break;
      case 'update_category':
        if (!value) {
          return NextResponse.json({ error: 'value required for update_category' }, { status: 400 });
        }
        updateData.category = value;
        break;
      case 'update_stock':
        if (value === undefined) {
          return NextResponse.json({ error: 'value required for update_stock' }, { status: 400 });
        }
        updateData.stock_qty = parseInt(value) || 0;
        break;
      case 'update_ai_visibility':
        updateData.ai_visibility = value !== false;
        break;
      case 'apply_discount':
        if (value === undefined) {
          return NextResponse.json({ error: 'value required for apply_discount' }, { status: 400 });
        }
        const discountPercent = parseFloat(value);
        // Get current products to apply discount
        const { data: currentProducts } = await supabase
          .from('products')
          .select('id, price, meta_json')
          .in('id', product_ids);

        if (currentProducts) {
          for (const product of currentProducts) {
            const newPrice = Number(product.price) * (1 - discountPercent / 100);
            await supabase
              .from('products')
              .update({
                ...updateData,
                price: newPrice,
                meta_json: {
                  ...(product.meta_json || {}),
                  discount_percent: discountPercent,
                  original_price: product.price,
                  discount_applied_at: new Date().toISOString()
                }
              })
              .eq('id', product.id);
          }
        }
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (action !== 'apply_discount') {
      const { data: updatedProducts, error } = await supabase
        .from('products')
        .update(updateData)
        .in('id', product_ids)
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    if (merchantId) {
      await MerchantAuditService.logEvent({
        supabase,
        merchant_id: merchantId,
        actor_type: 'merchant',
        event_type: 'bulk_product_action',
        title: `Bulk action: ${action}`,
        description: `Applied "${action}" to ${product_ids.length} products`,
        result: 'success',
        meta_json: {
          product_ids,
          action,
          value
        }
      });
    }

    return NextResponse.json({
      success: true,
      count: product_ids.length,
      action,
      message: `Successfully applied ${action} to ${product_ids.length} products`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
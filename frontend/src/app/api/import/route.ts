import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { MerchantAuditService } from '@/utils/audit';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { merchant_id, filename = 'catalog_import.csv', products = [] } = body;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: 'No products provided for import' }, { status: 400 });
    }

    let finalMerchantId = merchant_id;
    if (!finalMerchantId) {
      const { data: m } = await supabase.from('merchants').select('id').limit(1).single();
      finalMerchantId = m?.id;
    }

    const formattedProducts = products.map((p: any, idx: number) => ({
      merchant_id: finalMerchantId,
      sku: p.sku || `SKU-IMP-${Date.now()}-${idx + 1}`,
      name: p.name || 'Imported Product',
      description: p.description || '',
      category: p.category || 'General',
      price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 999,
      currency: p.currency || 'INR',
      stock_qty: typeof p.stock_qty === 'number' ? p.stock_qty : parseInt(p.stock_qty) || 10,
      image_url: p.image_url || p.img || null,
      status: 'active'
    }));

    const { data: inserted, error } = await supabase
      .from('products')
      .insert(formattedProducts)
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Record bulk CSV/Excel product import job log
    const { data: importJob } = await supabase.from('product_imports').insert({
      merchant_id: finalMerchantId,
      filename,
      file_size_bytes: JSON.stringify(body).length,
      total_rows: products.length,
      successful_rows: inserted?.length || 0,
      failed_rows: 0,
      status: 'completed',
      meta_json: { source: 'bulk_api_import' }
    }).select('*').single();

    if (finalMerchantId) {
      await MerchantAuditService.logEvent({
        supabase,
        merchant_id: finalMerchantId,
        actor_type: 'merchant',
        event_type: 'catalog_imported',
        title: `Imported ${inserted?.length || 0} catalog products`,
        description: `Bulk CSV/Excel catalog import completed successfully (${filename}).`,
        result: 'success',
        meta_json: { count: inserted?.length || 0, import_job_id: importJob?.id }
      });
    }

    return NextResponse.json({
      success: true,
      importJob,
      importedCount: inserted?.length || 0,
      products: inserted || []
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

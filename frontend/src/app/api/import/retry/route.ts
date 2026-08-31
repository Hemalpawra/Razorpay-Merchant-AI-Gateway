import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { MerchantAuditService } from "@/utils/audit";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { import_id, products } = body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "No products to retry" }, { status: 400 });
    }

    // Get merchant ID
    let merchantId = body.merchant_id;
    if (!merchantId) {
      const { data: m } = await supabase
        .from("merchants")
        .select("id")
        .limit(1)
        .single();
      merchantId = m?.id;
    }

    // Validate and format products
    const validProducts = [];
    const newIssues = [];

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      
      // Check required fields
      if (!p.sku || !p.name || p.price === undefined) {
        newIssues.push({
          row: i + 1,
          sku: p.sku,
          message: `Missing required fields: sku, name, or price`
        });
        continue;
      }

      // Validate price
      const price = typeof p.price === "number" ? p.price : parseFloat(p.price);
      if (isNaN(price) || price < 0) {
        newIssues.push({
          row: i + 1,
          sku: p.sku,
          message: `Invalid price: ${p.price}`
        });
        continue;
      }

      validProducts.push({
        merchant_id: merchantId,
        sku: p.sku,
        name: p.name,
        description: p.description || "",
        category: p.category || "General",
        price,
        currency: p.currency || "INR",
        stock_qty: typeof p.stock_qty === "number" ? p.stock_qty : parseInt(p.stock_qty) || 10,
        image_url: p.image_url || null,
        status: "active",
      });
    }

    // Insert valid products
    let inserted = [];
    if (validProducts.length > 0) {
      const { data, error } = await supabase
        .from("products")
        .insert(validProducts)
        .select("*");
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      inserted = data || [];
    }

    // Update import job if import_id provided
    if (import_id) {
      const { data: existingJob } = await supabase
        .from("product_imports")
        .select("*")
        .eq("id", import_id)
        .single();

      if (existingJob) {
        const meta = existingJob.meta_json || {};
        const existingIssues = meta.issues || [];
        
        await supabase
          .from("product_imports")
          .update({
            successful_rows: (existingJob.successful_rows || 0) + inserted.length,
            failed_rows: (existingJob.failed_rows || 0) + newIssues.length,
            meta_json: {
              ...meta,
              retry_issues: newIssues,
              retry_count: (meta.retry_count || 0) + 1
            }
          })
          .eq("id", import_id);
      }
    }

    if (merchantId) {
      await MerchantAuditService.logEvent({
        supabase,
        merchant_id: merchantId,
        actor_type: "merchant",
        event_type: "retry_import_processed",
        title: `Retry import: ${inserted.length} products added`,
        description: `Processed ${products.length} previously failed rows`,
        result: "success",
        meta_json: {
          imported_count: inserted.length,
          failed_count: newIssues.length,
          import_id
        }
      });
    }

    return NextResponse.json({
      success: true,
      importedCount: inserted.length,
      failedCount: newIssues.length,
      issues: newIssues,
      products: inserted
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
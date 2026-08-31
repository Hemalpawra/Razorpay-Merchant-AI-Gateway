import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { MerchantAuditService } from "@/utils/audit";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const importId = searchParams.get('import_id');

    // If import_id provided, get specific import details
    if (importId) {
      const { data: importJob } = await supabase
        .from("product_imports")
        .select("*")
        .eq("id", importId)
        .single();

      if (!importJob) {
        return NextResponse.json({ error: "Import not found" }, { status: 404 });
      }

      // Parse issues from meta_json
      const meta = importJob.meta_json || {};
      const issues = meta.issues || [];

      // Categorize issues
      const validationList = issues.map((issue: any) => ({
        row: issue.row,
        sku: issue.sku,
        message: issue.message,
        type: categorizeIssue(issue.message)
      }));

      return NextResponse.json({
        importJob,
        summary: {
          totalRows: importJob.total_rows,
          successfulRows: importJob.successful_rows,
          failedRows: importJob.failed_rows,
          duplicatesFound: meta.duplicates?.length || 0,
          importedSuccessfully: importJob.successful_rows,
          status: importJob.status
        },
        issues: validationList
      });
    }

    // Otherwise return import history
    const { data, error } = await supabase
      .from("product_imports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ imports: data ?? [] });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Could not load import history." },
      { status: 500 },
    );
  }
}

function categorizeIssue(message: string): string {
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('required') && (lowerMsg.includes('price') || lowerMsg.includes('stock'))) {
    return 'missing_required_field';
  }
  if (lowerMsg.includes('price') && (lowerMsg.includes('invalid') || lowerMsg.includes('format'))) {
    return 'invalid_price';
  }
  if (lowerMsg.includes('duplicate') && lowerMsg.includes('sku')) {
    return 'duplicate_sku';
  }
  if (lowerMsg.includes('duplicate') && lowerMsg.includes('name')) {
    return 'duplicate_name';
  }
  if (lowerMsg.includes('image') && (lowerMsg.includes('url') || lowerMsg.includes('invalid'))) {
    return 'bad_image_url';
  }
  if (lowerMsg.includes('stock')) {
    return 'stock_missing';
  }
  if (lowerMsg.includes('category')) {
    return 'category_missing';
  }
  return 'unknown';
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const {
      merchant_id,
      filename = "catalog_import.csv",
      products = [],
    } = body;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "No products provided for import" },
        { status: 400 },
      );
    }

    let finalMerchantId = merchant_id;
    if (!finalMerchantId) {
      const { data: m } = await supabase
        .from("merchants")
        .select("id")
        .limit(1)
        .single();
      finalMerchantId = m?.id;
    }

    const issues = products.flatMap((p: any, idx: number) => {
      const missing = ["sku", "name", "price"].filter(
        (field) =>
          p[field] === undefined ||
          p[field] === null ||
          String(p[field]).trim() === "",
      );
      return missing.length
        ? [
            {
              row: idx + 2,
              sku: p.sku,
              message: `Missing ${missing.join(", ")}`,
            },
          ]
        : [];
    });

    const validProducts = products.filter(
      (p: any, idx: number) => !issues.some((issue) => issue.row === idx + 2),
    );
    const formattedProducts = validProducts.map((p: any, idx: number) => ({
      merchant_id: finalMerchantId,
      sku: p.sku || `SKU-IMP-${Date.now()}-${idx + 1}`,
      name: p.name || "Imported Product",
      description: p.description || "",
      category: p.category || "General",
      price: typeof p.price === "number" ? p.price : parseFloat(p.price) || 999,
      currency: p.currency || "INR",
      stock_qty:
        typeof p.stock_qty === "number"
          ? p.stock_qty
          : parseInt(p.stock_qty) || 10,
      image_url: p.image_url || p.img || null,
      status: "active",
    }));

    const { data: inserted, error } = await supabase
      .from("products")
      .insert(formattedProducts)
      .select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Record bulk CSV/Excel product import job log
    const { data: importJob } = await supabase
      .from("product_imports")
      .insert({
        merchant_id: finalMerchantId,
        filename,
        file_size_bytes: JSON.stringify(body).length,
        total_rows: products.length,
        successful_rows: inserted?.length || 0,
        failed_rows: issues.length,
        status: issues.length ? "completed_with_issues" : "completed",
        meta_json: { source: "bulk_api_import", issues },
      })
      .select("*")
      .single();

    if (finalMerchantId) {
      await MerchantAuditService.logEvent({
        supabase,
        merchant_id: finalMerchantId,
        actor_type: "merchant",
        event_type: "catalog_imported",
        title: `Imported ${inserted?.length || 0} catalog products`,
        description: `Bulk CSV/Excel catalog import completed successfully (${filename}).`,
        result: "success",
        meta_json: {
          count: inserted?.length || 0,
          import_job_id: importJob?.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      importJob,
      importedCount: inserted?.length || 0,
      totalRows: products.length,
      failedCount: issues.length,
      duplicateCount: 0,
      issues,
      products: inserted || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

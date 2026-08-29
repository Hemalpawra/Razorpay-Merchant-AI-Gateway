import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const importId = searchParams.get("import_id");

    if (!importId) {
      return NextResponse.json({ error: "import_id required" }, { status: 400 });
    }

    // Get import job
    const { data: importJob } = await supabase
      .from("product_imports")
      .select("*")
      .eq("id", importId)
      .single();

    if (!importJob) {
      return NextResponse.json({ error: "Import not found" }, { status: 404 });
    }

    // Get failed rows from meta_json
    const meta = importJob.meta_json || {};
    const issues = meta.issues || [];
    const failedRows = issues.map((issue: any) => ({
      row_number: issue.row,
      sku: issue.sku || '',
      issue_type: categorizeIssue(issue.message),
      issue_message: issue.message
    }));

    // Generate CSV
    const headers = ['Row', 'SKU', 'Issue Type', 'Message'];
    const csvRows = [headers.join(',')];
    failedRows.forEach((row: any) => {
      csvRows.push([
        row.row_number,
        `"${row.sku}"`,
        row.issue_type,
        `"${row.issue_message}"`
      ].join(','));
    });
    const csv = csvRows.join('\n');

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="import_errors_${importId}.csv"`
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
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
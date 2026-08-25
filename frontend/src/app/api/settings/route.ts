import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { logAuditEvent } from '@/utils/audit';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: merchant, error } = await supabase
      .from('merchants')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ merchant: merchant || null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id, name, display_name, email } = body;

    let merchantId = id;
    if (!merchantId) {
      const { data: existing } = await supabase.from('merchants').select('id').limit(1).single();
      merchantId = existing?.id;
    }

    if (!merchantId) {
      // Create new merchant
      const { data: created, error: createError } = await supabase
        .from('merchants')
        .insert({
          name: name || 'Test Merchant Co',
          display_name: display_name || 'ElectroStore',
          email: email || 'test@merchant.com'
        })
        .select('*')
        .single();

      if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });
      return NextResponse.json({ merchant: created });
    }

    const { data: updated, error } = await supabase
      .from('merchants')
      .update({
        name,
        display_name,
        email,
        updated_at: new Date().toISOString()
      })
      .eq('id', merchantId)
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await logAuditEvent({
      supabase,
      merchant_id: merchantId,
      actor_type: 'merchant',
      event_type: 'merchant_settings_updated',
      title: 'Merchant Gateway Settings Updated',
      description: `Updated profile details for ${display_name || name}`,
      result: 'success'
    });

    return NextResponse.json({ merchant: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

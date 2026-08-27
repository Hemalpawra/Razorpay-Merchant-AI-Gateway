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
    const { id, name, display_name, email, settings_json } = body;

    let merchantId = id;
    if (!merchantId) {
      const { data: existing } = await supabase.from('merchants').select('id').limit(1).single();
      merchantId = existing?.id;
    }

    if (!merchantId) {
      const { data: created, error: createError } = await supabase
        .from('merchants')
        .insert({
          name: name || 'Test Merchant Co',
          display_name: display_name || 'ElectroStore',
          email: email || 'test@merchant.com',
          settings_json: settings_json || {}
        })
        .select('*')
        .single();

      if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });
      return NextResponse.json({ merchant: created });
    }

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (name) updates.name = name;
    if (display_name) updates.display_name = display_name;
    if (email) updates.email = email;
    if (settings_json !== undefined) updates.settings_json = settings_json;

    const { data: updated, error } = await supabase
      .from('merchants')
      .update(updates)
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
      description: `Updated settings for ${updated.display_name || updated.name}`,
      result: 'success',
      meta_json: { updated_fields: Object.keys(updates) }
    });

    return NextResponse.json({ merchant: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

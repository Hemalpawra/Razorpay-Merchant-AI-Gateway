import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ addresses: [] });
    }

    const supabase = await createClient();

    // Get customer details by email, most recent first
    const { data: addresses, error } = await supabase
      .from('customer_details')
      .select('id, full_name, phone, email, shipping_address_line1, shipping_address_line2, city, state, pincode, nickname, is_default')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ addresses: [] });
    }

    return NextResponse.json({ addresses: addresses || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { email, full_name, phone, shipping_address_line1, shipping_address_line2, city, state, pincode, nickname, is_default } = body;

    if (!email || !full_name || !phone || !shipping_address_line1 || !city || !state || !pincode) {
      return NextResponse.json({ error: 'Missing required address fields' }, { status: 400 });
    }

    // If this is set as default, unset other defaults for this email
    if (is_default) {
      await supabase
        .from('customer_details')
        .update({ is_default: false })
        .eq('email', email);
    }

    // Insert new address
    const { data: address, error } = await supabase
      .from('customer_details')
      .insert({
        email,
        full_name,
        phone,
        shipping_address_line1,
        shipping_address_line2,
        city,
        state,
        pincode,
        nickname,
        is_default: is_default ?? false,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ address }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
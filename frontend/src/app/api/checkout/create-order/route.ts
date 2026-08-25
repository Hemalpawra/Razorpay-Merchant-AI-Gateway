import { NextResponse } from 'next/server';
import { OrderCheckoutEngine } from '@/lib/checkout/checkout-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await OrderCheckoutEngine.createCheckoutSession(body);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[Create Order Error]', err);
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import { OrderCheckoutEngine } from '@/lib/checkout/checkout-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await OrderCheckoutEngine.verifyPaymentSession(body);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[Payment Verification Error]', err);
    return NextResponse.json({ error: err.message || 'Payment verification failed' }, { status: 400 });
  }
}

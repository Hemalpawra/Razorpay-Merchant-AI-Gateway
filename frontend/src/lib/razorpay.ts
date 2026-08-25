import crypto from 'crypto';

export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export type RazorpayOrderOptions = {
  amount: number; // in paise (e.g. 50000 = ₹500.00)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
};

export async function createRazorpayOrder(options: RazorpayOrderOptions) {
  const keyId = RAZORPAY_KEY_ID;
  const keySecret = RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured');
  }

  const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${authHeader}`,
    },
    body: JSON.stringify({
      amount: options.amount,
      currency: options.currency || 'INR',
      receipt: options.receipt,
      notes: options.notes,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Razorpay API Error (${response.status}): ${errText}`);
  }

  return response.json();
}

export function verifyRazorpaySignature(params: {
  order_id: string;
  payment_id: string;
  signature: string;
}): boolean {
  const keySecret = RAZORPAY_KEY_SECRET;
  if (!keySecret || !params.signature) return false;

  const body = `${params.order_id}|${params.payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  return expectedSignature === params.signature;
}

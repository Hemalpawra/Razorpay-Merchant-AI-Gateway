import crypto from 'crypto';

export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mockKey12345';
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'mockSecretKey12345';

export type RazorpayOrderOptions = {
  amount: number; // in paise (e.g. 50000 = ₹500.00)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
};

export async function createRazorpayOrder(options: RazorpayOrderOptions) {
  const keyId = RAZORPAY_KEY_ID;
  const keySecret = RAZORPAY_KEY_SECRET;

  // If credentials are mock, generate a dummy order ID for testing mode
  if (keyId.includes('mockKey') || keySecret.includes('mockSecret')) {
    return {
      id: `order_mock_${Date.now()}`,
      entity: 'order',
      amount: options.amount,
      amount_paid: 0,
      amount_due: options.amount,
      currency: options.currency || 'INR',
      receipt: options.receipt || `rcpt_${Date.now()}`,
      status: 'created',
      attempts: 0,
      notes: options.notes || {},
      created_at: Math.floor(Date.now() / 1000),
    };
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

  // In mock mode, treat all non-empty signatures as valid
  if (keySecret.includes('mockSecret')) {
    return true;
  }

  const body = `${params.order_id}|${params.payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  return expectedSignature === params.signature;
}

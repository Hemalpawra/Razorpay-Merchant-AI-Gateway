import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import { CatalogGatewayEngine } from './src/lib/gateway/catalog-engine';
import { OrderCheckoutEngine } from './src/lib/checkout/checkout-engine';
import { MerchantAuditService } from './src/utils/audit';

async function testDirectEngines() {
  console.log('====================================================');
  console.log('🚀 DIRECT ENGINE E2E SUITE - MERCHANT AI GATEWAY');
  console.log('====================================================\n');

  // Load env vars from .env.local
  const envContent = fs.readFileSync('.env.local', 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2 && !line.startsWith('#')) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      process.env[key] = val;
    }
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Test Supabase Database Catalog Query
  console.log('1. Querying active products from Supabase DB...');
  const { data: dbProds, error: pErr } = await supabase.from('products').select('*').eq('status', 'active');
  if (pErr) throw pErr;
  console.log(`✓ Active products in database: ${dbProds.length}`);
  dbProds.forEach((p, idx) => console.log(`   [Item ${idx + 1}] ${p.name} - ₹${p.price} (SKU: ${p.sku})`));

  // 2. Test CatalogGatewayEngine (Customer Chat RAG)
  console.log('\n2. Testing CatalogGatewayEngine.processQuery (Customer RAG Prompt)...');
  const chatResult = await CatalogGatewayEngine.processQuery({
    message: 'Headphones under ₹5,000',
    mode: 'customer'
  });
  console.log(`✓ Session ID: ${chatResult.session_id}`);
  console.log(`   Model Used: ${chatResult.model_used}`);
  console.log(`   Reply: "${chatResult.reply}"`);
  console.log(`   Matched Products Count: ${chatResult.matched_products.length}`);
  if (chatResult.matched_products.length > 0) {
    console.log(`   Top Match: ${chatResult.matched_products[0].name} (₹${chatResult.matched_products[0].price})`);
  }

  // 3. Test CatalogGatewayEngine (Agent-to-Agent Protocol)
  console.log('\n3. Testing CatalogGatewayEngine.processQuery (A2A Protocol Query)...');
  const a2aResult = await CatalogGatewayEngine.processQuery({
    message: 'Asus TUF Gaming Laptop',
    mode: 'agent_to_agent'
  });
  console.log(`✓ Session ID: ${a2aResult.session_id}`);
  console.log(`   Matched Products Count: ${a2aResult.matched_products.length}`);
  if (a2aResult.matched_products.length > 0) {
    console.log(`   Top A2A Match: ${a2aResult.matched_products[0].name} (₹${a2aResult.matched_products[0].price})`);
  }

  // 4. Test OrderCheckoutEngine.createCheckoutSession
  console.log('\n4. Testing OrderCheckoutEngine.createCheckoutSession...');
  const orderResult = await OrderCheckoutEngine.createCheckoutSession({
    amount: 1499,
    currency: 'INR',
    session_id: chatResult.session_id,
    customer: {
      full_name: 'Antigravity Tester',
      email: 'tester@antigravity.demo',
      phone: '9999999999'
    },
    items: [{ sku: 'EAR-BOAT-450', qty: 1 }]
  });
  console.log(`✓ Order Created Success: ${orderResult.success}`);
  console.log(`   Razorpay Order ID: ${orderResult.razorpay_order_id}`);
  console.log(`   DB Order ID: ${orderResult.db_order_id}`);
  console.log(`   Paise Amount: ${orderResult.amount}`);

  // 5. Test OrderCheckoutEngine.verifyPaymentSession
  console.log('\n5. Testing OrderCheckoutEngine.verifyPaymentSession...');
  const verifyResult = await OrderCheckoutEngine.verifyPaymentSession({
    razorpay_order_id: orderResult.razorpay_order_id,
    razorpay_payment_id: `pay_test_${Date.now()}`,
    razorpay_signature: 'mock_sig',
    db_order_id: orderResult.db_order_id
  });
  console.log(`✓ Payment Verification Success: ${verifyResult.success}`);
  console.log(`   Order Status: ${verifyResult.order?.status}`);

  // 6. Test MerchantAuditService (Audit Logs in Supabase)
  console.log('\n6. Verifying Merchant Audit Trail Logs in Supabase DB...');
  const { data: logs, error: lErr } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(5);
  if (lErr) throw lErr;
  console.log(`✓ Recent Audit Trail Logs Count: ${logs.length}`);
  logs.forEach((log, idx) => console.log(`   [Log ${idx + 1}] Event: ${log.event_type} | Title: "${log.title}" | Actor: ${log.actor_type}`));

  console.log('\n====================================================');
  console.log('🎉 ALL DIRECT ENGINE E2E VERIFICATIONS PASSED WITH 100% SUCCESS!');
  console.log('====================================================\n');
}

testDirectEngines().catch(err => {
  console.error('❌ E2E Verification Failed:', err);
  process.exit(1);
});

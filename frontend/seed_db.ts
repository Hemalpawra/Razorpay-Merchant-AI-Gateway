import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const parts = line.split('=');
      return [parts[0], parts.slice(1).join('=')];
    })
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding dummy data...');
  
  // 1. Insert Merchant
  const { data: merchant, error: mError } = await supabase
    .from('merchants')
    .insert({
      name: 'Test Merchant Co',
      email: 'test@merchant.com',
      display_name: 'ElectroStore'
    })
    .select('id')
    .single();

  if (mError) {
    console.error('Error inserting merchant:', mError.message);
    if (mError.code === '23505') {
       console.log('Test merchant already exists. Skipping seed.');
       return;
    }
    process.exit(1);
  }

  const merchant_id = merchant.id;
  console.log('Created Merchant:', merchant_id);

  // 2. Insert Products
  const products = [
    {
      merchant_id,
      sku: 'LAP-001',
      name: 'Gaming Laptop X Pro',
      description: 'High performance gaming laptop with 32GB RAM and RTX 4080.',
      category: 'Electronics',
      price: 150000,
      stock_qty: 10
    },
    {
      merchant_id,
      sku: 'MOU-002',
      name: 'Wireless Gaming Mouse',
      description: 'Ergonomic wireless mouse with low latency.',
      category: 'Accessories',
      price: 5000,
      stock_qty: 50
    },
    {
      merchant_id,
      sku: 'KEY-003',
      name: 'Mechanical Keyboard RGB',
      description: 'Clicky mechanical keyboard with customizable RGB.',
      category: 'Accessories',
      price: 8000,
      stock_qty: 25
    }
  ];

  const { error: pError } = await supabase.from('products').insert(products);

  if (pError) {
    console.error('Error inserting products:', pError.message);
    process.exit(1);
  }

  console.log('Successfully seeded 3 products!');
  console.log('\n--- TEST DATA READY ---');
  console.log('Use this merchant_id for your API tests:', merchant_id);
}

seed();

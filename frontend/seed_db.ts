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
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding comprehensive data (Merchants, Products, CSV Imports, Orders, Invoices, Audits)...');
  
  // 1. Get or create Merchant
  let merchant_id: string;
  const { data: existingMerchants } = await supabase.from('merchants').select('id').limit(1);

  if (existingMerchants && existingMerchants.length > 0) {
    merchant_id = existingMerchants[0].id;
  } else {
    const { data: merchant, error: mError } = await supabase
      .from('merchants')
      .insert({
        name: 'ElectroStore Merchant',
        email: 'merchant@electrostore.com',
        display_name: 'ElectroStore',
        currency: 'INR',
        settings_json: { auto_approve: true, max_discount_pct: 15 }
      })
      .select('id')
      .single();

    if (mError) {
      console.error('Error inserting merchant:', mError.message);
      process.exit(1);
    }
    merchant_id = merchant.id;
  }

  console.log('Active Merchant ID:', merchant_id);

  // 2. Rich Catalog Products
  const products = [
    {
      merchant_id,
      sku: 'EAR-BOAT-450',
      name: 'boAt Rockerz 450 Wireless Headphones',
      description: 'On-ear bluetooth headphones with 40mm drivers and 15H battery life.',
      category: 'Headphones & Earbuds',
      price: 1499,
      stock_qty: 45,
      image_url: '/store/p-headphones.jpg',
      tags: ['audio', 'wireless', 'headphones'],
      status: 'active'
    },
    {
      merchant_id,
      sku: 'EAR-SONY-XM5',
      name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
      description: 'Industry leading active noise cancellation with 8 mics and Auto NC Optimizer.',
      category: 'Headphones & Earbuds',
      price: 26990,
      stock_qty: 20,
      image_url: '/store/p-headphones.jpg',
      tags: ['audio', 'noise-cancelling', 'premium'],
      status: 'active'
    },
    {
      merchant_id,
      sku: 'EAR-AIRPODS-PRO2',
      name: 'Apple AirPods Pro (2nd Gen)',
      description: 'Active Noise Cancellation, Adaptive Audio, and USB-C MagSafe Charging Case.',
      category: 'Headphones & Earbuds',
      price: 24900,
      stock_qty: 15,
      image_url: '/store/p-earbuds.jpg',
      tags: ['apple', 'earbuds', 'wireless'],
      status: 'active'
    },
    {
      merchant_id,
      sku: 'LAP-ASUS-TUF-F15',
      name: 'Asus TUF Gaming F15 Laptop',
      description: '15.6 inch FHD 144Hz, Intel Core i5 11th Gen, RTX 3050 graphics, 16GB RAM 512GB SSD.',
      category: 'Laptops',
      price: 58990,
      stock_qty: 12,
      image_url: '/store/p-laptop.jpg',
      tags: ['gaming', 'laptop', 'asus'],
      status: 'active'
    },
    {
      merchant_id,
      sku: 'LAP-ACER-NITRO5',
      name: 'Acer Nitro 5 Gaming Laptop',
      description: 'AMD Ryzen 5 5600H, GTX 1650, 8GB RAM 512GB SSD, 144Hz FHD Display.',
      category: 'Laptops',
      price: 54990,
      stock_qty: 18,
      image_url: '/store/p-laptop.jpg',
      tags: ['gaming', 'laptop', 'acer'],
      status: 'active'
    },
    {
      merchant_id,
      sku: 'MOU-WIRELESS-01',
      name: 'Ergonomic Wireless Gaming Mouse',
      description: 'Ultra lightweight 2.4GHz wireless gaming mouse with 16000 DPI sensor.',
      category: 'Accessories',
      price: 1999,
      stock_qty: 60,
      image_url: '/store/p-earbuds.jpg',
      tags: ['accessories', 'mouse'],
      status: 'active'
    },
    {
      merchant_id,
      sku: 'KEY-MECH-RGB',
      name: 'Wireless Mechanical Keyboard RGB',
      description: 'Compact 75% hot-swappable mechanical keyboard with custom RGB backlight.',
      category: 'Accessories',
      price: 4999,
      stock_qty: 30,
      image_url: '/store/p-earbuds.jpg',
      tags: ['accessories', 'keyboard'],
      status: 'active'
    },
    {
      merchant_id,
      sku: 'SPK-JBL-GO3',
      name: 'JBL Go 3 Portable Waterproof Speaker',
      description: 'IP67 waterproof and dustproof portable Bluetooth speaker with Pro Sound.',
      category: 'Speakers',
      price: 2199,
      stock_qty: 25,
      image_url: '/store/p-speaker.jpg',
      tags: ['speaker', 'jbl', 'bluetooth'],
      status: 'active'
    }
  ];

  for (const prod of products) {
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('sku', prod.sku)
      .limit(1);

    if (!existing || existing.length === 0) {
      await supabase.from('products').insert(prod);
    }
  }

  // 3. Seed CSV Product Import History
  const { data: existingImports } = await supabase.from('product_imports').select('id').limit(1);
  if (!existingImports || existingImports.length === 0) {
    await supabase.from('product_imports').insert([
      {
        merchant_id,
        filename: 'electronics_catalog_2026.csv',
        file_size_bytes: 48291,
        total_rows: 8,
        successful_rows: 8,
        failed_rows: 0,
        status: 'completed',
        meta_json: { source: 'manual_csv_upload' }
      }
    ]);
  }

  // 4. Seed Dummy Order & Attached Invoice
  const { data: existingOrders } = await supabase.from('orders').select('id').limit(1);
  if (!existingOrders || existingOrders.length === 0) {
    const { data: newOrder } = await supabase.from('orders').insert({
      merchant_id,
      razorpay_order_id: 'order_demo_101',
      razorpay_payment_id: 'pay_demo_999',
      amount: 1499,
      currency: 'INR',
      status: 'paid'
    }).select('id').single();

    if (newOrder) {
      await supabase.from('invoices').insert({
        invoice_number: 'INV-2026-0001',
        order_id: newOrder.id,
        merchant_id,
        customer_name: 'Hemal Pawra',
        customer_email: 'hemal@example.com',
        subtotal: 1499,
        tax_amount: 270,
        discount_amount: 0,
        grand_total: 1769,
        currency: 'INR',
        status: 'issued'
      });
    }
  }

  console.log('✓ Successfully seeded database with products, CSV import logs, orders, and invoices!');
}

seed();

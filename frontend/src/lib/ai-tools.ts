import { createClient } from '@/utils/supabase/server';
import { type Product } from '@/lib/store/catalog';

export interface CatalogProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock_qty: number;
  description: string | null;
  image_url: string | null;
}

export interface ProductMatch {
  product: CatalogProduct;
  rank: number;
  match_score: number;
  reason: string;
}

export interface SearchCatalogArgs {
  query: string;
  category?: string;
  max_price?: number;
  in_stock_only?: boolean;
  limit?: number;
}

export interface CompareProductsArgs {
  skus: string[];
}

export interface CreateOrderArgs {
  session_id: string;
  items: Array<{ sku: string; qty: number }>;
  customer: {
    full_name: string;
    email: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
    payment_mode: 'upi' | 'card' | 'netbanking';
  };
  shipping_method: 'standard' | 'express';
  currency: 'INR';
}

export interface VerifyPaymentArgs {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  db_order_id: string;
}

export interface GetOrderStatusArgs {
  order_id: string;
}

export interface GetProductDetailsArgs {
  sku: string;
}

export type ToolName = 
  | 'search_catalog'
  | 'get_product_details'
  | 'compare_products'
  | 'create_razorpay_order'
  | 'verify_payment'
  | 'get_order_status';

export interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function searchCatalog(args: SearchCatalogArgs): Promise<ToolResult<ProductMatch[]>> {
  try {
    const supabase = await createClient();
    const { data: products } = await supabase
      .from('products')
      .select('id,sku,name,category,price,stock_qty,description,image_url,meta_json')
      .eq('status', 'active')
      .or('meta_json->>ai_visibility.is.null,meta_json->>ai_visibility.eq.true')
      .limit(args.limit ?? 20);

    if (!products || products.length === 0) {
      return { success: true, data: [] };
    }

    const lower = args.query.toLowerCase();
    const isGreeting = lower.length <= 3 || /^(hi|hello|hey|help|thanks|thank you|ok|okay|yes|no)\b/i.test(lower);
    const budgetMatch = lower.match(/(?:under|below|less than|budget of?)\s*₹?\s*(\d[\d,]*)/);
    const maxBudget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, ''), 10) : null;
    const keywords = lower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2);

    const filtered = (products as CatalogProduct[]).filter((p) => {
      if (args.category && p.category !== args.category) return false;
      if (args.max_price !== undefined && Number(p.price) > args.max_price) return false;
      if (maxBudget !== null && Number(p.price) > maxBudget) return false;
      if (args.in_stock_only && (p.stock_qty ?? 0) <= 0) return false;
      if (isGreeting) return false;
      const hay = `${p.name} ${p.category} ${p.description ?? ''}`.toLowerCase();
      return keywords.some((kw) => hay.includes(kw));
    });

    const matches: ProductMatch[] = filtered.slice(0, args.limit ?? 4).map((p, index) => ({
      product: p,
      rank: index + 1,
      match_score: 1.0 - index * 0.15,
      reason: `Matched: ${keywords.filter(k => `${p.name} ${p.category}`.toLowerCase().includes(k)).join(', ')}`,
    }));

    return { success: true, data: matches };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getProductDetails(args: GetProductDetailsArgs): Promise<ToolResult<CatalogProduct>> {
  try {
    const supabase = await createClient();
    const { data: product } = await supabase
      .from('products')
      .select('id,sku,name,category,price,stock_qty,description,image_url,meta_json')
      .eq('sku', args.sku)
      .eq('status', 'active')
      .or('meta_json->>ai_visibility.is.null,meta_json->>ai_visibility.eq.true')
      .single();

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    return { success: true, data: product as CatalogProduct };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function compareProducts(args: CompareProductsArgs): Promise<ToolResult<CatalogProduct[]>> {
  try {
    const supabase = await createClient();
    const { data: products } = await supabase
      .from('products')
      .select('id,sku,name,category,price,stock_qty,description,image_url,meta_json')
      .in('sku', args.skus)
      .eq('status', 'active')
      .or('meta_json->>ai_visibility.is.null,meta_json->>ai_visibility.eq.true');

    if (!products || products.length === 0) {
      return { success: true, data: [] };
    }

    return { success: true, data: products as CatalogProduct[] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createRazorpayOrder(args: CreateOrderArgs): Promise<ToolResult<{
  key_id: string;
  razorpay_order_id: string;
  amount: number;
  db_order_id: string;
  currency: string;
}>> {
  try {
    const supabase = await createClient();

    const { data: items } = await supabase
      .from('products')
      .select('sku,price')
      .in('sku', args.items.map(i => i.sku));

    const productItems = items as Array<{ sku: string; price: number | string }> | null;

    if (!productItems || productItems.length === 0) {
      return { success: false, error: 'No valid products found' };
    }

    let subtotal = 0;
    for (const item of args.items) {
      const product = productItems.find((p) => p.sku === item.sku);
      if (product) {
        subtotal += Number(product.price) * item.qty;
      }
    }

    const taxAmount = Math.round(subtotal * 0.18);
    const shippingAmount = args.shipping_method === 'express' ? 100 : 0;
    const totalAmount = subtotal + taxAmount + shippingAmount;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        session_id: args.session_id,
        merchant_id: (await supabase.from('merchants').select('id').limit(1).single()).data?.id,
        amount: totalAmount,
        currency: args.currency,
        status: 'draft',
        razorpay_order_id: `order_${Date.now()}`,
        idempotency_key: `idem_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      })
      .select('id')
      .single();

    if (orderError || !order) {
      return { success: false, error: 'Failed to create order' };
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? 'rzp_test_mock';

    return {
      success: true,
      data: {
        key_id: keyId,
        razorpay_order_id: order.razorpay_order_id,
        amount: totalAmount * 100,
        db_order_id: order.id,
        currency: args.currency,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function verifyPayment(args: VerifyPaymentArgs): Promise<ToolResult<{ verified: boolean; order_id: string }>> {
  try {
    const supabase = await createClient();

    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        razorpay_payment_id: args.razorpay_payment_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', args.db_order_id)
      .select('id')
      .single();

    if (error || !order) {
      return { success: false, error: 'Payment verification failed' };
    }

    return { success: true, data: { verified: true, order_id: order.id } };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getOrderStatus(args: GetOrderStatusArgs): Promise<ToolResult<{
  id: string;
  status: string;
  amount: number;
  currency: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  invoices: Array<{ invoice_number: string; grand_total: number }>;
  created_at: string;
}>> {
  try {
    const supabase = await createClient();
    const { data: order } = await supabase
      .from('orders')
      .select('id,status,amount,currency,razorpay_order_id,razorpay_payment_id,created_at,invoices(invoice_number,grand_total)')
      .or(`id.eq.${args.order_id},razorpay_order_id.eq.${args.order_id}`)
      .single();

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    return {
      success: true,
      data: {
        id: order.id,
        status: order.status,
        amount: Number(order.amount),
        currency: order.currency,
        razorpay_order_id: order.razorpay_order_id,
        razorpay_payment_id: order.razorpay_payment_id,
        invoices: order.invoices ?? [],
        created_at: order.created_at,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export const TOOL_DEFINITIONS = {
  search_catalog: {
    name: 'search_catalog',
    description: 'Search the product catalog for matching products based on user query, category, price, and stock filters.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'User search query (e.g., "headphones under 5000")' },
        category: { type: 'string', description: 'Filter by product category (e.g., "headphones-earbuds", "laptops")' },
        max_price: { type: 'number', description: 'Maximum price filter in INR' },
        in_stock_only: { type: 'boolean', description: 'Only return products with stock > 0' },
        limit: { type: 'number', description: 'Maximum number of results (default 4)' },
      },
      required: ['query'],
    },
  },
  get_product_details: {
    name: 'get_product_details',
    description: 'Get full product details by SKU including description, specs, stock, and image.',
    parameters: {
      type: 'object',
      properties: {
        sku: { type: 'string', description: 'Product SKU' },
      },
      required: ['sku'],
    },
  },
  compare_products: {
    name: 'compare_products',
    description: 'Compare multiple products side by side by their SKUs.',
    parameters: {
      type: 'object',
      properties: {
        skus: { type: 'array', items: { type: 'string' }, description: 'Array of product SKUs to compare (2-4)' },
      },
      required: ['skus'],
    },
  },
  create_razorpay_order: {
    name: 'create_razorpay_order',
    description: 'Create a Razorpay order for the selected items. Requires customer shipping details.',
    parameters: {
      type: 'object',
      properties: {
        session_id: { type: 'string', description: 'Current buyer session ID' },
        items: { type: 'array', items: { type: 'object', properties: { sku: { type: 'string' }, qty: { type: 'number' } }, required: ['sku', 'qty'] } },
        customer: {
          type: 'object',
          properties: {
            full_name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            line1: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            pincode: { type: 'string' },
            payment_mode: { type: 'string', enum: ['upi', 'card', 'netbanking'] },
          },
          required: ['full_name', 'email', 'phone', 'line1', 'city', 'state', 'pincode', 'payment_mode'],
        },
        shipping_method: { type: 'string', enum: ['standard', 'express'] },
        currency: { type: 'string', enum: ['INR'] },
      },
      required: ['session_id', 'items', 'customer', 'shipping_method', 'currency'],
    },
  },
  verify_payment: {
    name: 'verify_payment',
    description: 'Verify Razorpay payment signature and update order status.',
    parameters: {
      type: 'object',
      properties: {
        razorpay_order_id: { type: 'string' },
        razorpay_payment_id: { type: 'string' },
        razorpay_signature: { type: 'string' },
        db_order_id: { type: 'string' },
      },
      required: ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature', 'db_order_id'],
    },
  },
  get_order_status: {
    name: 'get_order_status',
    description: 'Get order status, invoice, and tracking info by order ID.',
    parameters: {
      type: 'object',
      properties: {
        order_id: { type: 'string', description: 'Internal order ID or Razorpay order ID' },
      },
      required: ['order_id'],
    },
  },
} as const;
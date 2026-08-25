-- Migration: 20260825000000_comprehensive_schema.sql
-- Comprehensive Database Schema & Indexing for Razorpay Merchant AI Gateway

-- Enable extensions for text search & UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. MERCHANTS
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    razorpay_key_id TEXT,
    razorpay_key_secret TEXT,
    currency TEXT DEFAULT 'INR',
    settings_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    stock_qty INTEGER DEFAULT 0,
    image_url TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    status TEXT DEFAULT 'active',
    meta_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PRODUCT IMPORTS (CSV/Excel Bulk Import History)
CREATE TABLE IF NOT EXISTS public.product_imports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_size_bytes BIGINT,
    total_rows INTEGER DEFAULT 0,
    successful_rows INTEGER DEFAULT 0,
    failed_rows INTEGER DEFAULT 0,
    status TEXT DEFAULT 'completed',
    error_summary TEXT,
    meta_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BUYER SESSIONS
CREATE TABLE IF NOT EXISTS public.buyer_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
    external_ai_name TEXT,
    buyer_request_text TEXT NOT NULL,
    budget_min NUMERIC,
    budget_max NUMERIC,
    status TEXT DEFAULT 'active',
    claimed_by TEXT,
    claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PRODUCT MATCHES
CREATE TABLE IF NOT EXISTS public.product_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.buyer_sessions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    match_score NUMERIC,
    reason_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SESSION CHECKS
CREATE TABLE IF NOT EXISTS public.session_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.buyer_sessions(id) ON DELETE CASCADE,
    check_type TEXT NOT NULL,
    passed BOOLEAN NOT NULL,
    message TEXT,
    meta_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.buyer_sessions(id) ON DELETE CASCADE,
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'draft',
    checkout_url TEXT,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. CUSTOMER DETAILS
CREATE TABLE IF NOT EXISTS public.customer_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.buyer_sessions(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    shipping_address_line1 TEXT,
    shipping_address_line2 TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    country TEXT DEFAULT 'India',
    payment_mode TEXT DEFAULT 'UPI',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. INVOICES (Official Order Invoices)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
    customer_name TEXT,
    customer_email TEXT,
    subtotal NUMERIC NOT NULL,
    tax_amount NUMERIC DEFAULT 0,
    discount_amount NUMERIC DEFAULT 0,
    grand_total NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'issued',
    pdf_url TEXT,
    meta_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.buyer_sessions(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    actor_type TEXT NOT NULL,
    event_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    result TEXT DEFAULT 'info',
    meta_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES (B-Tree + Trigram Text Search)
CREATE INDEX IF NOT EXISTS idx_products_merchant_status ON public.products(merchant_id, status);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON public.products USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_product_imports_merchant ON public.product_imports(merchant_id);
CREATE INDEX IF NOT EXISTS idx_buyer_sessions_merchant ON public.buyer_sessions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_orders_merchant_status ON public.orders(merchant_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay ON public.orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_order ON public.invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_merchant ON public.invoices(merchant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_merchant ON public.audit_logs(merchant_id);

-- ENABLE RLS (Row Level Security) ON ALL PUBLIC TABLES
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- CREATE PERMISSIVE RLS POLICIES FOR SERVICE ROLE & AUTHENTICATED/ANON USERS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to merchants') THEN
        CREATE POLICY "Allow public access to merchants" ON public.merchants FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to products') THEN
        CREATE POLICY "Allow public access to products" ON public.products FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to product_imports') THEN
        CREATE POLICY "Allow public access to product_imports" ON public.product_imports FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to buyer_sessions') THEN
        CREATE POLICY "Allow public access to buyer_sessions" ON public.buyer_sessions FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to product_matches') THEN
        CREATE POLICY "Allow public access to product_matches" ON public.product_matches FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to session_checks') THEN
        CREATE POLICY "Allow public access to session_checks" ON public.session_checks FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to orders') THEN
        CREATE POLICY "Allow public access to orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to customer_details') THEN
        CREATE POLICY "Allow public access to customer_details" ON public.customer_details FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to invoices') THEN
        CREATE POLICY "Allow public access to invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to audit_logs') THEN
        CREATE POLICY "Allow public access to audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

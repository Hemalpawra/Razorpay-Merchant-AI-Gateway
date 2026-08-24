-- 1. merchants
CREATE TABLE public.merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. products
CREATE TABLE public.products (
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
    tags TEXT[],
    status TEXT DEFAULT 'active',
    meta_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. buyer_sessions
CREATE TABLE public.buyer_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
    external_ai_name TEXT,
    buyer_request_text TEXT NOT NULL,
    budget_min NUMERIC,
    budget_max NUMERIC,
    status TEXT DEFAULT 'created',
    claimed_by TEXT,
    claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. product_matches
CREATE TABLE public.product_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.buyer_sessions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    match_score NUMERIC,
    reason_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. session_checks
CREATE TABLE public.session_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.buyer_sessions(id) ON DELETE CASCADE,
    check_type TEXT NOT NULL,
    passed BOOLEAN NOT NULL,
    message TEXT,
    meta_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. orders
CREATE TABLE public.orders (
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

-- 7. customer_details
CREATE TABLE public.customer_details (
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
    country TEXT,
    payment_mode TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. audit_logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.buyer_sessions(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    actor_type TEXT NOT NULL,
    event_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    result TEXT,
    meta_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_merchant_id ON public.products(merchant_id);
CREATE INDEX idx_buyer_sessions_merchant_id ON public.buyer_sessions(merchant_id);
CREATE INDEX idx_product_matches_session_id ON public.product_matches(session_id);
CREATE INDEX idx_session_checks_session_id ON public.session_checks(session_id);
CREATE INDEX idx_orders_session_id ON public.orders(session_id);
CREATE INDEX idx_orders_merchant_id ON public.orders(merchant_id);
CREATE INDEX idx_customer_details_session_id ON public.customer_details(session_id);
CREATE INDEX idx_audit_logs_merchant_id ON public.audit_logs(merchant_id);
CREATE INDEX idx_audit_logs_session_id ON public.audit_logs(session_id);
CREATE INDEX idx_audit_logs_order_id ON public.audit_logs(order_id);

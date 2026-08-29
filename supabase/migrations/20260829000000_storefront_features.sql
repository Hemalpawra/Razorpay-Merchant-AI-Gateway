-- Migration: 20260829000000_storefront_features.sql
-- Adds storefront features: tracking stages, refund status, saved addresses

-- 1. Add tracking_stage to orders
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS tracking_stage TEXT DEFAULT 'preparing'
CHECK (tracking_stage IN ('preparing', 'packed', 'shipped', 'out_for_delivery', 'delivered'));

-- 2. Add refund fields to orders
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS refund_status TEXT
CHECK (refund_status IN ('pending', 'processed', 'failed'));

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS refund_amount NUMERIC;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP WITH TIME ZONE;

-- 3. Add nickname and is_default to customer_details
ALTER TABLE public.customer_details
ADD COLUMN IF NOT EXISTS nickname TEXT;

ALTER TABLE public.customer_details
ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT FALSE;

-- 4. Add index for customer_details lookups by email
CREATE INDEX IF NOT EXISTS idx_customer_details_email ON public.customer_details(email);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_stage ON public.orders(tracking_stage);

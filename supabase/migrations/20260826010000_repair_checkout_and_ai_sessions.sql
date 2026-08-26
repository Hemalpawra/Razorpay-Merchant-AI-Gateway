-- Align the live database with the checkout and AI session application contract.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS subtotal NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_amount NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_amount NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS razorpay_payment_signature TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_payment_json JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.customer_details
  ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE;

ALTER TABLE public.buyer_sessions
  ADD COLUMN IF NOT EXISTS channel TEXT NOT NULL DEFAULT 'storefront',
  ADD COLUMN IF NOT EXISTS customer_query TEXT;

UPDATE public.buyer_sessions
SET customer_query = COALESCE(customer_query, buyer_request_text)
WHERE customer_query IS NULL;

ALTER TABLE public.buyer_sessions
  ALTER COLUMN customer_query SET DEFAULT '',
  ALTER COLUMN customer_query SET NOT NULL;

CREATE TABLE IF NOT EXISTS public.ai_conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.buyer_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  meta_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS invoices_one_per_order_idx ON public.invoices(order_id);
CREATE UNIQUE INDEX IF NOT EXISTS customer_details_one_per_order_idx ON public.customer_details(order_id) WHERE order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS customer_details_order_id_idx ON public.customer_details(order_id);
CREATE UNIQUE INDEX IF NOT EXISTS product_matches_session_product_idx
  ON public.product_matches(session_id, product_id);
CREATE INDEX IF NOT EXISTS ai_conversation_messages_session_created_idx
  ON public.ai_conversation_messages(session_id, created_at);

ALTER TABLE public.ai_conversation_messages ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_conversation_messages' AND policyname = 'Allow public access to conversation messages') THEN
    CREATE POLICY "Allow public access to conversation messages"
      ON public.ai_conversation_messages FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

COMMENT ON COLUMN public.orders.razorpay_payment_json IS 'Verified Razorpay payment payload retained for reconciliation.';
COMMENT ON COLUMN public.orders.razorpay_payment_signature IS 'Signature used to verify the Razorpay payment.';
COMMENT ON TABLE public.ai_conversation_messages IS 'Persisted customer and assistant messages for merchant session visibility.';

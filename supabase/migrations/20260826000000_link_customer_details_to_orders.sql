ALTER TABLE public.customer_details
  ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS customer_details_order_id_idx
  ON public.customer_details(order_id);

COMMENT ON COLUMN public.customer_details.order_id IS
  'The checkout order this customer snapshot belongs to.';

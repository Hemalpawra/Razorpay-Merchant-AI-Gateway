-- Align live schema with application expectations (applied 2026-08-26)

alter table public.buyer_sessions
  add column if not exists external_ai_name text,
  add column if not exists buyer_request_text text,
  add column if not exists budget_min numeric,
  add column if not exists budget_max numeric;

update public.buyer_sessions set external_ai_name = 'Customer' where external_ai_name is null;

alter table public.customer_details
  add column if not exists order_id uuid references public.orders(id) on delete cascade;

create unique index if not exists customer_details_order_id_key on public.customer_details(order_id);
create index if not exists idx_customer_details_order_id on public.customer_details(order_id);

alter table public.orders
  add column if not exists razorpay_payment_signature text,
  add column if not exists razorpay_payment_json jsonb;

create index if not exists idx_orders_session_id on public.orders(session_id);
create index if not exists idx_audit_logs_session_id on public.audit_logs(session_id);
create index if not exists idx_audit_logs_order_id on public.audit_logs(order_id);

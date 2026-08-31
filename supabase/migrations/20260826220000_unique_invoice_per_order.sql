-- One invoice per order (required by verify-payment upsert on order_id)

create unique index if not exists invoices_order_id_key on public.invoices(order_id);
create index if not exists idx_invoices_order_id on public.invoices(order_id);

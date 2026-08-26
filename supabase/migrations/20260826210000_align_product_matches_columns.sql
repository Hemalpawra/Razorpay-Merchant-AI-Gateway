-- Align product_matches columns with application expectations (applied 2026-08-26)

alter table public.product_matches
  add column if not exists rank integer,
  add column if not exists match_score numeric,
  add column if not exists reason_text text;

update public.product_matches set reason_text = coalesce(reason_text, reason) where reason is not null and reason_text is null;

create unique index if not exists product_matches_session_product_key on public.product_matches(session_id, product_id);
create index if not exists idx_product_matches_session on public.product_matches(session_id);

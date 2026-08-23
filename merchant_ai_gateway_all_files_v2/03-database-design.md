# 03 Database Design

## Goal
Store catalog data, buyer sessions, matches, orders, payment references, missing details, and audit logs in a small relational database.

## Recommended Database
- Postgres
- Supabase Postgres is fine for the MVP

## Core Tables

### merchants
Stores merchant account data.

Fields:
- id
- name
- email
- display_name
- created_at
- updated_at

### products
Stores catalog items.

Fields:
- id
- merchant_id
- sku
- name
- description
- category
- price
- currency
- stock_qty
- image_url
- tags
- status
- meta_json
- created_at
- updated_at

### buyer_sessions
Stores each buyer request session.

Fields:
- id
- merchant_id
- external_ai_name
- buyer_request_text
- budget_min
- budget_max
- status
- claimed_by
- claimed_at
- created_at
- updated_at

### product_matches
Stores products returned by the matcher.

Fields:
- id
- session_id
- product_id
- rank
- match_score
- reason_text
- created_at

### session_checks
Stores rule checks.

Fields:
- id
- session_id
- check_type
- passed
- message
- meta_json
- created_at

### orders
Stores checkout and payment state.

Fields:
- id
- session_id
- merchant_id
- razorpay_order_id
- razorpay_payment_id
- amount
- currency
- status
- checkout_url
- idempotency_key
- created_at
- updated_at

### customer_details
Stores missing or supplied details when needed.

Fields:
- id
- session_id
- full_name
- email
- phone
- shipping_address_line1
- shipping_address_line2
- city
- state
- pincode
- country
- payment_mode
- created_at
- updated_at

### audit_logs
Append-only event history.

Fields:
- id
- merchant_id
- session_id
- order_id
- actor_type
- event_type
- title
- description
- result
- meta_json
- created_at

## Relationships

- One merchant has many products
- One merchant has many buyer sessions
- One session has many product matches
- One session has many checks
- One session can have one order
- One session can have one customer detail record
- One session has many audit logs

## Status Values

### Session status
- created
- searching
- awaiting_missing_details
- awaiting_confirmation
- order_created
- paid
- failed
- cancelled

### Order status
- draft
- created
- paid
- failed
- cancelled

### Product status
- active
- inactive
- out_of_stock

## Indexes
Add indexes on:
- merchant_id
- session_id
- order_id
- razorpay_order_id
- status
- created_at
- updated_at

## Data Rules
- audit logs must never be edited in place
- failed requests should stay stored
- order states should be updated, not replaced
- customer fields should be stored only when needed
- one session should map to one active claim when reviewed by a human

## Example Audit Event Types
- request_received
- catalog_search_started
- catalog_search_completed
- product_selected
- budget_check_passed
- budget_check_failed
- details_missing
- approval_requested
- approval_received
- razorpay_order_created
- payment_succeeded
- payment_failed
- order_completed
- order_cancelled

## Suggested MVP Choice
Use Supabase tables with row-level access for the merchant dashboard and server-only writes for sensitive events.

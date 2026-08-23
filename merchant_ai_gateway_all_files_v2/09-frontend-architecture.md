# 09 Frontend Architecture

## Goal
Build a clean dashboard-style frontend that looks and feels like Razorpay.

## Stack
- Next.js App Router
- TypeScript
- Razorpay Blade
- server actions or API calls
- lightweight state handling
- polling or SSE for live updates

## Frontend Structure
```text
app/
  dashboard/
  sessions/
  orders/
  audit/
  settings/
components/
  layout/
  cards/
  forms/
  tables/
  status/
lib/
  api/
  ui/
  utils/
```

## Main Frontend Areas

### Dashboard
- request queue
- status cards
- recent events
- short summary numbers

### Session Inbox
- searchable table
- filters
- pagination or virtualization
- claim action
- last updated time

### Session Details
- buyer request
- product matches
- selected product
- checks
- action buttons

### Order Details
- Razorpay order ID
- payment status
- checkout link
- invoice link
- retry state

### Audit Trail
- timeline
- event table
- filters by status or type
- live refresh indicator

## State Handling
Each screen should support:
- loading
- empty
- success
- warning
- error

## Component Plan
Build reusable components for:
- summary card
- product card
- status badge
- rule check row
- audit event row
- order summary
- confirmation panel
- session row

## UI Behavior
- show clear primary CTA
- keep secondary actions quiet
- avoid page clutter
- use drawers or modals only when needed

## Blade First Rule
When Blade has a component, use it.

Do not create custom versions of:
- buttons
- inputs
- cards
- alerts
- tables
- dialogs
- tabs
- badges

## Routing
Use simple route groups:
- /dashboard
- /sessions
- /sessions/[id]
- /orders/[id]
- /audit/[sessionId]
- /settings

## Frontend Success Criteria
- user can read the request fast
- user can see why a product was chosen
- user can see if money is blocked or allowed
- user can understand the order result
- user can inspect the audit trail
- user can manage many sessions without overload

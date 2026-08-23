# 08 Development Guidelines

## Goal
Give a clear build path for a small team or an AI coding agent.

## Suggested Stack
- Next.js
- TypeScript
- Supabase or Postgres
- Razorpay test mode
- Razorpay Blade
- server actions or route handlers
- simple audit logging
- optional job queue for scale

## Folder Structure
```text
app/
components/
lib/
server/
types/
db/
docs/
```

## Code Rules
- keep components small
- keep naming clear
- avoid deep nesting
- separate UI from business logic
- validate inputs at the edge
- write explicit error messages

## Data Rules
- keep order writes server-side
- keep audit log writes append-only
- do not expose secrets in client code
- store payment refs safely
- support claim and lock fields for sessions

## Feature Build Order
1. catalog model
2. session model
3. search and match
4. rules engine
5. Razorpay order creation
6. audit log
7. dashboard UI
8. approval and outcome screens
9. failure handling
10. session inbox and filters
11. live audit updates

## Error Handling
Every error must include:
- code
- message
- next step

## Logging
Log:
- request received
- match found
- rule passed or failed
- order created
- payment status
- final outcome
- session claimed if human review happens

## UI Development Rules
- use Blade first
- avoid custom widgets unless needed
- keep action buttons consistent
- keep forms simple
- use clear states for loading and failure

## Build Priority
Do the trust flow before extra polish.

If the flow works, then improve visuals.
If the flow fails, fix the flow first.

# 12 Audit Trail

## Goal
Define how the system records every important action.

## Audit Trail Purpose
The audit trail proves:
- what the AI requested
- what the system decided
- what checks were run
- what payment action happened
- why a step was blocked or allowed
- how each session moved through the system

## Audit Record Fields
Each event should store:
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

## Event Format Example
- Request received
- Product match found
- Budget check passed
- Customer confirmation received
- Razorpay order created
- Payment succeeded
- Order completed

## Event Types
- request_received
- catalog_search_started
- catalog_search_completed
- product_selected
- budget_check_passed
- budget_check_failed
- stock_check_passed
- stock_check_failed
- approval_requested
- approval_received
- details_missing
- razorpay_order_created
- payment_succeeded
- payment_failed
- order_completed
- order_cancelled
- policy_blocked
- session_claimed

## Display Rules
In the UI, the trail should show:
- time
- action
- result
- reason
- next step

## Important Rule
Do not edit logs in place.
Write a new log event for each new state.

## Audit Trail UI
A good audit trail should look like a simple timeline:
1. request
2. search
3. match
4. check
5. approval
6. payment
7. order
8. final result

## Real-time Audit Trail
Use polling or SSE to refresh the active session and the newest events.

For scale:
- show live updates for the current session
- keep older logs paginated
- avoid reloading the whole page
- keep the timeline append-only

## Failure Logging
Every failure must still be logged.
A failure is not a broken state.
It is a valid event with a clear reason.

## Success Criteria
A reviewer should be able to read the audit trail and understand the full order story in less than a minute.

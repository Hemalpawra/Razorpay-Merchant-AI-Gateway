# 10 Backend Architecture

## Goal
Create a small backend that handles request logic, order creation, and audit logging.

## Backend Principles
- server-first for sensitive actions
- clear service boundaries
- minimal surface area
- strong validation
- safe payment handling

## Backend Modules

### Request Handler
Receives buyer intent and creates a session.

### Catalog Search Module
Reads product rows and finds matches.

### Match Scoring Module
Ranks products by:
- budget fit
- feature fit
- stock fit
- policy fit

### Rules Module
Checks:
- budget
- stock
- missing details
- approval requirement
- merchant policy

### Razorpay Module
Handles:
- order creation
- checkout link generation
- payment status updates
- webhook handling

### Audit Module
Writes append-only events.

### Session Inbox Module
Handles list retrieval, filtering, pagination, and claim logic.

## Recommended Flow
1. validate request
2. create session
3. search catalog
4. score matches
5. run checks
6. create order if allowed
7. write audit events
8. return response

## Service Boundaries
Keep the backend split by intent:
- session service
- catalog service
- order service
- audit service
- rule service

## Important Rules
- never trust client input directly
- never write payment data from the browser
- never hide a failed payment event
- never skip audit logging
- never let duplicate requests create duplicate orders

## Webhooks
Use Razorpay webhooks to update:
- payment success
- payment failure
- checkout expiry

## Concurrency Notes
For many sessions at once:
- use database rows as the source of truth
- use status fields for state transitions
- use idempotency keys
- use queue workers if needed
- keep list endpoints paginated

## Backend Success Criteria
- correct product match
- correct rule enforcement
- correct Razorpay order creation
- correct webhook state update
- correct audit log output
- safe handling of concurrent sessions

# 11 Security and Trust

## Goal
Protect merchants, customers, and payment actions.

## Trust Model
The merchant gateway is the trusted middle layer.

It must never allow money actions without:
- clear rule checks
- explicit permission when needed
- logged events
- payment provider confirmation

## Security Principles
- validate all inputs
- keep secrets on the server
- limit sensitive data storage
- record important actions
- show clear error states
- avoid silent failures

## Sensitive Data
Treat these as sensitive:
- shipping address
- email
- phone number
- payment reference IDs
- checkout links
- auth tokens
- Razorpay secret keys

## Permissions
The system should support:
- read-only product search
- checkout approval
- manual payment path
- full AI-assisted path only when allowed

## Merchant Controls
The merchant can define:
- allowed categories
- budget limits
- stock rules
- payment permissions
- fallback behavior
- who can claim a live session

## Trust Features
- visible reasons for each recommendation
- visible state for each payment step
- audit log for every action
- clear failure handling
- session-level traceability
- protected merchant access

## Interface Split
The system should be split into:
- customer side interface
- merchant side interface

### Customer side
- open or lightly protected
- used for request, checkout, and confirmation

### Merchant side
- password protected
- used for catalog, sessions, audit logs, and settings

## Demo Access Rule
Judges should be able to test live from the customer side.
Merchant side should be protected with demo credentials.
This keeps the admin side private while still allowing a live demo.

## Threats to Avoid
- direct client-side payment creation
- unlogged order changes
- hidden AI decisions
- uncontrolled retry loops
- unsafe data exposure
- duplicate order creation

## Best Practices
- server-side validation
- append-only logs
- short-lived sessions
- clear permission checks
- explicit order state changes
- use idempotency keys
- lock sessions when claimed

## Success Measure
A merchant should be able to trust the system because every important step is visible and explainable.

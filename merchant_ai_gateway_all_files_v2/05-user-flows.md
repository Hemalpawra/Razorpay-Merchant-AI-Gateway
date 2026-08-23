# 05 User Flows

## Goal
Show the full product behavior from request to payment to audit trail.

## Flow 1: Full AI-assisted flow

1. Customer asks AI assistant for a product.
2. External AI sends request to merchant gateway.
3. Gateway creates session.
4. Gateway searches catalog.
5. Gateway ranks products.
6. Gateway checks budget and stock.
7. Gateway explains the choice.
8. Customer confirms.
9. Gateway creates Razorpay order.
10. Payment completes.
11. Merchant receives order.
12. Audit trail saves every step.

## Flow 2: Missing details flow

1. Customer asks AI assistant for a product.
2. Gateway matches a product.
3. Gateway finds missing fields.
4. Gateway returns missing field list.
5. Customer AI asks customer for address or phone.
6. Customer supplies details.
7. Gateway resumes checkout.
8. Order is created.
9. Payment completes.
10. Audit trail records the detour.

## Flow 3: Manual payment flow

1. Customer asks AI assistant for a product.
2. Gateway matches product.
3. Customer has not allowed AI payment.
4. Gateway creates Razorpay order.
5. Gateway returns checkout link.
6. Customer opens link and pays manually.
7. Merchant receives order.
8. Audit trail records final state.

## Flow 4: Out-of-budget flow

1. Request comes in.
2. Gateway finds a product above budget.
3. Gateway refuses auto checkout.
4. Gateway shows cheaper alternatives.
5. Customer confirms a new option or stops.
6. Audit trail records failure and fallback.

## Flow 5: Out-of-stock flow

1. Request comes in.
2. Gateway finds a matching product.
3. Stock is zero.
4. Gateway offers another product.
5. Audit trail records blocked product and replacement.

## Flow 6: Payment failure flow

1. Customer confirms order.
2. Razorpay payment fails.
3. Gateway updates order status.
4. Gateway shows retry or alternate action.
5. Audit trail records failure.

## Flow 7: Many live sessions flow

1. Many requests arrive at once.
2. Each request becomes one session record.
3. Session inbox shows the list with filters.
4. Merchant opens one session in a drawer.
5. Merchant claims it if human review is needed.
6. Background process continues matching and checks.
7. Updates appear in the inbox and audit trail.

## UI Flow Order
Recommended order of screens:
1. Dashboard
2. Session inbox
3. Session detail drawer
4. Approval state
5. Outcome screen
6. Audit trail view
7. Optional catalog and settings screen

## Key Human Message
At every step, the user should understand:
- what the AI found
- why it chose it
- what is still missing
- whether money is about to move
- what happened after payment

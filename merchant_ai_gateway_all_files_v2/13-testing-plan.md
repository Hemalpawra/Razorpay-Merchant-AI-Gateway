# 13 Testing Plan

## Goal
Make sure the flow works end to end and the failure paths are safe.

## Test Areas

### Catalog tests
- create product
- update stock
- update price
- search by query
- search by budget
- import from CSV
- import from JSON or API

### Session tests
- create session
- continue session
- resume after missing details
- cancel session
- claim session for human review
- handle many sessions in list

### Rule tests
- budget pass
- budget fail
- out-of-stock pass
- out-of-stock fail
- approval needed
- policy blocked

### Payment tests
- create Razorpay test order
- handle success webhook
- handle payment failure
- handle order expiry
- prevent duplicate order creation

### Audit tests
- write event
- read event list
- preserve order
- keep failed events
- refresh live events

### UI Tests
- dashboard loads
- inbox loads
- session details load
- audit trail renders
- error states render
- loading states render

## End-to-End Tests
1. request -> match -> check -> order -> pay -> audit
2. request -> missing details -> resume -> pay -> audit
3. request -> manual link -> customer pays -> audit
4. request -> budget fail -> fallback -> audit
5. request -> out-of-stock -> alternate product -> audit
6. many sessions -> inbox -> filter -> open drawer -> claim -> resolve

## Acceptance Criteria
The build passes if:
- the correct product is chosen
- the order is created in Razorpay test mode
- failures are shown clearly
- logs are complete
- the UI stays readable
- the session inbox works with many live items

## Demo Readiness Check
Before demo:
- verify test order creation
- verify at least one success path
- verify one failure path
- verify audit trail visibility
- verify session inbox and claim flow
- verify all screens load cleanly

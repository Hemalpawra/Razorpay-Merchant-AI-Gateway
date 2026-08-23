# 04 API Specification

## Goal
Define the minimal API needed for merchant-side AI commerce.

## API Style
Use REST endpoints for clarity.

## Base Path
/api

## Endpoints

### POST /sessions
Create a new buyer session.

Request:
```json
{
  "merchantId": "m_123",
  "externalAiName": "ChatGPT",
  "buyerRequestText": "Find a wireless keyboard under 4000",
  "budgetMax": 4000
}
```

Response:
```json
{
  "sessionId": "s_123",
  "status": "created"
}
```

### POST /sessions/:id/match
Match products for a request.

Response:
```json
{
  "sessionId": "s_123",
  "matches": [
    {
      "productId": "p_1",
      "rank": 1,
      "score": 96,
      "reason": "Fits budget, in stock, wireless, RGB"
    }
  ]
}
```

### POST /sessions/:id/checks
Run rule checks.

Response:
```json
{
  "sessionId": "s_123",
  "checks": [
    { "type": "budget", "passed": true, "message": "Within limit" },
    { "type": "stock", "passed": true, "message": "Available" }
  ]
}
```

### POST /sessions/:id/quote
Return the selected product and next step.

Response:
```json
{
  "sessionId": "s_123",
  "selectedProduct": {
    "id": "p_1",
    "name": "Nova Keyboard"
  },
  "nextStep": "awaiting_confirmation"
}
```

### POST /orders
Create a Razorpay test-mode order.

Request:
```json
{
  "sessionId": "s_123",
  "amount": 3899,
  "currency": "INR",
  "idempotencyKey": "abc-123"
}
```

Response:
```json
{
  "orderId": "o_123",
  "razorpayOrderId": "order_abc",
  "checkoutUrl": "https://..."
}
```

### POST /orders/:id/confirm
Confirm an order after user approval.

### POST /webhooks/razorpay
Receive payment updates from Razorpay.

### GET /sessions/:id
Fetch session state.

### GET /sessions
List sessions for the merchant inbox with filters and pagination.

### GET /orders/:id
Fetch order state.

### GET /audit/:sessionId
Fetch audit log entries for a session.

## Error Format
All errors should return a simple structure.

```json
{
  "error": {
    "code": "OUT_OF_BUDGET",
    "message": "The selected product exceeds the budget.",
    "nextStep": "show_alternatives"
  }
}
```

## Error Codes
- INVALID_REQUEST
- NO_MATCH
- OUT_OF_BUDGET
- OUT_OF_STOCK
- MISSING_DETAILS
- APPROVAL_REQUIRED
- PAYMENT_FAILED
- ORDER_CREATE_FAILED
- POLICY_BLOCKED
- DUPLICATE_REQUEST

## API Rules
- keep responses small
- keep messages clear
- include next step hints where useful
- log every API action
- do not expose secrets in responses
- support pagination for session lists

# 02 System Architecture

## Architecture Goal
Build a simple merchant-side system that can receive a buyer request from an external AI assistant, search a catalog, apply checks, create a Razorpay test order, and store a complete audit trail.

## High-level Architecture

```text
Customer AI Assistant
        |
        v
Merchant AI Gateway API
        |
        +--> Catalog Service
        +--> Rules Engine
        +--> Product Matching
        +--> Razorpay Test Mode
        +--> Audit Log Service
        +--> Order Store
        +--> Merchant Dashboard
        +--> Session Inbox / Queue
```

## Core Services

### 1. Merchant AI Gateway API
The main entry point for requests from external AI assistants.

Responsibilities:
- receive buyer intent
- validate request shape
- start or continue a session
- call catalog search
- apply checks
- return recommendation or checkout data

### 2. Catalog Service
Stores merchant product data in a structured way.

Responsibilities:
- read catalog records
- search by budget, title, category, tags, stock, and metadata
- return normalized product cards for the UI and AI layer
- support manual import, CSV or Excel import, JSON sync, and API sync

### 3. Product Matching Service
Ranks products against the buyer request.

Responsibilities:
- score based on budget fit
- score based on feature match
- score based on stock and availability
- produce a short reason text

### 4. Rules Engine
Protects the merchant.

Responsibilities:
- budget guard
- stock guard
- category guard
- policy guard
- missing data detection
- payment permission check

### 5. Razorpay Integration Service
Connects to Razorpay test mode.

Responsibilities:
- create order
- return checkout session or link
- update status after payment
- store payment reference IDs

### 6. Audit Log Service
Stores every step.

Responsibilities:
- write event logs
- store reason text
- store outcomes
- preserve failure history
- support merchant review
- update live views with polling or SSE

### 7. Merchant Dashboard
The admin UI for the merchant.

Responsibilities:
- show current sessions
- show product matches
- show payment states
- show failed flows
- show audit trail timeline

### 8. Session Inbox
Handles many live sessions at once.

Responsibilities:
- list sessions in queue form
- filter by status
- support pagination or virtualization
- allow opening a detail drawer
- allow claim or assignment for human review if needed

## Recommended Deployment Shape

### Frontend
- Next.js app
- Blade UI components
- Server-side rendering where useful

### Backend
- Next.js route handlers or server actions
- small service layer
- one shared request/session model
- background job runner if needed for scale

### Database
- Postgres or Supabase
- simple relational schema
- audit logs in append-only table

### External APIs
- Razorpay test-mode API
- optional AI model API for request understanding

## Data Flow

### Request path
1. External AI assistant sends request
2. Gateway receives request
3. Session is created or updated
4. Catalog search runs
5. Matching service ranks products
6. Rules engine checks safety
7. Razorpay order is created if safe
8. Response is returned to customer AI
9. Audit trail is written

### Checkout path
1. Customer confirms
2. Checkout link or session is used
3. Razorpay payment completes
4. Payment status is updated
5. Merchant receives order state
6. Audit trail stores final outcome

## Main State Model

### Session state
- created
- searching
- matched
- awaiting_missing_details
- awaiting_confirmation
- order_created
- payment_pending
- paid
- failed
- cancelled

### Order state
- draft
- created
- paid
- failed
- cancelled

## Interface Boundaries

### What the merchant AI gateway owns
- request handling
- product search
- decision explanation
- policy checks
- checkout creation
- audit logging
- session queue processing

### What Razorpay owns
- payment processing
- payment confirmation
- payment failure details
- final payment reference

### What the merchant owns
- catalog
- policy rules
- order fulfillment
- invoice generation
- customer support

## Failure Handling
The architecture must support:
- out-of-budget product
- missing shipping info
- no payment permission
- out-of-stock product
- payment failure
- Razorpay order failure
- network failure
- malformed request
- queue backlog
- duplicate requests

Each failure should return:
- clear message
- next step
- audit entry

## Build Strategy
Use a lean service split.

Do not over-engineer.

A practical structure:
- one web app
- one API layer
- one database
- one payment integration
- one audit log model
- one queue style session inbox

## Blade Usage
The frontend must use Razorpay Blade components where possible.

Prefer Blade for:
- buttons
- cards
- banners
- tables
- modals
- drawers
- tabs
- badges
- alert states
- form inputs

## Architecture Rule
The UI should look like a control panel for a payment product, not a consumer chatbot.

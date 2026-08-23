# Merchant AI Gateway — Compact Product Spec

## 1. Product Summary
Merchant AI Gateway is a Razorpay Buildathon concept for AI Growth & Agentic Commerce.

It helps merchants sell to AI buyers by making the store readable to AI assistants, keeping money actions safe, and logging the full flow in an audit trail.

## 2. Goal
Build a merchant-side AI layer that can:
- receive a buyer request from an external AI assistant or from the merchant’s own site AI
- read a structured product catalog
- match products to the request
- check budget, stock, and merchant rules
- create a Razorpay test order
- return a checkout link or session
- record every step in an audit trail

## 3. What the Product Is
This is merchant infrastructure, not just a shopping chatbot.

The merchant stays in control of:
- product data
- pricing
- stock
- policy rules
- order creation
- fulfillment
- audit history

The customer can use:
- ChatGPT
- Claude
- Gemini
- Grok
- any other AI assistant
- or the merchant’s own site AI

## 4. Core Idea
There is one Merchant AI Gateway on the merchant side.

It talks to any external AI assistant or the merchant’s own conversational AI.
It answers product questions, suggests products, supports upsell and cross-sell, checks rules, creates the Razorpay order, and returns the checkout step.

## 5. Supported Checkout Paths

### Path A: AI-assisted purchase
1. Customer asks the AI assistant for a product.
2. The AI sends the request to the Merchant AI Gateway.
3. The gateway searches the catalog and recommends products.
4. Customer confirms.
5. The gateway creates the Razorpay test order.
6. Payment completes.
7. Order is confirmed.

### Path B: Missing details
1. Customer request comes without shipping address, phone, or payment permission.
2. The gateway returns the missing fields.
3. Customer AI collects them.
4. Checkout continues.

### Path C: Manual payment link
1. Customer does not allow AI to pay.
2. The gateway creates a Razorpay checkout link.
3. Customer finishes payment manually.

## 6. Information Architecture

### Public customer side
- Home / Landing
- Products
- Product Detail
- Ask Merchant AI
- AI Purchase Status
- Missing Details
- Checkout
- Success / Invoice
- Order History

### Protected merchant side
- Dashboard
- Live Sessions
- Session Detail Drawer
- Orders
- Products
- Product Import
- Audit Trail
- AI Connect
- Analytics
- Settings
- API Keys
- Webhooks / Policies

## 7. Screen Summary

### Customer Side
- **Home**: simple intro and demo entry
- **Products**: store listing like a normal ecommerce site
- **Product Detail**: image, price, stock, specs, and AI entry point
- **Ask Merchant AI**: conversational buying flow
- **AI Purchase Status**: live progress tracker
- **Missing Details**: shipping, phone, or payment prompts
- **Checkout**: Razorpay handoff
- **Success / Invoice**: confirmation and receipt
- **Order History**: prior orders

### Merchant Side
- **Dashboard**: live numbers and activity
- **Live Sessions**: session inbox for many active requests
- **Session Detail Drawer**: request, matches, checks, checkout, audit
- **Orders**: payment and order records
- **Products**: catalog table
- **Product Import**: manual, CSV, Excel, JSON, API
- **Audit Trail**: event timeline
- **AI Connect**: AI store URL, endpoint, readiness, test connection
- **Analytics**: requests, conversion, failures, top products
- **Settings**: profile, policies, notifications, access control
- **API Keys**: public, secret, webhook keys
- **Webhooks / Policies**: payment hooks and rules

## 8. User Flows

### Customer flow
1. Customer asks an AI assistant for a product.
2. AI sends the request to the Merchant AI Gateway.
3. Gateway searches products.
4. Gateway explains the best match.
5. Gateway checks rules.
6. If needed, gateway asks for missing details.
7. Gateway creates Razorpay order.
8. Customer confirms or pays manually.
9. Order is placed.
10. Audit trail stores all events.

### Merchant flow
1. Merchant imports products.
2. Merchant sets rules and policies.
3. Live sessions arrive in the inbox.
4. Merchant opens a session in the drawer.
5. Merchant reviews matches, checks, and payment state.
6. Merchant sees the audit trail.
7. Merchant reviews orders and analytics.

## 9. Multi-Session Handling
The system must support many live sessions at once.

Use a session inbox instead of a single chat screen.

The inbox should have:
- search
- filters
- pagination or virtualization
- status chips
- updated time
- claim or assign action for human review
- detail drawer for one session at a time

Backend should use:
- one database row per session
- clear session states
- idempotency keys
- indexed queries
- background jobs if needed

## 10. Product Import
Merchants can add products in 4 ways:
- manual form
- CSV or Excel upload
- JSON or API sync
- catalog copy from another source

Product fields should support:
- name
- SKU
- description
- category
- price
- currency
- stock
- images
- tags
- shipping notes
- return notes
- status
- meta JSON for extra data

## 11. Audit Trail
The audit trail is append-only.

It must record:
- request received
- catalog searched
- product matched
- budget checked
- stock checked
- approval requested
- approval received
- missing details
- Razorpay order created
- payment success
- payment failure
- order completed
- order cancelled
- policy blocked
- session claimed

Display it as a timeline or event table with:
- time
- action
- result
- reason
- next step

For live sessions, refresh with polling or SSE.

## 12. Security and Access
The system is split into two interfaces:
- customer side: public or lightly protected
- merchant side: password protected

Judges should test the customer side live.
Merchant side should use demo login.

Security rules:
- validate inputs on the server
- keep secrets server-side
- protect duplicate order creation with idempotency
- never skip audit logging
- never trust browser-only state

## 13. Razorpay Design Direction
Follow Razorpay Blade and Razorpay dashboard style.

Use:
- white and light gray surfaces
- black top bar on merchant side
- blue primary actions
- clean cards
- tables and drawers
- badges for state
- compact spacing
- no purple-heavy styling
- no flashy effects

Blade links:
- https://blade.razorpay.com/?path=/docs/guides-intro--docs
- https://blade.razorpay.com/?path=/docs/guides-installation--docs
- https://github.com/razorpay/blade
- https://www.npmjs.com/package/@razorpay/blade
- https://www.npmjs.com/package/@razorpay/blade-mcp

## 14. Recommended Tech Stack
- Frontend: Next.js + TypeScript
- Backend: Next.js route handlers or server actions
- Database: Supabase or Postgres
- Payments: Razorpay test mode
- UI system: Razorpay Blade
- Logging: append-only audit table
- Realtime: polling or SSE

## 15. Success Metrics
The build is successful if:
- AI assistants can send product requests
- the gateway can return a valid product match
- the system can explain why a product was chosen
- budget and policy checks work
- Razorpay test checkout works
- audit trail is visible
- many sessions can be handled together
- one failure path is handled cleanly

## 16. MVP Scope
Must have:
- catalog
- session inbox
- product matching
- budget and stock checks
- Razorpay order creation
- checkout return path
- audit trail
- product import
- merchant login
- customer AI flow

Nice to have:
- upsell and cross-sell
- analytics
- AI readiness score
- live audit updates
- richer order history

## 17. Final Definition
Merchant AI Gateway is a Razorpay merchant-side AI commerce layer that makes a store readable to AI buyers, keeps money actions safe, and records the full checkout path in a clear audit trail.

# 01 Product Spec

## Product Name
Merchant AI Gateway

## Product Goal
Help Razorpay merchants sell to AI assistants in a safe, clear, and auditable way.

## Product Summary
Merchant AI Gateway is a merchant-side layer that talks to external AI assistants, reads a structured catalog, matches products to a buyer request, checks rules, creates a Razorpay test-mode order, and records the full flow in an audit trail.

## Problem Statement
Most ecommerce stores are built for people who browse pages and click buttons.

AI assistants do not shop that way.
They need structured product data, clear rules, and a safe checkout path.

Without that, AI buyers cannot reliably discover products, compare options, or place orders on behalf of a customer.

## Product Opportunity
Razorpay merchants need a way to become ready for AI buyers.

This product creates that layer.
It lets any external AI assistant interact with a merchant store through a trusted gateway instead of scraping pages or guessing at checkout behavior.

## Primary User
- Merchant who wants to sell to AI buyers

## Secondary Users
- Customer using an AI assistant
- Merchant admin reviewing requests and orders
- Internal operator or builder testing the flow

## Core Idea
The merchant runs a trusted AI commerce gateway on their side.

That gateway:
- receives a buyer request from an external AI assistant
- reads the merchant catalog
- finds a matching product
- explains the choice
- checks budget and policy limits
- creates a Razorpay test order
- returns a checkout link or session
- stores every action in an audit log

## What the Product Is Not
This is not:
- a consumer shopping bot
- a general AI assistant
- a marketplace
- a CRM
- a shipping engine
- a campaign manager

It is merchant infrastructure for AI-driven checkout.

## Product Principles

### 1. Merchant stays in control
The merchant owns pricing, stock, policies, and order data.

### 2. Every money action must be clear
The system must explain what it is doing and why.

### 3. Every money action must be limited
The system must respect budget, stock, category, and policy rules.

### 4. Every money action must be approved where needed
The system must not move forward without the right confirmation.

### 5. Every money action must be logged
The audit trail must show the full path from request to outcome.

## Supported Scenarios

### Scenario 1: Full AI-assisted purchase
The customer already allows the AI assistant to proceed.

Flow:
request -> product match -> rule checks -> confirmation -> Razorpay order -> payment -> order placed

### Scenario 2: Missing required details
The customer has not shared shipping address, contact number, or payment setup.

Flow:
request -> product match -> missing fields detected -> customer provides data -> checkout continues

### Scenario 3: Manual payment link
The customer does not allow the AI to complete payment.

Flow:
request -> product match -> Razorpay checkout link returned -> customer pays manually

## Functional Requirements

### Merchant setup
- Merchant can add products to a catalog
- Merchant can import products by manual form, CSV or Excel upload, JSON or API sync, and catalog copy
- Merchant can update product price, stock, policy notes, and extra metadata
- Merchant can store flexible fields in a meta JSON field

### Buyer request handling
- System accepts a request from an external AI assistant
- System parses the request into product needs, budget, and constraints
- System stores the request in a session record

### Product matching
- System searches the catalog
- System ranks matching products
- System explains why a product was chosen

### Rule checks
- System checks budget
- System checks stock
- System checks merchant policy
- System checks whether customer details are missing
- System blocks unsafe actions

### Payment flow
- System creates a Razorpay test-mode order
- System returns a checkout link or session
- System updates order state when payment succeeds or fails

### Audit trail
- System logs every important step
- System records timestamp, action, reason, result, and session ID
- System preserves failed attempts as well as success paths
- System supports live audit updates for many sessions

### Merchant dashboard
- Merchant can view requests
- Merchant can view matched products
- Merchant can view payment status
- Merchant can view failed cases
- Merchant can inspect the audit log
- Merchant can manage many live sessions through a session inbox

## Non-Functional Requirements
- Fast enough for demo use
- Clear and simple UI
- Safe handling of missing data
- Reliable logging
- Easy to understand error states
- Strong visual hierarchy
- Mobile and desktop friendly
- Safe handling of many concurrent sessions

## User Experience Requirements
The interface should feel like a Razorpay product.

That means:
- clean layout
- minimal noise
- strong spacing
- clear labels
- no decorative clutter
- dashboard-style screens
- trust-first flow

Use Razorpay Blade components wherever possible.

## Product Flow

### Step 1: Merchant catalog is ready
The merchant loads or syncs the catalog.

### Step 2: Customer asks an AI assistant
The customer asks for a product through ChatGPT, Claude, Gemini, Grok, or another assistant.

### Step 3: AI assistant contacts the merchant gateway
The merchant gateway receives the request and session context.

### Step 4: Gateway searches the catalog
The gateway finds products that match budget and request terms.

### Step 5: Gateway explains the choice
The gateway shows why one product fits better than the others.

### Step 6: Gateway checks rules
The gateway validates budget, stock, policy, and required customer data.

### Step 7: Gateway creates Razorpay order
If the flow is valid, the gateway creates a test-mode order.

### Step 8: Checkout completes
The customer confirms or pays manually depending on the scenario.

### Step 9: Merchant receives order
The merchant sees the order and can send invoice and updates.

### Step 10: Audit trail is saved
Every step is logged for review.

## Data to Store
- merchant profile
- product catalog
- buyer session
- buyer request
- matched products
- selected product
- rule checks
- missing details
- Razorpay order ID
- payment status
- order status
- invoice link
- audit log entries

## Success Metrics
The product is successful if:
- an AI assistant can send a valid product request
- the gateway can return a matching product
- the gateway can block unsafe or out-of-budget actions
- Razorpay test-mode order creation works
- the merchant can inspect the audit trail
- at least one failure case is handled cleanly
- many sessions can be handled at once

## MVP Scope

### Must have
- merchant catalog
- request parsing
- product match
- budget check
- Razorpay test-mode order
- checkout return path
- audit trail
- one graceful failure
- session inbox for many concurrent requests
- protected merchant login

### Nice to have
- upsell suggestion
- merchant summary dashboard
- richer order history
- clearer reason text in the audit view
- real-time audit updates

### Not in MVP
- campaign orchestrator
- multi-merchant marketplace
- shipping carrier integration
- loyalty engine
- advanced analytics

## Copy Tone
Use clear and direct language.

The product should sound:
- confident
- practical
- simple
- trust-focused
- merchant-first

## Final Product Definition
Merchant AI Gateway is a Razorpay merchant-side AI commerce layer that makes a store readable to AI buyers, keeps money actions safe, and records the full checkout path in a clear audit trail.

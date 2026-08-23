# 00 Overview

## Product Name
Merchant AI Gateway

## One-line Summary
Merchant AI Gateway helps Razorpay merchants sell to AI assistants with a safe checkout flow, clear checks, and a full audit trail.

## Project Context
This project is designed for Razorpay Buildathon Track 01: AI Growth & Agentic Commerce.

The track asks builders to create an agent that grows merchant revenue or makes a merchant sellable to AI buyers end to end. The work must keep every money action explainable, bounded, and gated, and it must show an audit trail with one failure handled cleanly.

## Problem
Most online stores are built for human browsing.

AI assistants cannot reliably shop from those stores because:
- product data is not structured for agents
- checkout flows are not clear for AI use
- rules and limits are not visible
- order actions are not easy to audit
- missing details create broken flows
- many live sessions can happen at the same time

This creates a gap between merchant stores and AI buyers.

## Solution
Merchant AI Gateway adds a merchant-side AI layer that can speak to external AI assistants.

It lets the merchant:
- expose a structured product catalog
- receive buyer intent from an AI assistant
- compare products against request rules
- explain why a product was chosen
- check budget and merchant policy
- create a Razorpay test order
- return a checkout session or link
- store a full audit log
- handle many live sessions through a queue style inbox

## What makes it different
This is not a consumer shopping chatbot.

It is merchant infrastructure.

The merchant stays in control of:
- product data
- pricing
- stock
- policy checks
- payment creation
- order status
- audit history

The customer may use any AI assistant they already trust.
The merchant gateway becomes the safe layer in the middle.

## Primary Goal
Make a merchant transactable by an AI buyer end to end.

## Secondary Goals
- grow merchant revenue
- reduce failed or unclear checkout steps
- show product reasoning clearly
- keep money actions safe and logged
- support both AI-driven and human-approved checkout
- handle many live sessions at once without confusion

## Non-goals
This project will not try to build:
- a full marketplace
- a campaign manager
- a complex shipping engine
- a full CRM
- a general purpose consumer AI assistant
- a multi-merchant payment platform

## Supported Checkout Paths

### Path 1: Full AI-assisted flow
The customer gives the AI assistant permission to proceed.
The AI assistant sends the request to the merchant gateway.
The gateway checks rules, creates the Razorpay order, and the purchase completes.

### Path 2: Missing information flow
The request arrives without shipping address, contact details, or payment setup.
The gateway returns the missing fields needed to continue.
The customer AI collects them and resumes checkout.

### Path 3: Manual checkout flow
The customer does not allow the AI to complete payment.
The gateway returns a Razorpay checkout link.
The customer opens it and pays manually.

## Key Product Principle
Every money action must be:
- explainable
- bounded
- gated
- logged

## Core Screens
The product should stay small and clear.

Recommended screens:
- merchant dashboard
- live session inbox
- live session detail drawer
- order outcome screen
- audit trail view
- optional catalog and settings screen

## Design Direction
The product should feel like a Razorpay product.

That means:
- clean layout
- strong hierarchy
- simple forms
- operational dashboard feel
- minimal decoration
- fast scanning
- trust-first UI

Use Razorpay Blade for the UI system and prefer its components over custom ones.

## High-level User Flow
1. Merchant sets up catalog.
2. Customer asks an AI assistant to buy a product.
3. The AI assistant sends the request to the merchant gateway.
4. The gateway reads the catalog and finds matches.
5. The gateway checks budget, stock, and merchant rules.
6. The gateway explains its choice.
7. The gateway creates a Razorpay test order.
8. The customer confirms if needed.
9. Payment is completed.
10. The merchant receives the order.
11. The merchant sends invoice and order updates.
12. The full flow is stored in the audit trail.

## Success Criteria
The project is successful if:
- an AI assistant can request a product
- the gateway can return a valid product match
- budget and policy checks work
- Razorpay test checkout works
- a clear audit trail exists
- at least one failure path is handled well
- many sessions can be visible at the same time

## Stack Direction
Recommended stack:
- Frontend: Next.js + TypeScript
- Backend: Next.js API routes or server actions
- Database: Supabase or Postgres
- Payments: Razorpay test mode
- UI system: Razorpay Blade
- Logging: audit table

## Reference Links
- Blade docs: https://blade.razorpay.com/?path=%2Fdocs%2Fguides-intro--docs
- Blade installation: https://blade.razorpay.com/?path=%2Fdocs%2Fguides-installation--docs
- Blade GitHub repo: https://github.com/razorpay/blade
- Blade npm package: https://www.npmjs.com/package/@razorpay/blade
- Blade MCP package: https://www.npmjs.com/package/@razorpay/blade-mcp

## Next File
- 01-product-spec.md

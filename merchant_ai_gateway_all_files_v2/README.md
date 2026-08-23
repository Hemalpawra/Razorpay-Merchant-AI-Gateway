# Merchant AI Gateway

Merchant AI Gateway is a Razorpay Buildathon concept for AI Growth & Agentic Commerce.

It helps Razorpay merchants become ready for AI buyers by letting an external AI assistant discover products, check rules, create a Razorpay test order, and complete checkout with a full audit trail.

## What this project does

- Reads a merchant catalog in a structured format
- Matches products to a buyer request
- Checks budget, stock, and merchant rules
- Creates a Razorpay test-mode order
- Returns a checkout link or session
- Records every step in an audit trail
- Supports safe fallback when details are missing
- Supports many live sessions at once

## Why this matters

The build is designed for the Track 01 brief:

- Grow merchant revenue
- Make merchants sellable to AI buyers
- Keep every money action explainable
- Keep every money action bounded
- Keep every money action gated
- Show an audit trail
- Handle one failure cleanly

## Product summary

A customer asks an AI assistant to buy something.

That AI assistant talks to the merchant's gateway.

The gateway:
- reads the catalog
- recommends products
- checks limits
- creates the Razorpay order
- sends back checkout details

The merchant stays in control of pricing, stock, policies, and order handling.

## Core modules

- Merchant catalog service
- AI request handler
- Product matching logic
- Rules and safety checks
- Razorpay checkout integration
- Audit log service
- Merchant dashboard
- Outcome and confirmation screen
- Live session inbox for many concurrent requests

## Suggested stack

- Frontend: Next.js + TypeScript
- Backend: Next.js API routes or server actions
- Database: Supabase or Postgres
- Payments: Razorpay test mode
- UI system: Razorpay Blade
- Logging: audit table with timestamped events

## UI direction

The UI should feel like a Razorpay product:

- clean
- clear
- fast to scan
- strong hierarchy
- minimal decoration
- trust-first layout
- operations dashboard feel

Use Blade components where possible for:
- buttons
- cards
- forms
- tables
- alerts
- badges
- dialogs
- drawers
- tabs
- progress states

## Reference links

Use these as the base for design and build work:

- Blade docs: https://blade.razorpay.com/?path=%2Fdocs%2Fguides-intro--docs
- Blade installation: https://blade.razorpay.com/?path=%2Fdocs%2Fguides-installation--docs
- Blade GitHub repo: https://github.com/razorpay/blade
- Blade npm package: https://www.npmjs.com/package/@razorpay/blade
- Blade MCP package: https://www.npmjs.com/package/@razorpay/blade-mcp

## Document set

- 00-overview.md
- 01-product-spec.md
- 02-system-architecture.md
- 03-database-design.md
- 04-api-specification.md
- 05-user-flows.md
- 06-ui-ux-specification.md
- 07-design-system.md
- 08-development-guidelines.md
- 09-frontend-architecture.md
- 10-backend-architecture.md
- 11-security-and-trust.md
- 12-audit-trail.md
- 13-testing-plan.md
- 14-roadmap.md
- 15-demo-script.md
- 16-ai-developer-playbook.md

## Build rule

Do not invent custom UI patterns when Blade already has a component for the job.

Keep the whole product simple enough to build and demo in the hackathon window.

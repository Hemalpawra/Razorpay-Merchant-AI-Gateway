# 16 AI Developer Playbook

## Goal
Give an AI coding agent clear rules for building the project.

## Build Rule
Read this document before writing code.

## Must Follow
- use Next.js + TypeScript
- use Razorpay Blade
- keep the UI close to Razorpay style
- keep the architecture simple
- keep payment logic server-side
- keep audit logs append-only
- keep error messages clear
- support many sessions without confusing the UI

## Must Not Do
- do not invent custom design language
- do not skip logging
- do not store secrets in client code
- do not skip validation
- do not add extra product scope without approval
- do not assume a single active user at a time

## AI Prompt Template
When asked to build a screen or module, use this pattern:

- role: senior front-end and product engineer
- task: build the specified screen or module
- context: Merchant AI Gateway, Razorpay Blade UI, audit-first flow
- format: production-ready code with simple structure
- constraints: no custom UI when Blade already covers it

## Output Standards
- clean file names
- small components
- readable props
- clear state handling
- simple comments
- no unused code

## Folder Guidance
Suggested folders:
- app
- components
- lib
- server
- types
- db

## Reasoning Rules
When making product choices:
- prefer trust
- prefer clarity
- prefer small scope
- prefer Razorpay style
- prefer audit visibility
- prefer queue style handling for concurrency

## UI Rules for AI Agents
- use Blade components first
- keep cards and tables simple
- keep status visible
- keep buttons consistent
- keep error states readable
- build a session inbox for many live sessions

## Backend Rules for AI Agents
- validate every input
- store every important event
- never trust the browser
- keep order creation atomic
- update state after webhook confirmation
- protect duplicate order creation with idempotency keys
- support claim or lock flow for human review

## Quality Check
Before merging code, confirm:
- the flow still works
- the audit trail still works
- the UI still reads clearly
- the payment step still works in test mode
- many sessions do not break the inbox

# 06 UI UX Specification

## Goal
Define screens and behavior in a style that matches Razorpay products.

## Design Style
The UI should feel like a Razorpay operations dashboard.

Use:
- clear panels
- cards
- tables
- status chips
- side drawers
- simple forms
- strong spacing
- restrained color use

Avoid:
- decorative clutter
- heavy gradients
- complex motion
- chatbot-only layouts
- visual noise

## Core Screens

### 1. Merchant Dashboard
Purpose:
- view incoming AI commerce sessions
- see orders and failures
- monitor activity

Components:
- top summary cards
- session inbox table
- recent audit events
- status badges

### 2. Session Inbox
Purpose:
- handle many live sessions
- sort and filter by state
- open any session quickly

Components:
- searchable table
- filters
- pagination or virtualization
- last updated time
- claim button if needed

### 3. Live Session Detail Drawer
Purpose:
- show one request at a time without leaving the inbox

Components:
- buyer request
- matched products
- checks
- selected product
- order state
- audit trail preview

### 4. Approval Screen
Purpose:
- ask for confirmation when needed

Components:
- selected product card
- order summary
- budget info
- approval button
- cancel button

### 5. Outcome Screen
Purpose:
- show success or failure
- show order ID
- show next step

Components:
- result banner
- order details
- invoice link
- retry action
- audit summary

### 6. Audit Trail View
Purpose:
- show everything that happened

Components:
- vertical timeline
- event table
- timestamps
- reason text
- status markers
- live refresh state

### 7. Optional Catalog / Settings Screen
Purpose:
- manage products and rules

Components:
- product table
- import button
- manual add form
- CSV or Excel upload
- API sync settings
- category and policy controls

## Component Rules
Use Blade components for:
- Button
- Card
- Banner
- Badge
- Alert
- Table
- Input
- Select
- Tabs
- Drawer
- Modal

## Layout Rules
- one main action per screen
- one sidebar or secondary panel at most
- use clear section headers
- keep the page readable at a glance

## State Rules
Each screen must support:
- loading
- success
- warning
- error
- empty state

## Messaging Rules
Use short copy.

Example style:
- "Product found"
- "Within budget"
- "Missing shipping address"
- "Payment link ready"
- "Order placed"
- "12 sessions waiting"

## Responsive Rules
- desktop first for demo clarity
- mobile should still be usable
- tables can collapse into cards on small screens

## Visual Hierarchy
Top area:
- page title
- current status
- primary action

Middle area:
- product results
- checks
- order summary
- session list

Bottom area:
- audit trail
- notes
- secondary actions

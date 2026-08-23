# 07 Design System

## Goal
Make the UI match Razorpay style and keep implementation consistent.

## Official Design System
Use Razorpay Blade as the main UI system.

### Links
- Blade docs: https://blade.razorpay.com/?path=%2Fdocs%2Fguides-intro--docs
- Blade installation: https://blade.razorpay.com/?path=%2Fdocs%2Fguides-installation--docs
- Blade GitHub repo: https://github.com/razorpay/blade
- Blade npm package: https://www.npmjs.com/package/@razorpay/blade
- Blade MCP package: https://www.npmjs.com/package/@razorpay/blade-mcp

## Design Principles
- clarity first
- one action per screen
- strong visual order
- trust-first layout
- keep money actions obvious
- keep errors readable
- keep spacing clean

## Color Direction
Use a restrained palette:
- white or near-white base
- light gray surfaces
- blue primary action
- green success
- amber warning
- red error

## Typography
- simple sans-serif system
- clear headings
- small but readable body text
- avoid decorative type

## Spacing
Use consistent spacing tokens.
Do not improvise spacing on each screen.
Keep section gaps predictable.

## Component Guidance
Prefer Blade for:
- buttons
- cards
- inputs
- selects
- alerts
- badges
- tables
- tabs
- modals
- drawers
- banners

## Layout Guidance
Use a dashboard layout:
- top status area
- session inbox
- main detail panel or drawer
- bottom audit panel

## Content Rules
Use short, direct labels:
- "Budget check"
- "Stock check"
- "Order created"
- "Payment failed"
- "Checkout link"

## AI Build Instructions
When writing UI code:
1. read Blade docs first
2. install Blade
3. use Blade components before custom components
4. match Blade spacing and typography
5. keep the UI close to Razorpay product style
6. avoid random visual choices

## Tone
The interface should sound like a payment product, not a startup demo.

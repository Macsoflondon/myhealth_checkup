

# Update Partner Showcase Grid: Clinic Card Redesign

## What will change

### 1. Restyle the "Find a Clinic" card to match the "Take Control" CTA card
The bottom-left "Find a Clinic Near You" card will be restyled to mirror the top-right "Take Control of Your Health Today" card, but with opposite/inverted colours:
- Background changes from white to navy (#081129)
- All text changes to white (headings, body, stats)
- Stats accent colour stays turquoise (#22c0d4) for contrast
- Add a turquoise pill/badge at the top (like the "Start Your Journey Today" badge on the CTA card)
- Trust indicators row at the bottom in white/50 opacity (matching the CTA card pattern)
- Same padding, centred layout, and vertical structure

### 2. Remove the vertical gap between the stats row and buttons
The empty `<div className="mt-6"></div>` spacer between the stats and the buttons will be removed, pulling the buttons up directly beneath the stats.

## Technical details

**File:** `src/components/sections/PartnerShowcaseGrid.tsx`

**Changes (lines 83-120):**
- Change container background from `bg-white` to `bg-[#081129]`
- Change heading text from `text-[#081129]` to `text-white`, keep the turquoise span
- Change paragraph text from `text-[#081129]/70` to `text-white/70`
- Change stats text from `text-[#081129]/60` to `text-white/60`
- Remove the empty `<div className="mt-6"></div>` spacer on line 105
- Add a turquoise pill badge above the heading (e.g. "Find Your Clinic")
- Add a trust indicators row below the buttons (matching the CTA card style)


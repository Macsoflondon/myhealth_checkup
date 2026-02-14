

## Centre Content in CTA Card and Reduce Height

Two changes to the navy "Take Control" CTA card:

### 1. Reduce the card height by 4 lines
- Change the text-to-buttons gap from `mb-8` to `mb-4` on the paragraph
- Remove the `mb-2` after the buttons (change to `mb-0`)
- Reduce the badge margin from `mb-1.5` to `mb-1`

### 2. Vertically centre all content within the card
- Add `justify-center` to the card's flex container so all content sits in the vertical middle of the card, rather than being pushed to the top

### Technical Changes

**File:** `src/components/sections/PartnerShowcaseGrid.tsx`

- Line 50: Add `justify-center` to the card div (change `flex flex-col items-center text-center` to `flex flex-col items-center justify-center text-center`)
- Line 51: Change badge `mb-1.5` to `mb-1`
- Line 57: Change paragraph `mb-8` to `mb-4`
- Line 60: Change button group `mb-2` to `mb-0`


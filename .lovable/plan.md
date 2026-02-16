

## Enlarge the Goodbody Card

Add vertical space below the "View Goodbody tests" button to make the card taller by approximately five lines.

### What will change

- In the button container inside the Goodbody card, increase the bottom padding from `pb-0` to `pb-20` (roughly five lines of space).
- Increase the `max-h-[420px]` constraint on the top row to `max-h-[500px]` so the card and video can both grow to accommodate the extra space.

### Technical details

**File:** `src/components/sections/PartnerShowcaseGrid.tsx`

1. Change the top row grid container from `max-h-[420px]` to `max-h-[500px]`.
2. Change the button wrapper `div` from `pb-0` to `pb-20`.


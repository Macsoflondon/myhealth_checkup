

## Adjust CTA Card: Text-to-Button Gap and Reduce Top/Bottom Padding

Two changes to the navy "Take Control" CTA card:

### 1. Set the gap between text and buttons to ~2 lines
Currently the paragraph has `mb-4`. This will be reduced to `mb-2` to give approximately 2 lines of space between the description and the buttons.

### 2. Trim 2cm (~1.25rem) from top and bottom padding
Currently the card uses `p-6 lg:p-8` (1.5rem / 2rem all around). This will be changed to `py-3 px-6 lg:py-5 lg:px-8` -- keeping the horizontal padding the same but cutting roughly 2cm off the top and bottom.

### Technical Changes

**File:** `src/components/sections/PartnerShowcaseGrid.tsx`

- Line 50: Change `p-6 lg:p-8` to `py-3 px-6 lg:py-5 lg:px-8` (reduce top and bottom padding by ~2cm)
- Line 57: Change `mb-4` to `mb-2` (two lines between text and buttons)


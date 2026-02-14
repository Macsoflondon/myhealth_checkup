

## Fix the CTA Card: Proper Size Reduction and Spacing

Apologies for not following your instructions correctly. Here is exactly what will change:

### 1. Reduce the container size by 25%

The current container uses `max-w-[75%]` on mobile only (desktop reverts to full). This will be changed to apply **across all breakpoints** so the navy card is genuinely 75% of its grid cell width:

- Change: `max-w-[75%] mx-auto md:max-w-none` to `max-w-[75%] mx-auto`
- This means on desktop too, the navy card will be 75% the width of its grid column, visibly smaller than the adjacent cards

### 2. Add a clear gap of 5-6 lines between the text and the buttons

Currently the gap between the description paragraph and the buttons is only `mb-2` on the paragraph and `mt-1` on the button group -- almost no space at all. This will be changed to `mb-16 mt-8` (approximately 5-6 lines of vertical whitespace) to create the visible separation you asked for.

### Technical Changes

**File:** `src/components/sections/PartnerShowcaseGrid.tsx`

- Line 50: Change `max-w-[75%] mx-auto md:max-w-none` to `max-w-[75%] mx-auto` (apply 75% width at all screen sizes)
- Line 57: Change `mb-2` to `mb-16` on the paragraph (push buttons far down)
- Line 60: Change `mt-1` to `mt-8` on the button container (add extra top spacing)


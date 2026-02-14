

## Align CTA Card Header and Tighten Spacing

Three changes to the navy "Take Control" CTA card in `src/components/sections/PartnerShowcaseGrid.tsx`:

### 1. Match the top padding to the adjacent cards
The Goodbody card next to it uses `p-6 lg:p-8` padding, but the CTA card only uses `p-4 lg:p-5`. This will be changed to `p-6 lg:p-8` so the heading lines up horizontally with the Goodbody heading.

### 2. Reduce the gap between text and buttons to ~3 lines
Currently the paragraph has `mb-16` and the button group has `mt-8` -- far too much space. This will be reduced to `mb-8` on the paragraph and `mt-0` on the buttons, giving roughly 3 lines of whitespace.

### 3. Shrink the container height by 3-4 lines
Reduce the bottom padding and tighten the spacing after the buttons. The trust points margin will be reduced from `mb-2` to `mb-1` on the button group, and the overall container padding stays consistent but the reduced internal gaps will naturally shrink the card height by 3-4 lines.

### Technical Changes

**File:** `src/components/sections/PartnerShowcaseGrid.tsx`

- Line 50: Change padding from `p-4 lg:p-5` to `p-6 lg:p-8` (align header with adjacent cards)
- Line 57: Change `mb-16` to `mb-8` (reduce text-to-buttons gap to ~3 lines)
- Line 60: Change `mt-8` to `mt-0` (remove extra top margin on buttons)


# Turn the thin hero brand-bar divider pink

## What we are changing
On the homepage hero, the white brand bar that holds the wordmark and "YOUR HEALTH. YOUR CHOICE." slogan currently ends in a 1px turquoise bottom border. Just below that is the thicker 2px turquoise divider that separates the toolbar from the hero image. The user wants the thin upper line switched to brand pink (#e70d69) while the thicker lower line stays turquoise.

## Steps

1. **Identify the thin line**
   - In `src/components/layout/BrowseByCategoryBar.tsx` line 254, the hero brand-bar container uses:
     `border-b bg-white border-[#22c0d4]`
   - This renders the 1px turquoise line at the bottom of the white brand bar.

2. **Change the thin line to pink for hero placement only**
   - Make the bottom border colour conditional on `placement === "hero"`.
   - Hero placement: `border-[#e70d69]` (brand pink).
   - Non-hero placements: keep `border-[#22c0d4]` (turquoise) so the sticky/category bars elsewhere are unchanged.
   - Keep the existing `transition-[background-color,border-color,box-shadow]` so the border still transitions smoothly when the bar scrolls to navy.

3. **Leave the thicker divider untouched**
   - In `src/components/sections/HeroMasthead.tsx` line 66, the wrapper div retains `border-b-2 border-[#22c0d4]`.
   - This preserves the 2px turquoise divider that sits between the brand bar and the hero image.

4. **Verification**
   - Run `npm run build:dev` to confirm Tailwind compiles the new conditional class cleanly.
   - Capture a Playwright desktop screenshot of the homepage toolbar/hero boundary.
   - Confirm the white brand bar ends with a 1px pink line, immediately followed by the 2px turquoise divider, then the hero image.
   - Spot-check mobile and tablet widths to ensure no unintended colour change on non-hero placements.

## Files to edit
- `src/components/layout/BrowseByCategoryBar.tsx`

## Out of scope
- No changes to the thicker 2px turquoise divider in `HeroMasthead.tsx`.
- No changes to the category ticker strip or hero image container.

Slot the existing `TestCategoryTicker` auto-scrolling category strip into the white footer area at the bottom of `HeroMasthead`, re-styled to sit on the pearl-white hero background.

Changes
-------
1. `src/components/sections/TestCategoryTicker.tsx`
   - Add a `variant` prop: `"section"` (default, current navy full-width strip) and `"inline"` (transparent background for inside the hero).
   - `"inline"` styling:
     - Inherit the pearl-white hero background (no `bg-brand-navy`).
     - Navy text for category names (`text-brand-navy`).
     - Keep pink bullets (`text-brand-pink`) for brand consistency.
     - Tighter vertical padding so it fits the hero footer without pushing the hero height.
     - Keep the rAF marquee behaviour and the gradient edge mask.

2. `src/components/sections/HeroMasthead.tsx`
   - Replace the current empty spacer at the bottom:
     ```
     <div className="h-5 sm:h-6" aria-hidden="true" />
     ```
     with:
     ```
     <TestCategoryTicker variant="inline" />
     ```
   - Import `TestCategoryTicker`.

3. `src/pages/Index.tsx`
   - Remove the standalone `<TestCategoryTicker />` placed after `StatsBand` so the ticker does not appear twice in a row.

Verification
------------
- Build/typecheck passes.
- Preview desktop and mobile to confirm:
  - The ticker sits cleanly in the hero footer on the pearl background.
  - Marquee scrolls smoothly without flicker or layout shift.
  - The hero still ends with the requested single-line gap above the ticker.
  - No duplicate ticker appears below the hero/stats area.
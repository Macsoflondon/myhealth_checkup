## Plan: fix the category toolbar sizing and wrapping

1. **Target the correct toolbar**
   - Update `src/components/layout/BrowseByCategoryBar.tsx` and `src/components/layout/CategoryPillDropdown.tsx` only.
   - Keep the existing mobile hamburger drawer as-is for phone widths.

2. **Make desktop/tablet layout adaptive instead of oversized**
   - Replace the current single-line, centre-justified pill strip with a responsive flex-wrap layout on desktop/tablet.
   - Allow category pills to wrap neatly onto a second row when the viewport is too narrow.
   - Keep the language/account controls and `More` dropdown aligned without forcing the whole toolbar wider than the screen.

3. **Shrink the pill dimensions**
   - Reduce pill padding, icon circle size, icon size, gap, and font size in compact/hero mode.
   - Prevent long labels like `Fertility - Prenatal` and `Sports & Fitness` from pushing the toolbar out by using stable max-widths and truncation where needed.

4. **Preserve hover colour and dropdown behaviour**
   - Keep each category’s existing hover border/shadow colour.
   - Keep subcategory dropdowns opening on hover/focus.
   - Recalculate dropdown positioning so wrapped pills still anchor their dropdown correctly.

5. **Make the toolbar fit common breakpoints**
   - Verify at mobile, tablet, laptop, and wide desktop widths.
   - Acceptance: no horizontal overflow, no clipped controls, pills wrap cleanly, dropdowns remain accessible, hover colours still work.
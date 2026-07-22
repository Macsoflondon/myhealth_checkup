Plan: enlarge category toolbar buttons

1. Target file: `src/components/layout/CategoryPillDropdown.tsx`
   - Increase vertical padding so pills are roughly 2–3 text-line-heights taller than today (`py-1 sm:py-1.5` → `py-2 sm:py-2.5` or equivalent).
   - Slightly increase horizontal padding (`pl-1.5 pr-2 sm:pl-2 sm:pr-2.5` → `pl-2 pr-2.5 sm:pl-2.5 sm:pr-3`).
   - Keep the icon and label vertically centred; do not change font size unless required for balance.
   - Leave `max-width` breakpoints as-is to avoid breaking the single-row fit on laptops.

2. Target file: `src/components/layout/BrowseByCategoryBar.tsx`
   - Increase the inner card vertical padding slightly (`py-2.5 sm:py-3` → `py-3 sm:py-3.5`) so the taller pills do not feel cramped.
   - If the user confirms the "More" pill should match, apply the same padding increase to the More button styles.

3. Verify in browser preview at 1280 px and 1440 px widths that the bar still fits on one line and wrapping remains clean on smaller laptop screens.

No database, route, or scraper changes. Only Tailwind class adjustments in the two layout files above.
Replace the wrap-flow row of category pill buttons on `/at-home-tests` with a single dropdown (select) control.

## Scope
File: `src/pages/AtHomeTestsPage.tsx` (lines ~476–493)

## Change
- Remove the `.flex flex-wrap` block of category pill `<button>`s.
- Replace with a styled native `<select>` populated from the same `categories` array (`useAtHomeCategories`), bound to `activeCategory` via `handleCategoryChange`.
- Style: rounded-full, navy border matching the search input, DM Sans 14px, navy text, white background, chevron indicator, max-width ~280px, sits where the pill row was.
- Keep the search input above it and results count below unchanged.

Out of scope: no data, routing, or other UI changes.
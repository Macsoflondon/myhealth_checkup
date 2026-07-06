## Problem

Subcategory routing, breadcrumbs and dropdowns in the header `NavigationMenu` are wired up — but the **Browse-by-category bar** (`src/components/layout/BrowseByCategoryBar.tsx`), which is the sticky pill toolbar users actually see on every page, only renders a flat `<Link>` per parent. There is no way to reach a subcategory from that toolbar. The mobile sheet has the same limitation.

## Plan

Wire the existing `dropdownItems` from `primaryNavigationItems` into the toolbar. No changes to routes, data, or breadcrumb logic — those already work.

### 1. Desktop pill hover dropdown

In `BrowseByCategoryBar.tsx`, wrap each pill in a hover-triggered container that opens a small panel of its `dropdownItems`.

- Trigger: `onMouseEnter` on the pill wrapper opens; `onMouseLeave` on the wrapper (with a ~120ms close delay so the cursor can travel into the panel) closes. Also close on `Escape` and on route change.
- Chevron: append a small `ChevronDown` inside the pill when `item.hasDropdown`, rotating when open.
- Clicking the pill body still navigates to the parent (`item.path`) — keeps current behaviour.
- Panel: absolutely positioned under the pill, `min-w-[240px]`, white card, `rounded-2xl`, same shadow/border tokens the "More" dropdown uses. Each row is a `<Link to={sub.path}>` styled like the existing dropdown rows in `MoreDropdownMenu`. First and last "View All …" entries render with the accent colour of that category (from the `ICONS` map).
- Active state: if `location.pathname + location.search` matches the sub's path, apply the pink border + `aria-current="page"` (same pattern already used in `NavItemDropdown`).
- Keep the horizontal-scroll pill strip intact; the dropdown renders via `position: absolute` so it can overflow the strip. The pill strip's `WebkitMaskImage` clips overflow — remove masking only on the pill container when its dropdown is open (or lift the panel into a portal). Simpler: render the panel inside the pill wrapper but with `position: fixed` anchored to the pill's bounding rect (measured on open), so masking doesn't clip it.

### 2. Mobile sheet nested subcategories

In the mobile `<Sheet>` list, replace each parent `<Link>` with a collapsible row:

- Row renders the icon + parent name and a chevron toggle on the right.
- Tapping the row body still navigates to the parent and closes the sheet.
- Tapping the chevron toggles a nested `<ul>` of `dropdownItems` below it (accordion, one open at a time). Nested items are indented, use the parent's accent colour for their bullet dot, and close the sheet on tap.
- Categories without `dropdownItems` render as a plain link (current behaviour).

### 3. No other files change

- `NavigationItems.tsx`, `NavItemDropdown.tsx`, `DbCategoryPage.tsx`, `CategoryPageLayout.tsx`, `AtHomeTestsPage.tsx`, and `subcategoryMap.ts` stay as-is.
- Not touching pricing, category, or scraper logic.

### Technical notes

- New small component `CategoryPillDropdown` colocated in `BrowseByCategoryBar.tsx` (or split to `src/components/layout/CategoryPillDropdown.tsx` if it exceeds ~80 lines) to keep the main file readable.
- Use `useLocation()` from `react-router-dom` for active matching.
- Use `useRef` + `getBoundingClientRect()` to anchor the fixed panel; recompute on `resize`/`scroll` while open.
- Close the open dropdown on `location` change via a `useEffect` dependency on `location.key`.
- Keyboard: `Tab` into the pill focuses it; `ArrowDown` opens the panel and focuses the first item; `Escape` closes and returns focus to the pill.

### Verification

- Playwright: hover each pill on desktop, screenshot the open panel, click a sub link, confirm URL becomes `/{parent}?subcategory={slug}` and the breadcrumb on the destination page contains the parent + subcategory segments.
- Mobile viewport (390×844): open the sheet, expand "Women's Health", tap "Menopause Tests", confirm navigation + sheet closes.

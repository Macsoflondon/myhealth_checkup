## What's wrong

In the screenshot the Language flag + Login avatar overflow the right edge of the rounded toolbar card and sit on top of the "At Home Tests" pill. Root cause is in `src/components/layout/BrowseByCategoryBar.tsx`:

- A single flex row holds pills, the More button, AND the language/user cluster.
- The row uses `overflow-x-auto` and `ml-auto` on the right cluster. When the pills exceed the available width, `ml-auto` collapses, the right cluster ends up inside the scroll area, and on viewports where the card itself can't widen further the icons render flush against (and visually over) the last pill — exactly what's circled in the screenshot.
- Right cluster has no `bg` of its own, so when it floats over a pill it looks broken.

## Fix

Rebuild the bar as a true 3-zone row that never overlaps and works from 360 px to ultra-wide:

```text
[ scrollable pill strip (flex-1, min-w-0, overflow-x-auto) ] [ More ] | [ 🌐  👤 ]
```

Edit `src/components/layout/BrowseByCategoryBar.tsx`:

1. Outer flex becomes `flex items-center gap-2 flex-nowrap` (no overflow on the outer row).
2. Wrap only the category pills in an inner `<div class="flex-1 min-w-0 overflow-x-auto scrollbar-none flex items-center gap-1.5 flex-nowrap">`. Add a subtle right-edge fade mask (`mask-image: linear-gradient(...)`) so pills that scroll off look intentional.
3. `More` button moves out of the scroll strip into the outer row with `shrink-0`, so it's always visible.
4. Language + User cluster moves out of the scroll strip into the outer row, `shrink-0`, with a `pl-2 border-l border-[#081129]/10` divider. Give it the same off-white card background so it can never appear to sit "on top of" a pill.
5. Tighten paddings one more notch at `< sm` (`px-2 py-2`, pill `text-[11px]`, icon bubble `18×18`) so on a 360 px phone the right cluster + More stay pinned and pills scroll horizontally beneath them.
6. Keep `position: sticky top-0` and the IntersectionObserver `stuck` state untouched — that's what gives the flicker-free glide.

No visual redesign, no colour changes, no other components touched.

## Slug / route parity (verification only — no code change)

Both bars consume the same source:

- `BrowseByCategoryBar` → `primaryNavigationItems` from `src/components/header/NavigationItems.tsx` and renders `<Link to={item.path}>`.
- `StickyCategoryBar` → `NavigationMenu` → same `primaryNavigationItems`.

So the 8 top-level slugs (`/popular-tests`, `/wellness`, `/womens-health`, `/mens-health`, `/sports-performance`, `/fertility-tests`, `/tests/cancer`, `/at-home-tests`) are guaranteed identical. The Playwright test below asserts this at runtime so it can never silently drift.

## End-to-end test

Add `tests/e2e/category-bar.spec.ts` (Playwright, run via shell against the live dev server on `localhost:8080`). It will:

1. Load `/`, screenshot the bar in-flow.
2. Read the 8 pill `(label, href)` pairs from `BrowseByCategoryBar`.
3. Scroll 1200 px, assert the bar is pinned (`getBoundingClientRect().top === 0`), screenshot, and assert there's no horizontal overlap between the last pill and the language/user cluster (`pill.right <= cluster.left`).
4. Scroll back to 0, assert the bar returns to in-flow position without a layout jump (compare `top` deltas across `requestAnimationFrame` samples — no value should change by > 2 px between adjacent frames, which is our flicker check).
5. For each pill click → assert `page.url()` ends with the expected slug AND that the resulting page renders a filtered result region (`[data-testid="filtered-results"]` or, fallback, the `<h1>` contains the category name). Repeat the click via the *sticky* `StickyCategoryBar` on a non-home route and assert the same URL — proving slug parity.
6. Repeat the whole flow at `viewport: 375×812` (mobile) to cover the horizontal-scroll fallback.

Test runner: drive Playwright from `code--exec` per the browser-use directive (no new npm deps, no Vitest changes).

## Files

- Edit: `src/components/layout/BrowseByCategoryBar.tsx`
- Add: `tests/e2e/category-bar.spec.ts`

Nothing else changes.

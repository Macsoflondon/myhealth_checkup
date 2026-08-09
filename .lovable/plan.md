# Correct and lock down the category toolbar

## Goal

Make the toolbar a genuinely centred, compact dock rather than a full-width strip, and keep it pinned at the top while scrolling on both the homepage and category pages.

## Confirmed current issues

- The homepage dock is forced to `w-full`, measuring about 1,893 px in the 1,895 px viewport. Its mathematical midpoint is centred, but it spans the page and therefore does not appear as a centred toolbar.
- Homepage sticky positioning is disabled by the current `placement === "hero"` class condition.
- The existing category-bar E2E test checks obsolete selectors and does not separately prove centring and pinning on homepage and category-page render paths.

## Changes

1. **Restore a compact centred homepage dock**
   - Remove the full-width sizing from the hero dock itself.
   - Keep a full-width outer alignment wrapper, then size the visible dock to its content with a viewport-safe maximum width.
   - Centre the complete unit — category buttons and the More button — using `mx-auto` rather than distributing it across the available width.
   - Preserve horizontal clipping/scroll behaviour at narrower desktop widths without introducing page-level horizontal overflow.

2. **Pin the homepage toolbar while scrolling**
   - Give the hero toolbar a stable pinned state at `top: 0`, matching the category-page behaviour.
   - Ensure the toolbar does not jump horizontally or change width when it transitions from its hero position to the pinned position.
   - Keep mobile navigation behaviour unchanged.

3. **Harden category-page pinning**
   - Retain the category hero boundary/portal behaviour, but use the same centring contract before and after pinning.
   - Confirm the pinned toolbar remains inside the viewport and centred after scrolling on a representative category route.

4. **Add focused Playwright regression coverage**
   - Update `e2e/category-bar.spec.ts` to use selectors that exist in the current component.
   - Add explicit homepage and category-page tests at desktop width.
   - For each route, assert:
     - toolbar group midpoint is within a small tolerance of the viewport midpoint;
     - visible dock width is less than the viewport width when its contents fit;
     - the page has no horizontal overflow;
     - after scrolling, toolbar top remains at `0 ± 2px`;
     - horizontal centre remains within tolerance before and after pinning.
   - Capture a screenshot on assertion failure through Playwright’s existing trace/artifact support.

5. **Verify responsive behaviour**
   - Run the focused E2E test on desktop and the existing mobile project.
   - Visually check the homepage and a category page at laptop and wide-desktop widths, before and after scrolling.
   - Run the relevant test suite and lint checks for the changed files.

## Technical acceptance criteria

- The visible homepage dock is content-sized and visibly centred, not an edge-to-edge white capsule.
- Its centre differs from the viewport centre by no more than 2 px when content fits.
- Homepage and category-page toolbars remain at the top of the viewport after scrolling.
- Pinning causes no horizontal shift greater than 2 px and no page-level horizontal scrollbar.
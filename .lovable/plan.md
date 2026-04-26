## Plan

Replace the current homepage ticker behaviour so both carousels move reliably in the preview and production.

### What I’ll change

1. Fix the actual freeze condition in both carousels
   - `src/components/sections/PromoTicker.tsx`: remove the `motion-reduce:animate-none` class so the promo strip does not silently disable itself.
   - `src/components/sections/TestCategoryTicker.tsx`: remove the early `prefers-reduced-motion` bailout that stops the animation loop entirely.

2. Keep both carousels stable after the fix
   - Leave the current promo ticker structure in place if it’s otherwise sound.
   - Keep the category ticker’s width measurement and wrap logic, but make sure it always starts animating when rendered.

3. Add a real browser smoke test
   - Create a Playwright-style E2E smoke test that loads `/` on desktop and mobile viewports.
   - Assert the promo ticker position changes over a short wait.
   - Assert the category ticker position changes over a short wait.
   - This replaces the false sense of safety from the current component-only smoke test, which does not prove browser motion in the live page.

4. Verify header/mobile layout while touching this area
   - Check that the mobile header still uses the intended mobile logo layout.
   - Ensure the two tickers remain in the same visual positions as now.

### Exact problem found

Both frozen strips are being disabled by reduced-motion logic:

- The promo carousel uses `motion-reduce:animate-none` in `PromoTicker.tsx`.
- The second carousel (`TestCategoryTicker.tsx`) exits its animation effect immediately when `window.matchMedia('(prefers-reduced-motion: reduce)')` matches.
- The homepage also calls `useMobileOptimization()` in `src/pages/Index.tsx`, so mobile-specific behaviour is already being injected there.

That means if the browser/OS is advertising reduced motion, both carousels will stop by design, which matches what you’re seeing: both are static even after refresh.

### Technical details

Files to update:
- `src/components/sections/PromoTicker.tsx`
- `src/components/sections/TestCategoryTicker.tsx`
- add E2E test file(s), likely under a browser/e2e test path
- possibly `package.json` if an explicit E2E script is missing

Expected outcome:
- top promo ticker moves continuously
- second category ticker moves continuously
- behaviour is verified in an actual browser at mobile and desktop sizes
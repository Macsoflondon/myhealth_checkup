Plan to reduce the marquee speed of the top category ticker in `src/components/sections/TestCategoryTicker.tsx`:

1. **Locate the control** — The ticker uses `useMarqueeTicker(categories.length)` in `TestCategoryTicker.tsx`, which defaults to `speedPxPerMs = 0.04` (≈40px/sec).
2. **Lower the speed** — Pass a reduced speed value to `useMarqueeTicker`, e.g. `0.03` (25% slower) or `0.025` (37.5% slower). Pick a modest reduction so it still feels alive but not rushed.
3. **Verify** — Capture a short desktop + mobile Playwright clip/screenshot of the ticker and run `tsc --noEmit` to confirm no regressions.
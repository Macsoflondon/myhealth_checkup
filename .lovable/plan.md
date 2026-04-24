

## Speed up the top promo ticker so motion is visible

### Problem

The top promo bar (`BrandTicker.tsx` — "GoodBody: 5% off… · Medichecks: 20% off… · Lola Health: £20 off…") *is* animating, but only at **40 px/sec** (`pxPerMs = 0.04`). On a ~1400px wide viewport with long promo strings, that's so slow it reads as static — which is why you think it isn't moving.

The session replay confirms `requestAnimationFrame` is firing and `translate3d` is updating every frame, so the loop is healthy. The issue is purely perceived speed.

### Change

**File:** `src/components/sections/BrandTicker.tsx` (line 53)

```diff
- const pxPerMs = 0.04;   // 40 px/sec  → looks frozen
+ const pxPerMs = 0.09;   // 90 px/sec  → smooth, clearly in motion, still readable
```

That's it — single-line change. No layout, no markup, no animation-loop refactor needed. The reset/measure/visibility-pause logic, reduced-motion guard, and 8-set buffering all stay intact.

### Why 0.09

- `0.04` (current) = 40 px/sec — too slow, reads as static.
- `0.09` ≈ 90 px/sec — comparable to a comfortable reading marquee. A full promo (~400 px) passes by in ~4.5 s, so users still have time to read each offer.
- Goes higher than that (e.g. 0.15+) and copy starts feeling rushed / harder to read.

### Out of scope (mention only)

- `TestCategoryTicker.tsx` and the `FeaturedPublications` carousel use the same `0.04` value and feel similarly slow. Happy to bump those in a follow-up if you want a consistent pace across all three strips — just say the word.


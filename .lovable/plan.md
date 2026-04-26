# Rebuild promo carousel from scratch (CSS-driven marquee)

## Goal
Completely delete the existing `PromoTracker` (the JS rAF-driven marquee that has repeatedly broken) and replace it with a brand-new component using a fundamentally different approach: a **pure-CSS marquee** (Tailwind keyframes + `animation`). No `requestAnimationFrame`, no `ResizeObserver`, no manual measurement, no internal state. Same position, same providers, same text.

## Why a different approach
The old component relied on JS-measured single-set width + per-frame `translate3d` updates. That stack has been the source of every "carousel stuck" bug because:
- Mobile Safari throttles rAF aggressively when the page is sticky/offscreen.
- `getBoundingClientRect` returns 0 during font swap → measurement loop never recovers cleanly.
- Visibility/resize handlers compounded edge cases.

A CSS keyframe marquee runs on the compositor, can't "get stuck", needs zero JS, and works identically on mobile and desktop.

## Files to delete
1. `src/components/sections/PromoTracker.tsx` — old rAF implementation.
2. `src/components/sections/PromoTrackerFallback.tsx` — no longer needed (new component cannot crash).
3. `src/components/sections/__tests__/PromoTracker.test.tsx` — obsolete; replaced by new test.

## Files to create
1. `src/components/sections/PromoTicker.tsx` — new component:
   - Same three promos, colours, copy:
     - GoodBody — 5% off on all popular blood tests (#0bb77e)
     - Medichecks — 20% off all tests with code APRIL20 (#e70d68)
     - Lola Health — £20 off with code Mar20 (#fa757e)
   - Renders the promo set **twice** back-to-back inside a flex track.
   - Track animates `transform: translateX(-50%)` over ~30s linear infinite via a Tailwind keyframe `marquee`.
   - Uses `motion-reduce:animate-none` to respect `prefers-reduced-motion`.
   - Same navy background, top/bottom gradient dividers, edge fade mask, typography — visually identical.
   - Pure presentational: no refs, no effects, no state.
2. `src/components/sections/__tests__/PromoTicker.test.tsx` — smoke test:
   - Component renders.
   - All three provider names + promo strings present (duplicated track).
   - Track element carries the `animate-marquee` class.

## Files to edit
1. `tailwind.config.ts` — add to existing `extend`:
   ```ts
   keyframes: {
     marquee: {
       '0%':   { transform: 'translateX(0)' },
       '100%': { transform: 'translateX(-50%)' },
     },
   },
   animation: {
     marquee: 'marquee 30s linear infinite',
   },
   ```
2. `src/components/layout/Header.tsx`:
   - Replace `PromoTracker` + `PromoTrackerFallback` imports with `PromoTicker`.
   - Replace both `<SectionErrorBoundary … fallback={<PromoTrackerFallback />}><PromoTracker /></SectionErrorBoundary>` blocks (mobile + desktop) with plain `<PromoTicker />`.
   - Update comment `Measure PromoTracker height` → `Measure ticker height`.
3. `src/layouts/MainLayout.tsx` — update doc comment `Header (with PromoTracker)` → `Header (with PromoTicker)`.
4. `src/components/common/SectionErrorBoundary.tsx` — update doc comment referencing `PromoTracker`.

## Files intentionally untouched
- `src/components/layout/PromoBanner.tsx` — unrelated standalone banner.
- `src/components/sections/index.ts` — only re-exports `PromoBanner`.
- No database / Supabase changes — promos are hard-coded; no `promos` table exists.

## Verification
- `bun run build` to confirm a clean compile.
- `bunx vitest run src/components/sections/__tests__/PromoTicker.test.tsx`.
- Visual check on `/` for mobile + desktop — ticker scrolls continuously left.
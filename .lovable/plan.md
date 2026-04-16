

## Issue

The standardized `CategoryStandardHero` component already uses fixed pixel sizes (`fontSize: 14` for benefit titles, `fontSize: 12` for descriptions). The visual size difference the user perceives between categories is caused by:

1. **Variable text length** — descriptions like "Early detection and prevention of women's health conditions" (60 chars) wrap to 2 lines while "Test from home — no clinic visit required" (41 chars) fits on 1 line, making the cards appear taller/shorter and the text appear visually denser/lighter.
2. **No fixed line clamp / minHeight** — so the benefit blocks shift height between pages.
3. **Browser font smoothing inconsistency** — without explicit `lineHeight`, browsers compute different effective heights.

The font sizes themselves are already identical across pages — the inconsistency is layout/wrapping, not size.

## Fix

### 1. `src/components/category/CategoryStandardHero.tsx`
Lock benefit text rendering so every card looks identical regardless of copy length:
- Add explicit `lineHeight: 1.3` on title and `lineHeight: 1.4` on description
- Add `minHeight` to the description (`32px` ≈ 2 lines at 12px) so single-line and double-line cards align
- Add `maxWidth: 220px` and `margin: 0 auto` on the description so wrap point is identical across pages
- Set the title `minHeight: 18px` to lock baseline

### 2. Normalize benefit copy length (optional safety net)
Trim 2 over-long descriptions so they wrap consistently within ~50 chars:
- `WomensHealthPage.tsx` — "Early detection of women's health conditions"
- `MensHealthPage.tsx` — "Identify health issues before symptoms develop"
- `SportsPerformancePage.tsx` — already short, leave
- `FertilityTestsPage.tsx` — already short, leave
- `CancerScreeningPage.tsx` — already short, leave
- `AtHomeTestsPage.tsx` — already short, leave

This guarantees every category page hero renders at exactly the same height with identical typography.

### Files to edit
- `src/components/category/CategoryStandardHero.tsx` (lock typography + min-heights)
- `src/pages/WomensHealthPage.tsx` (trim 1 description)
- `src/pages/MensHealthPage.tsx` (trim 1 description)


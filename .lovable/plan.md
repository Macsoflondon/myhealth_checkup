## Scope
Keep the existing sticky ticker exactly where it is at the top of the viewport (rendered by `Header.tsx`, sticky `top-0 z-50`). No placement changes — a hard refresh resolves the earlier "Loading..." HMR state.

Three edits only.

### 1. Rename component `BrandTicker` → `PromoTracker`
- Rename file: `src/components/sections/BrandTicker.tsx` → `src/components/sections/PromoTracker.tsx`
- Rename the component inside the file (`const BrandTicker` → `const PromoTracker`, `export default PromoTracker`).
- Update imports/usages:
  - `src/components/layout/Header.tsx` line 17 — change import path + identifier; replace both `<BrandTicker />` usages (lines 66 and 109); update the two comments mentioning BrandTicker (lines 49, 146) and rename the ref `brandTickerRef` → `promoTrackerRef` for consistency.
  - `src/layouts/MainLayout.tsx` line 3 — update the doc comment.

### 2. Increase font size by 2 Tailwind steps
Current ticker text classes (~line 167 in `BrandTicker.tsx`):
`text-[11px] sm:text-sm md:text-base`
Bump up two steps on the standard scale:
`text-sm sm:text-lg md:text-xl`
Apply to both the provider label `<span>` and the offer text `<span>`. Bullet separator bumps from `text-base sm:text-lg` to `text-lg sm:text-xl` to stay proportional.

### 3. Add ~1 line of top padding
Current container padding (~line 158): `pt-1.5 pb-1.5 sm:pt-2 sm:pb-2`.
One line at the new font size ≈ 24–28px ≈ Tailwind `pt-7`. Change to:
`pt-7 pb-1.5 sm:pt-8 sm:pb-2`
Bottom padding unchanged so the gradient divider hugs the text as today.

## Files to be modified
- `src/components/sections/BrandTicker.tsx` → renamed to `src/components/sections/PromoTracker.tsx` (rename + font-size + padding)
- `src/components/layout/Header.tsx` (import, JSX, ref name, comments)
- `src/layouts/MainLayout.tsx` (doc comment only)

## Out of scope
- No changes to scroll/sticky behaviour, animation speed, colours, or `TestCategoryTicker`.
- No changes to `CategoryStandardHero` or the `/wellness` page — once HMR settles after the rename, the sticky promo tracker will render at the top of every page including `/wellness`.
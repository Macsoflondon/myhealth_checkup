# Provider cards: remove Browse Tests + fix missing star ratings

## Task 1 — Retire the "Browse Tests" button

Each provider's tests now live on their profile page, so the separate Browse Tests CTA goes away.

- **`src/components/sections/FeaturedProvidersGlass.tsx`** (the live cards on /our-providers):
  - Delete the large gradient "Browse Tests" button (links to `getProviderRoute`).
  - Promote "View Profile" to the prominent full-width CTA in that gradient style. For Randox this satisfies the request directly — its View Profile already points at the Randox profile page (`getProviderProfileRoute('randox')`), which is where its tests are listed.
  - Keep "Visit Site" as the secondary link; it becomes full-width too (or sits alone below).
- **`src/components/sections/FeaturedProviders.tsx`** (lazily loaded variant): remove its "Browse Tests" `Button`; keep View Profile + Visit Site.
- No routes are deleted — `getProviderRoute` may still be used elsewhere (e.g. provider profile pages link back to test grids); only the card buttons change.

## Task 2 — Star ratings for Clinilabs, London Health Company, Medical Diagnosis

Cause (confirmed): `src/constants/providerRatings.ts` deliberately returns `null` for providers with no verified rating, and the card hides the star row when `canonical` is null. These three providers simply have no entry — no bug in rendering, just missing data. The constants file explicitly forbids inventing fallback ratings (CMA/advertising rules).

Approach:
- During implementation, research the live public review scores (Trustpilot/Google/Feefo) for each of the three providers via web search.
- Add verified entries to `PROVIDER_RATINGS` (+ `PROVIDER_NAME_MAP` entries) with real numbers and a source comment. The existing cards in `FeaturedProvidersGlass.tsx` then render stars automatically — no component change needed.
- If a provider has no verifiable public rating online, its star row stays hidden (per the honest-comparison rule) and I'll report that back to you instead of fabricating a number.

## Notes

- Presentation + data constants only; no routing, schema, or logic changes.
- After edits: build/typecheck pass, then visual check of /our-providers on desktop and mobile widths.

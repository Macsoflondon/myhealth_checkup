## Goal

Make every test card on the platform look and behave exactly like the card on `/at-home-tests` (provider header, test name, category, description, biomarker chips, stats row, price + sub-label, Compare + Book), open the same rich detail modal, and ship inside a listing page laid out like `AtHomeTestsPage` (sticky search, category chip rail, responsive grid, load-more, sticky compare bar).

## What changes

### 1. Promote the card to a reusable component
- Extract `AtHomeTestCard` from `src/pages/AtHomeTestsPage.tsx` into `src/components/cards/UniversalTestCard.tsx`.
- Extract `TestInfoSheet` from the same file into `src/components/cards/UniversalTestDetailModal.tsx`.
- Add a shared `UniversalTestData` type with the union of fields all sources provide (test_name, provider_id, category, description, biomarker_count, biomarkers_list, price, turnaround_days_text, sample_method, url, is_popular).

### 2. Adapter layer so every data source can feed the card
- New `src/lib/universalTestAdapter.ts` with `fromAtHomeTest`, `fromProviderTest`, `fromMedichecksTest`, `fromTestsMaster`, `fromUnifiedCard`, `fromPopularTest`.
- Adapter resolves provider meta + logo via existing `getProviderMeta` / `getProviderLogo` and normalises the collection method label (At-home kit / Clinic / Both) so the stats row stays consistent.

### 3. Replace existing card components
- Re-point these imports to `UniversalTestCard`:
  - `src/components/cards/UnifiedTestCard.tsx` (becomes a thin wrapper for backwards compat)
  - `src/components/providers/ProviderTestCard.tsx` (wrapper)
  - `src/components/providers/medichecks/MedichecksTestCard.tsx` (wrapper)
- Update direct call sites that pass through bespoke props:
  - `src/components/sections/MostPopularTestsSection.tsx`
  - `src/components/sections/DreamHealthShowcase.tsx`
  - `src/components/compare/RecommendedTestsCarousel.tsx`
  - `src/components/providers/ProviderTestsGrid.tsx`
  - `src/pages/CompareTests.tsx`
  - `src/pages/ProviderTestsCatalogPage.tsx`, `ProviderTestCatalogPage.tsx`
  - `src/pages/ProviderProfilePage.tsx`
  - `src/pages/MedichecksTestsCatalogPage.tsx`, `MedichecksMensHealthPage.tsx`

### 4. Promote the listing layout
- New `src/components/category/UniversalTestsListing.tsx` — generic page body lifted from `AtHomeTestsPage` (sticky search input, horizontal category chip rail, results count, responsive grid of `UniversalTestCard`, load-more button, sticky compare bar slot, detail modal wiring).
- Props: `tests`, `categories`, `activeCategory`, `onCategoryChange`, `search`, `onSearchChange`, `isLoading`, `pageTitle`, `pageSubtitle`, optional `heroSlot`.
- Refactor `src/components/category/CategoryPageLayout.tsx` to render this listing internally so every existing category page (Wellness, Womens, Mens, Sports, Cancer, Heart, Diabetes, Vitamins, Gut, Thyroid, Hormones, Fertility, etc.) inherits the at-home layout automatically.
- Refactor these listing pages to render `UniversalTestsListing` directly:
  - `MedichecksTestsCatalogPage`, `MedichecksMensHealthPage`
  - `ProviderTestsCatalogPage`, `ProviderTestCatalogPage`
  - `PopularTestsPage`

### 5. Detail modal everywhere
- Every card click opens `UniversalTestDetailModal`.
- Modal renders: navy header (provider logo + name + test name + close), price + turnaround + sample method, full description, biomarker list (chips, scrollable), what's included, collection options with add-on prices, Compare toggle + Book CTA.
- Replace `ProviderTestDetailModal` usage with the universal modal (keep the file as a re-export for compatibility).

### 6. Wire compare + book consistently
- Compare button uses the existing `compareStore` everywhere (already in place on AtHomeTestCard).
- Book button: if `test.url` exists → open in new tab; else fall back to `/contact?test=<id>`.
- Disabled state styling preserved.

## Out of scope

- No copy or data changes.
- No new pages or routes.
- No backend / Supabase changes.
- Admin pages, scrapers, and the comparison table itself are untouched.

## Technical notes

```
src/components/cards/
  UniversalTestCard.tsx          (new — lifted from AtHomeTestsPage)
  UniversalTestDetailModal.tsx   (new — lifted from AtHomeTestsPage)
  UnifiedTestCard.tsx            (becomes wrapper)

src/lib/
  universalTestAdapter.ts        (new)

src/components/category/
  UniversalTestsListing.tsx      (new — lifted from AtHomeTestsPage body)
  CategoryPageLayout.tsx         (refactor to use UniversalTestsListing)

src/pages/AtHomeTestsPage.tsx    (slimmed to data hook + <UniversalTestsListing />)
```

Estimated file touches: ~18 (3 new, ~15 edits). Risk: prop drift on call sites that pass bespoke fields — handled via the adapter so existing data flows don't need to change.

# Compare All Providers CTA on live comparison tables

## What you'll see

Every live comparison card (Full Blood Count, Thyroid Function, Male/Female Hormone Panel, and any future panel) gets a prominent primary button, **Compare All Providers**, sitting directly above the "Prices verified … always confirm current pricing" disclaimer.

Tapping it takes the user to the existing side-by-side comparison page, pre-populated with the equivalent tests from every provider shown in that card — nothing unrelated. The transition fades in rather than hard-cutting, and the page works the same on mobile, tablet and desktop.

## How it works

The card already knows which test group it is showing (its canonical category, e.g. `fbc`, `thyroid`, `female_hormones`). Rather than passing a long list of test ids through the URL — the current `?ids=` param is capped at five — the button links to the comparison page with the panel's category, so the page rebuilds the same set from the live database.

### Changes

1. **`src/hooks/useDynamicComparisonPanels.ts`** — carry the `canonical` slug (and the cheapest matching test id per provider) on each panel it returns. No new queries; it already selects these rows.

2. **`src/components/sections/LiveComparisonCard.tsx`**
   - Extend `LiveComparisonPanelData` with an optional `canonical` slug.
   - Render a full-width primary button (turquoise → pink hover, rounded-full, Montserrat, matching existing CTA styling) between the provider rows and the disclaimer footer.
   - Link via TanStack `<Link to="/compare/results" search={{ panel: canonical }}>`, so it keeps preloading and cmd-click behaviour. The four hardcoded fallback panels get their canonical slug added so the CTA works even before live data resolves.

3. **`src/pages/ComparisonResultsPage.tsx` + `src/hooks/useCompareUrlSync.ts`**
   - Accept a new optional `panel` search param. When present and no `ids=` selection exists, load the equivalent tests through the existing `CompareService.getTestsByCategory(canonical)` path, keep the cheapest listing per provider, cap at eight, and feed them into the existing compare store/table.
   - Existing `?ids=` behaviour is untouched — a user-built selection always wins over the panel param.

4. **`src/lib/compareUrl.ts`** — small helper to build/parse the `panel` param alongside the existing `ids` helpers.

The comparison page itself is unchanged: `ProviderComparisonTable` already renders provider, test name, price, collection method, fees, biomarkers, turnaround, clinical review, accreditation and the booking link from `CompareTestData`.

### Notes

- No new tables, no duplicated data — all reads go through `CompareService` / `unified_provider_tests`.
- The results page stays `noindex,follow`, so no SEO impact.
- A brief skeleton shows while the panel resolves, reusing the page's existing hydrating state.

# Test card contract

The pass/fail standard for every surface that renders a test card, test listing row,
or test comparison row. Derived from the platform's operating rules: a test listing
must display test name, biomarkers included, price in GBP, turnaround time, sample
method, and location options; pricing must be transparent; the platform is a
comparison layer, never a medical provider or a reseller.

Amend this file when a rule is missing. Do not audit against unwritten standards.

## Rebuilding the surface inventory (do this every run)

Do not trust the list below — it is a starting point that goes stale. Regenerate:

```
rg -l "UniversalTestCard|UnifiedTestCard|ProviderTestCard|TestListCard|MedichecksTestCard" src/
rg -ln "test_name|provider_tests" src/components src/pages src/routes
```

Then reconcile against the routes in `src/routeTree.gen.ts`, so a surface that exists
but is only reachable from one route still gets audited. Known renderers as of the last
run — verify each still exists and add anything new:

- `src/components/cards/UniversalTestCard.tsx` — the real card; everything else wraps it
- `src/components/cards/UnifiedTestCard.tsx` — legacy prop shim over `UniversalTestCard`
- `src/components/providers/ProviderTestCard.tsx`, `ProviderTestsGrid.tsx`
- `src/components/providers/medichecks/MedichecksTestCard.tsx`
- `src/components/compare/TestListCard.tsx`, `ModernCompareTable.tsx`, `TestProviderPriceTable.tsx`
- `src/components/sections/MostPopularTestsSection.tsx`, `FeaturedTests.tsx`, `HeroPopularTests.tsx`, `LiveComparisonCard.tsx`
- `src/components/category/CategoryPageLayout.tsx`
- `src/components/search/IntelligentSearch.tsx`

Adapters are part of the surface — a field lost in an adapter looks like a card bug:
`src/lib/unifiedCardAdapter.ts`, `src/lib/universalTestAdapter.ts`, `src/lib/categoryTestMapper.ts`.

## Field rules

Per card, each field is PASS only with evidence it renders from real data:

| Field | Rule | Common failure |
|---|---|---|
| Test name | Cleaned of provider marketing suffixes, never truncated mid-name | `cleanTestName` stripping a legitimate `-` segment |
| Biomarker count | Renders the real count; absent data shows an honest empty state, never `0` styled as a value | adapter defaulting `biomarker_count ?? 0` |
| Biomarker list | Available on the card or one click away on the detail page; full list, not a sample | truncated list with no "view all" |
| Price | GBP, `£`, correct decimals; "from" prefix only when the row genuinely is a starting price | `price_from` not passed through an adapter |
| Add-on costs | Phlebotomy / GP review shown separately where they apply | add-ons absent entirely from `total_expected_cost` |
| Turnaround | Real value; missing data reads as unavailable, not invented | `"Not stated"` masking a value the DB does have |
| Sample method | Real value | as above |
| Location options | Home kit / clinic / both, matching `home_kit_available` / `clinic_visit_available` / `collection_options` | flags ignored by an adapter |
| Provider | Named and attributed on the card | provider only visible on hover |
| Accreditation | UKAS / CQC / ISO 15189 status surfaced where claimed | claim rendered with no backing field |

Missing data is shown as missing. Placeholder, invented, or defaulted values are a FAIL,
not a cosmetic issue — the platform's product is trust.

## Link rules

**The primary click target of a test card is our own test detail page**, the canonical
`/provider/:providerId/tests/:testId`, built with `getTestDetailUrl` /
`getTestUrlFromProviderName` from `src/utils/providerRoutes.ts`. Never the provider's
external URL.

The provider's external URL belongs only on an explicit, separately labelled booking
action, opened deliberately, with any affiliate relationship disclosed.

Check for, and treat as FAIL:

- `href={test.url}` / `window.open(test.url, …)` as the card's main action
- `target="_blank"` on the card body or title
- a raw `provider_tests.url` reaching a card as its only link
- a card whose CTA reads "View test" but leaves the site

Known instance at the time this contract was written: `UniversalTestCard` uses
`test.url` as its primary target (`src/components/cards/UniversalTestCard.tsx`, the
anchor near L747, the click handler near L871, the CTA label near L1494), so every
surface feeding it — the homepage Most Popular section included — sends users straight
to the provider. Re-verify before assuming it is still true or still broken.

## Copy rules

- Great British English.
- No provider marketing language in comparison copy, no outcome guarantees, no
  fear-based framing, no vague claims.
- Clinical terms explained in plain English on first use.
- Nothing implying the platform diagnoses, treats, or provides care.
- Apply the `stop-slop` skill to any card copy written or rewritten during a fix.

## Consistency rule

The same test rendered on two surfaces must show the same values. Cross-check at least
three tests across every surface that can render them. Divergence means an adapter is
dropping or defaulting a field — fix the adapter, not the surface.

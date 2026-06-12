## Goal

1. Restyle the three CTA buttons at the bottom of the test detail modal (`ProviderTestDetailModal`) to match the site-wide CTA style — turquoise (#22c0d4) with pink (#e70d69) hover, white text, rounded, no per-provider brand colour on the buttons.
2. Make **every** test card across the site open this detail modal first when clicked. Inside the modal the user can then Book, Compare, or go Back.

## Scope of changes

### 1. `src/components/providers/ProviderTestDetailModal.tsx`

Replace the CTA button block (lines ~349–412) so all three buttons use the standardised platform style:

- **Book test** → solid `bg-[#22c0d4] hover:bg-[#e70d69] text-white` rounded-xl, opens `test.url` in new tab (unchanged behaviour). Disabled state keeps the same colour scheme but at reduced opacity when no URL.
- **+ Compare / In compare** → solid `bg-[#e70d69] hover:bg-[#22c0d4] text-white` rounded-xl (mirror of Book — the two main CTAs form the turquoise↔pink pair already used in `CallToAction.tsx` and `StartJourneySection`). Keeps the toggle logic + navigate to `/compare?openCompare=1`.
- **← Back** → ghost / outline style with navy text on white, `border-[#081129]/15 hover:bg-[#081129]/5`, simply closes the modal.

Remove `style={{ backgroundColor: brandColor }}` from these buttons. Brand colour stays everywhere else in the modal (header bar, accreditation pills, provider avatar).

### 2. `src/pages/CompareTests.tsx` — wire modal into the `/compare` cards

In `renderCard` (lines 88–112), add a `testDetails={…}` prop on `UnifiedTestCard` built from the `CompareTestData`, mirroring the mapping used in `MostPopularTestsSection.tsx` lines 79–93:

```ts
testDetails={{
  id: test.id,
  provider_id: test.provider.toLowerCase().replace(/\s+/g, "-"),
  test_name: test.name,
  description: test.description ?? null,
  price: test.price ?? null,
  category: test.category ?? null,
  sample_type: test.features?.collection ?? null,
  biomarker_count: test.biomarkerCount ?? null,
  url: test.url ?? null,
  biomarkers_list: null,
  turnaround_days_text: test.features?.turnaround ?? null,
  base_price: null,
  collection_options: null,
}}
```

Remove `onCtaClick={() => handleToggleSelect(test)}` so the card click opens the modal (default behaviour in `UnifiedTestCard` when `testDetails` is present). Compare toggling now happens inside the modal via its **+ Compare** button. The card-level "Selected ✓" visual state stays via `compareSelected={selected}`.

### 3. `src/components/category/CategoryPageLayout.tsx` — wire modal into category grid cards

In the grid map (lines 246–269), add the same `testDetails` mapping, sourced from each `test` row (uses fields `test.id`, `test.provider`, `test.title`, `test.desc`, `test.price`/`priceNum`, `test.biomarkerCount`, `test.biomarkers`, `test.turnaround`, `test.collection`, `test.url`, `test.tag`). Drop the direct `url` opening on CTA — clicking the card opens the modal, and the modal's **Book test** button then handles the external link.

`compareSelected` + `onCompareToggle` are kept so the in-card compare state still works for users who want to multi-select from the grid without opening the modal — but the primary click target now opens the modal first, matching the requested flow.

### 4. No changes needed

`MostPopularTestsSection.tsx` and `RecommendedTestsCarousel.tsx` already pass `testDetails` — they automatically pick up the new button styling from change #1.

## Out of scope

- No data, fetching, or business-logic changes.
- No changes to card visual layout (only the modal's CTA row + click wiring).
- No changes to provider branding colours used elsewhere in the modal.

## Verification

- Open `/compare`: click any card → modal opens with new turquoise/pink buttons. **+ Compare** adds the test and routes to comparison. **Book test** opens provider site in new tab. **← Back** closes modal.
- Open a category page (e.g. `/wellness`): same behaviour.
- Open the homepage Most Popular section: cards already opened the modal — confirm buttons now use the new colour scheme.
- `bun run build` passes clean.

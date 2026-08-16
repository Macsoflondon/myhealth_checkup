# Show real test-kit images first on every test card

## What's actually wrong

Two separate problems, confirmed by checking the database and the query code:

**1. Most tests have no image stored.** Of 719 active tests, only 224 have an `image_url`:

| Provider | Active tests | With image |
|---|---|---|
| Clinilabs | 126 | 126 |
| London Health Company | 16 | 15 |
| Medichecks | 195 | 37 |
| Randox | 30 | 13 |
| Lola Health | 109 | 12 |
| London Medical Laboratory | 36 | 9 |
| Goodbody Clinic | 25 | 6 |
| Medical Diagnosis | 168 | 6 |
| Thriva | 14 | 0 |

**2. Several pages don't even ask for the image.** Where an image does exist, some screens still show the navy gradient placeholder because their query omits the `image_url` column. Confirmed missing in: the provider profile tests grid (the screen in the screenshot), the provider tests catalogue, the Medichecks catalogue and men's health pages, clinic tests, recommended tests, resolved recommendations and hero popular tests.

Additionally, some stored URLs are not product photos — Randox rows point at a flag icon (`gb.png`) rather than a kit image; those need replacing, not keeping.

## The fix

### Part A — make existing images render (quick)
Add `image_url` to every test-card query that currently omits it, and pass it through the adapters those pages use so the card's product-image layer receives it. No card redesign — the two-state hover card already handles images correctly.

### Part B — backfill the missing images (the bulk of the work)
Populate `image_url` for the remaining active tests, provider by provider, always taking the product image from the provider's own live product page so the picture matches the exact test:

- Shopify-backed providers (Goodbody Clinic, Lola Health, London Health Company, Clinilabs, Medichecks) — read `products.json` / product JSON on each product URL and take the primary product image. This is reliable and covers the largest gaps (Medichecks 158, Lola 97).
- Non-Shopify providers (Medical Diagnosis, London Medical Laboratory, Randox, Thriva) — extract the Open Graph / primary product image from each stored product URL.

Matching is by the stored product `url` on each row, so an image can never be attached to the wrong test. Rows whose product page yields no usable image are left null and reported, rather than filled with a logo or a generic stock photo.

Randox rows currently holding the flag icon are cleared and re-fetched in the same pass.

### Part C — keep it from regressing
- Extend the existing scraper/ingest path so `image_url` is captured on every future run, not just for some providers.
- Add a small admin coverage figure (images present vs active tests, per provider) so gaps are visible instead of silently degrading to placeholders.
- Where no genuine kit image exists, the current branded gradient placeholder stays — it is honest and better than a misleading stock image.

## Technical notes

- Queries to update: `ProviderTestsGrid.tsx`, `ProviderTestsCatalogPage.tsx`, `MedichecksTestsCatalogPage.tsx`, `MedichecksMensHealthPage.tsx`, `useClinicTests.ts`, `useRecommendedTests.ts`, `useResolvedRecommendations.ts`, `useHeroPopularTests.ts` — plus the corresponding `universalTestAdapter` mapping where the adapter input type omits the field.
- Backfill runs as an ingest script writing to `provider_tests` keyed on `provider_id` + `test_name` (never the view), in batches per provider, with a dry-run report before each write.
- No schema change needed; `image_url` already exists.

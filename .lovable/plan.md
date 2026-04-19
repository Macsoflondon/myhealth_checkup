

## Plan: Refresh Lola Health catalogue from `lolahealth_master.xlsx`

### Current state (verified in DB)
- **71 rows** in `provider_tests` for `provider_id = 'lola-health'`.
- Significant data corruption:
  - Mismatched URLs (e.g. *Apolipoprotein A1* → `/products/anti-nuclear-antibodies-ana`, *Aluminium* → `/products/abo-blood-group`).
  - 29 rows mis-bucketed under **Liver Function**.
  - ~18 duplicate `(test_name, url)` pairs.
  - `provider_test_id` is NULL across the board (breaks our canonical mapping rule).
  - Most rows missing `sample_type`, `biomarker_count`, `biomarkers_list`, `description`.
- Separate `lola_health_products` table exists with 5+ marketing bundles (Advanced Women's Health, Executive Checkup, etc.) — not surfaced as test cards.
- Provider registry (`src/constants/providers.ts`) is fine; `ProviderLogo`, comparison data, and clinic mappings already include Lola.

### What the refresh will do

**1. Parse `lolahealth_master.xlsx`** (in default mode, via Python/pandas)
   - Read every sheet, normalise columns to the canonical schema: `test_name`, `provider_test_id` (slug from URL), `category`, `price`, `original_price`, `discount_percentage`, `biomarker_count`, `biomarkers_list`, `sample_type`, `home_kit_available`, `is_addon`, `description`, `who_should_test`, `url`.
   - Map Lola's own categories → our taxonomy (General Health, Heart Health, Hormones, Fertility, Thyroid, Vitamins & Minerals, Sports-Fitness Health, Women's Health, Men's Health, Cancer Screening, etc.).
   - Mark add-on biomarkers with `is_addon = true` and bundles/panels with `is_addon = false`.

**2. Clean rebuild of Lola rows in `provider_tests`** (migration)
   - `DELETE FROM provider_tests WHERE provider_id = 'lola-health'` then bulk `INSERT` from the parsed sheet, with `provider_test_id` populated and a UNIQUE-safe upsert key `(provider_id, provider_test_id)`.
   - Sets `url_verified = true`, `url_verified_at = now()`, `scraped_at = now()`, `is_active = true`, `sample_type = 'Finger-prick'`, `home_kit_available = true`, `clinic_visit_available = false` (per Lola's home-kit model).

**3. Sync `lola_health_products`** with the bundle/panel rows from the sheet (insert any new bundles, update prices on existing).

**4. Surface new headline tests as cards**
   - Anything in the sheet that isn't already a featured Lola test gets included in the catalogue automatically (it renders via `useProviderTestsQuery('lola-health')` on the provider profile + comparison engine — no per-card React work needed).
   - Add any net-new top-level **panels** (e.g. "Advanced Women's Health Screening", "Comprehensive Male Health Panel", "Executive Checkup", "Fertility Assessment Female/Male" if present in the sheet) to `src/data/compare/medichecksData.ts`-style mapped data only if they should appear in the **homepage Most Popular** rail. Otherwise they appear automatically in `/providers/lola-health` and `/compare`.

**5. Verification step (in default mode)**
   - Re-query: row count, category distribution, no duplicate `(provider_id, provider_test_id)`, no URL/test-name mismatches, all rows have `provider_test_id`.
   - Spot-check 5 URLs return 200 via `lov-fetch-website`.

### Compliance / brand guardrails applied
- Prices kept numeric (GBP).
- Turnaround copy stays "typical" / non-guaranteed.
- British English in all descriptions.
- Lola's accreditations preserved (UKAS).
- No medical claims added.

### Files / artefacts touched
- **Migration:** wipe + re-insert Lola rows in `provider_tests`; upsert into `lola_health_products`.
- **No React component changes required** — provider catalogue, comparison engine, and clinic page already read from `provider_tests` dynamically.
- **Optional:** add 2–3 standout new bundles to a curated array if you want them in the homepage "Featured Tests" rail (will confirm after parsing the sheet).

### Open question I'll resolve once the sheet is parsed
The xlsx may include non-blood services (e.g. ECG, ultrasound, doctor consults). My default: ingest blood/biomarker products only, and flag non-blood items in the verification report for your call before adding.


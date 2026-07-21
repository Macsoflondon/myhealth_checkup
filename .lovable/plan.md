# Full 7-Scraper Rebuild to Locked CRUX Spec

Medichecks, London Health, Lola are already on the new pipeline. This plan ports the remaining 7 providers to the same locked field set, provenance-based upserts, history writes, and turnaround extraction.

## Scope

Providers to rebuild (in this order, batched by similarity):
1. **Thriva** — Shopify-based (same shape as Medichecks/Lola)
2. **Randox Health** — custom HTML catalogue
3. **Goodbody** — custom HTML catalogue
4. **Bluecrest** — custom HTML catalogue
5. **Nuffield Health** — custom HTML catalogue
6. **Bupa** — custom HTML catalogue
7. **Superdrug Health Clinic** — custom HTML catalogue

Out of scope: Medichecks, London Health, Lola (already ported); schema changes (Stage 1 already applied); UI.

## Locked CRUX field set (per test)

Every scraper must write:
- `test_name`, `provider_test_id` (stable handle/SKU/URL slug), `url`
- `base_price`, `phlebotomy_included`, `home_kit_available`, `home_nurse_cost`, `clinic_visit_cost`, `gp_review_status`, `total_expected_cost` (= base + lowest available collection fee; unavailable fee = null, never 0)
- `biomarker_count`, `biomarker_list[]`
- `sample_type`, `collection_method` (home | clinic — never "walk-in")
- `turnaround_time` raw string + parsed `turnaround_days`, `turnaround_hours`, `turnaround_unit` (or `not_stated`)
- `category`, `description`, `who_should_test`, `gender_specific`
- Provider-level: `trustpilot_rating`, `review_count` (refreshed via `refresh-trustpilot-ratings`)

## Approach per provider

For each scraper `supabase/functions/<provider>-scraper/index.ts`:

1. Use authoritative catalogue source:
   - Shopify → `products.json` (Thriva)
   - Custom → sitemap.xml or category index page for URL list
2. For each product URL, fetch HTML, parse via `_shared/scrape/*` helpers (`parsePrice`, `parseTurnaround`, `parseBiomarkers`, `parseCollection`).
3. Call `upsertWithProvenance` with `provider_test_id` + `url` on the FIRST call (avoid the Medichecks duplication regression).
4. Snapshot via shared `writeHistory` on every run.
5. Chunk large catalogues with `?offset=N&limit=50` to avoid edge timeouts.
6. Mark `scraping_jobs` completed only when ≥1 row upserts.

## Execution order

- **Sub-agent A**: Thriva (Shopify, fastest — proves the pattern)
- **Sub-agent B**: Randox + Goodbody (parallel, both custom HTML)
- **Sub-agent C**: Bluecrest + Nuffield (parallel)
- **Sub-agent D**: Bupa + Superdrug (parallel)

After each sub-agent lands: run scraper in chunks, then run `audit-scrape-completeness` for that provider only, and report row counts, distinct-URL parity, turnaround fill rate, `total_expected_cost` fill rate, £0 count.

## Guardrails (from prior lessons)

- **Never** insert without `provider_test_id` — caused Medichecks 393-vs-211 duplication.
- **Never** use greedy first-number price regex — caused LHC £1/£0 corruption. Use anchored `£`/`GBP` parser from `_shared/scrape/parsePrice.ts`.
- **Never** invent turnaround — missing = `not_stated`.
- **Never** emit "walk-in" as a collection method.
- Only touch the 7 target scraper files + their shared imports. Do not modify schema, other scrapers, or UI.

## Reporting

Final report per provider:
- active rows, distinct URLs, distinct PTIDs (must match)
- turnaround filled + `not_stated` = 100%
- `total_expected_cost` fill %
- £0 count (should be 0)
- history rows written this run

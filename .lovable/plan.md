# Plan: End-to-end scraped → category page pipeline

Three connected pieces plus automation. Built so a scraped provider section (e.g. "Women's Health" collection on Medichecks) becomes a fully-rendered card on `/womens-health` with no manual mapping.

---

## 1. Section-driven category mapping (no keyword guessing)

**Schema changes** (`provider_tests`):
- `source_section` text — the provider's own section/collection path (e.g. `womens-health`, `mens-health`, `fertility`, `sexual-health`).
- `source_section_label` text — human label scraped from the breadcrumb / collection title.
- `canonical_category` text — normalised site category (`womens-health`, `mens-health`, `fertility`, `sexual-health`, `hormones`, `thyroid`, `heart`, `gut`, `vitamins`, `cancer-screening`, `general-health`, `sports-performance`, `at-home`).
- index on `(canonical_category, is_active, provider_id)`.

**New mapping table** `provider_section_category_map`:
- `provider_id`, `source_section` → `canonical_category` (admin-editable, RLS: public read, admin write).
- Seed it for the 9 active providers from their actual collection URLs.

**Scraper changes** (`medichecks-scraper`, `goodbody-scraper`, `lola-health-scraper`, `thriva-scraper`, `randox-scraper`, `london-health-scraper`, `clinilabs-scraper`, `medical-diagnosis-scraper`, `provider-scraper`):
- Each scraper already iterates over collection/section URLs — capture that URL slug as `source_section` and the page H1/breadcrumb as `source_section_label` on every row written.
- New shared util `supabase/functions/_shared/category-resolver.ts`:
  - Look up `provider_section_category_map` first.
  - Fall back to a static alias table (e.g. `womens-health|women|female|gynae` → `womens-health`) ONLY when no row exists, then log an unmapped-section alert into `scraper_alerts` so an admin can map it.
- Remove the keyword-from-test-name logic entirely.

---

## 2. Database-driven category pages

Convert hardcoded arrays in:
- `WomensHealthPage.tsx`, `MensHealthPage.tsx`, `FertilityTestsPage.tsx`, `AtHomeTestsPage.tsx`, `SportsPerformancePage.tsx`, `CancerScreeningPage.tsx`, `HormonesPage.tsx`, `ThyroidPage.tsx`, `HeartHealthPage.tsx`, `GutHealthPage.tsx`, `DiabetesTestingPage.tsx`, `VitaminDeficiencyPage.tsx`.

New hook `useCategoryTests(canonicalCategory)`:
- Selects from `provider_tests` joined with provider metadata where `canonical_category = ?` AND `is_active = true` AND `image_url IS NOT NULL` (per user's earlier rule — hide if no image).
- Maps to existing `CategoryTestItem` shape so `CategoryPageLayout` is unchanged.
- Sort: popular first, then price asc.

Page files become thin wrappers: SEO copy + `<CategoryPageLayout tests={useCategoryTests('womens-health')} ... />`.

Loading + empty states handled in `CategoryPageLayout`.

---

## 3. Auto-promote pipeline → `tests_master` + `provider_test_mapping`

New edge function `promote-provider-tests`:
- Runs after every scrape.
- For each new/updated `provider_tests` row:
  1. Normalise test name (lower, strip "blood test", provider suffix).
  2. Fuzzy-match against `tests_master.test_name` within same `canonical_category` (trigram similarity ≥ 0.7).
  3. If match → upsert `provider_test_mapping` (provider_id, test_master_id, provider_test_id, name, price, url, turnaround, sample method, accreditations, `last_scraped_at`).
  4. If no match → INSERT new `tests_master` row (test_name, category=canonical_category, description from scraped data, biomarkers from `biomarkers_list`, sample_type, turnaround) THEN upsert mapping.
- Migration: enable `pg_trgm`, add `service_role` INSERT/UPDATE grants on `tests_master` and `provider_test_mapping`.
- All test cards (homepage popular, category pages, comparison hub) now have a guaranteed CTA URL + full details because the mapping row always carries `provider_url`.

---

## 4. Automation: 2x daily + post-scrape verification

- Migration enables `pg_cron` + `pg_net` if not already enabled.
- New edge function `scrape-and-verify`:
  1. Invokes `run-all-scrapers`.
  2. Waits for completion, then invokes `verify-provider-images` + `promote-provider-tests`.
  3. Runs a verification pass: for each provider, sample 5 random scraped rows, HEAD-check the `url`, log failures into `scraper_alerts`.
  4. Writes a summary row into a new `scrape_run_log` table (counts, duration, failures).
- Cron: `0 6,18 * * *` (06:00 and 18:00 UTC) via `pg_cron` calling `scrape-and-verify` with service-role bearer.
- Admin dashboard gets a "Last run / next run / failures" panel pulling from `scrape_run_log`.

---

## Order of execution

1. Migration 1: schema additions (`source_section`, `canonical_category`, mapping table, `scrape_run_log`, `pg_trgm`, grants).
2. Shared `category-resolver.ts` + seed mapping rows for 9 providers.
3. Update all 9 scrapers to record section + use resolver.
4. Build `promote-provider-tests` function.
5. Build `useCategoryTests` hook + refactor 12 category pages.
6. Build `scrape-and-verify` function + cron schedule.
7. Backfill: run promote on existing `provider_tests` rows once.
8. Admin dashboard panel for run log.

## Technical notes

- No frontend visual changes to `CategoryPageLayout` — only data source swap.
- Hardcoded arrays kept as fallback for one release behind a `USE_DB_CATEGORY_TESTS` flag, then deleted.
- All new tables: explicit `GRANT`s, RLS enabled, admin-write only via `has_role`.
- Service-role key stays server-side; cron uses it in the `net.http_post` header.

## Open question

Should the unmapped-section alerts auto-create a `provider_section_category_map` row with a best-guess `canonical_category` (admin reviews later), or stay blocked until an admin maps it explicitly?
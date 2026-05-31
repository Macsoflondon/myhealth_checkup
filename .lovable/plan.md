## Goal

1. Trigger a real full re-scrape of every provider catalogue so the homepage popular tests reflect live source data (not stale rows like Medichecks Advanced Thyroid at £89 vs current site price).
2. After the scrape, automatically re-rank `is_popular` from each provider's actual bestseller page and re-sanitise names/dupes.
3. Display `from £X` consistently in front of every price across test cards and list views, not just the lower carousel.

## Why the prices look wrong today

- Per-provider scrapers do upsert prices on each run, but the homepage "popular tests" rows are pinned by hardcoded UUID in old migrations (`20260530214405...`). After a scrape, the price on those rows updates but the chosen row may no longer be the actual bestseller. So we keep showing e.g. Randox "Thyroid £37" because that's the pinned row, even if it was renamed/repriced.
- `base_price` is only populated for Lola (via a one-off SQL). Everywhere else `base_price IS NULL`, so the UI falls back to plain "£" — no "from".
- `scrape-popular-tests` exists and uses Firecrawl JSON-extract against each provider's bestsellers/all-tests page, but it isn't on a schedule and isn't called by `run-all-scrapers`.

## Plan

### 1. Run a real catalogue refresh

- Invoke `trigger-all-scrapers` (which fans out to `run-all-scrapers` → 9 provider scrapers). Wait for `scraping_jobs.status='completed'` for each.
- Then invoke `scrape-popular-tests` so `is_popular` / `popularity_rank` are re-derived from each provider's live bestseller page (replacing the hardcoded UUID pins from the May migration).
- Then run `public.sanitize_popular_provider_tests()` to de-dupe and cap at 5 per provider.

### 2. Wire popular-test refresh into the schedule + admin UI

- Update `supabase/functions/run-all-scrapers/index.ts` so that after all provider scrapers complete it also calls `scrape-popular-tests` and `sanitize_popular_provider_tests`. This makes the existing daily cron (`refresh-popular-tests-daily` at 04:30) and any admin "Run all" button keep popular rankings + prices fresh together.
- Add a new daily cron (via `supabase--migration`) that runs `run-all-scrapers` itself nightly (currently only `scrape-popular-tests` is scheduled, individual scrapers are not), using the existing `SCRAPER_CRON_SECRET` bearer pattern already supported by `run-all-scrapers`.
- Surface a "Refresh popular tests" button on `AdminDataRefreshPage` that calls `scrape-popular-tests` directly for ad-hoc resyncs.

### 3. Fix the "from £" display globally

- Stop relying on a sparsely populated `base_price`. Introduce a shared `formatTestPrice(test)` helper in `src/lib/utils.ts` that returns `from £<price>` whenever the provider has add-on options (phlebotomy/GP) or `base_price` differs from `price`, otherwise `£<price>`.
- Apply it in:
  - `src/components/sections/DreamHealthShowcase.tsx` (popular-tests grid + filmstrip price label).
  - `src/components/providers/ProviderTestCard.tsx` and any list views consuming `provider_tests` (compare grids, provider catalogue pages, recommendations). Replace ad-hoc `£{price}` JSX with the helper.
- For Goodbody / Medichecks / Randox / Thriva / LML where home-kit and clinic prices differ, also write `base_price = price` and populate `collection_options` from existing scraper flags (`phlebotomy_included`, `gp_consultation_included`, `home_kit_available`, `clinic_visit_available`) during scrape so downstream UI can show the "+£X" modifiers consistently.

### 4. Re-curate popular pins

- Drop the brittle UUID pin migration approach. After `scrape-popular-tests`, `is_popular` / `popularity_rank` are owned by the scraper. The hardcoded image overrides in `DreamHealthShowcase.tsx` (`providerOverrides`) stay, keyed by cleaned test name, so branded pack images keep matching even if a different row wins the bestseller pick.

## Technical notes

- All scraper edge functions already exist (`medichecks-firecrawl`, `goodbody-scraper`, `randox-scraper`, `thriva-scraper`, `lola-health-scraper`, `scrape-london-lab`, `clinilabs-scraper`, `medical-diagnosis-scraper`, `london-health-scraper`) and run with service-role auth.
- `scrape-popular-tests` already does Firecrawl JSON extraction against `collections/best-sellers` etc. and does fuzzy matching against `provider_tests` rows it just upserted via the provider scrapers — so chaining the order (provider scrape → popular re-rank → sanitise) is what makes prices on the homepage reflect reality.
- New cron uses `pg_cron` + `pg_net` (already enabled) and a service-role-equivalent bearer (`SCRAPER_CRON_SECRET`, must be set in Supabase secrets if not already — will check during build and prompt user if missing).
- DB writes (turning the curated UUID pin migration into a no-op for fresh rows, populating `base_price`/`collection_options` defaults) go via `supabase--migration` per house rules.

## Out of scope

- Visual redesign of the popular-tests cards.
- Adding new providers.
- Changing what's stored in `tests_master` / biomarker library.

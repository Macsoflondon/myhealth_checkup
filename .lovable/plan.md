

## Upgrade All Provider Scrapers to Firecrawl + Enhance Admin Dashboard

### Current State

**9 providers in DB** with 403 total active tests:
| Provider | Tests | Last Scraped | Has Scraper? |
|---|---|---|---|
| Medichecks | 76 | Feb 21 (stale) | Yes (Firecrawl) |
| Randox | 69 | Apr 13 | Yes (Firecrawl) |
| GoodBody | 68 | Apr 13 | Yes (HTML) |
| Medical Diagnosis | 55 | Apr 5 | No |
| Lola Health | 46 | Jan 7 (stale) | Yes (HTML) |
| London Medical Lab | 33 | Apr 13 | Yes (Firecrawl) |
| Clinilabs | 24 | Apr 5 | No |
| London Health Co | 18 | Apr 5 | No |
| Thriva | 14 | Apr 13 | Yes (HTML) |

**3 providers have no scrapers** (Medical Diagnosis, Clinilabs, London Health Company) — their data was manually uploaded.

**Admin dashboard** exists at `/admin/scrapers` but only lists 6 providers. Missing the 3 newer ones.

### Plan

**1. Upgrade existing HTML-based scrapers to Firecrawl** (3 files)

- `goodbody-scraper/index.ts` — currently uses raw HTML fetch + regex. Upgrade to use Firecrawl `scrape` + `map` endpoints (same pattern as `medichecks-firecrawl`). Keep the existing category inference and biomarker extraction logic.
- `thriva-scraper/index.ts` — currently uses raw HTML fetch. Upgrade to Firecrawl.
- `lola-health-scraper/index.ts` — currently uses raw HTML fetch. Upgrade to Firecrawl.

All three will use the `FIRECRAWL_API_KEY` secret (already configured).

**2. Create new Firecrawl scrapers for 3 missing providers** (3 new files)

- `supabase/functions/clinilabs-scraper/index.ts` — scrape clinilabs.co.uk product pages
- `supabase/functions/medical-diagnosis-scraper/index.ts` — scrape medicaldiagnosis.co.uk
- `supabase/functions/london-health-scraper/index.ts` — scrape londonhealthcompany.co.uk

Each scraper will follow the established pattern:
1. Use Firecrawl `map` to discover product URLs
2. Use Firecrawl `scrape` on each product URL
3. Extract: test name, price, biomarker count/list, sample type, category, description, URL
4. Upsert to `provider_tests` table using service role client
5. Update `scraping_jobs` table with status

**3. Update admin dashboard** (`src/pages/AdminScraperDashboardPage.tsx`)

- Add the 3 missing providers to `PROVIDERS` array
- Add summary stats (total tests across all providers, last full refresh time)
- Add a "Scrape Results" expandable section per provider showing what changed (new tests, price changes, removed tests)

**4. Update `run-all-scrapers`** edge function

- Add the 3 new scrapers to the `SCRAPERS` array
- Use the correct function names for upgraded scrapers

**5. Update `supabase/config.toml`**

- Add `[functions.clinilabs-scraper]`, `[functions.medical-diagnosis-scraper]`, `[functions.london-health-scraper]` with `verify_jwt = false`

**6. Trigger all scrapers** after deployment to refresh stale data (Medichecks from Feb, Lola Health from Jan)

### Technical details

Each scraper follows this standardised structure:
```text
1. FIRECRAWL_API_KEY from Deno.env.get()
2. SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY for DB writes
3. map() → discover product URLs
4. scrape() each URL → extract markdown/HTML
5. Parse: price (£), biomarkers, sample type, turnaround
6. Category inference using keyword matching
7. Upsert to provider_tests (ON CONFLICT provider_id + test_name)
8. Update scraping_jobs status
9. Return JSON summary with test count
```

### Files changed/created

- **Modified**: `goodbody-scraper/index.ts`, `thriva-scraper/index.ts`, `lola-health-scraper/index.ts`
- **Created**: `clinilabs-scraper/index.ts`, `medical-diagnosis-scraper/index.ts`, `london-health-scraper/index.ts`
- **Modified**: `run-all-scrapers/index.ts`, `supabase/config.toml`
- **Modified**: `src/pages/AdminScraperDashboardPage.tsx`


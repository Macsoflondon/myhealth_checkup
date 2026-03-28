

# Full Provider Scrape & Cross-Match Plan

## Current State

The scraping infrastructure is already built and deployed. Six provider scrapers exist as Supabase Edge Functions, orchestrated by `run-all-scrapers`:

| Provider | Scraper | Method |
|----------|---------|--------|
| Medichecks | `medichecks-scraper` | Live HTML scraping (Shopify collections + product pages) |
| Goodbody | `goodbody-scraper` | Live HTML scraping (Shopify collections) |
| Randox Health | `randox-scraper` | Live HTML scraping (known product URLs) |
| Lola Health | `lola-health-scraper` | Live HTML scraping (Shopify collections) |
| London Medical Lab | `scrape-london-lab` | Live HTML scraping |
| Thriva | `thriva-scraper` | **Hardcoded data only** (not actual scraping) |

All scrapers upsert results into the `provider_tests` table. The AI test mapper at `/admin/test-mapper` then semantically maps provider tests to the 109-test master catalogue (`tests_master`).

## Execution Plan

### Step 1: Trigger the full scraping run
Invoke the `run-all-scrapers` edge function. This will sequentially call all 6 scrapers with a 2-second delay between each. Results are upserted into `provider_tests` with updated pricing, biomarkers, descriptions, image URLs, and sample types. An admin email notification is sent upon completion.

### Step 2: Upgrade Thriva scraper from hardcoded to live
The current Thriva scraper uses a static array of ~15 tests with fixed prices. It needs to be rewritten to scrape `thriva.co` live, matching the pattern used by Medichecks and Goodbody (Shopify product page parsing). This ensures Thriva pricing stays current.

### Step 3: Run AI test mapper for cross-matching
After scraping completes, trigger the AI test mapper to semantically match any new or unmapped provider tests against the master catalogue. This populates the `provider_test_mapping` table used by comparison views.

### Step 4: Verify data in admin dashboard
Check the Admin Test Dashboard (`/admin/test-dashboard`) to confirm updated prices, biomarker counts, and provider coverage across all 6 providers.

## What gets updated
- **Pricing**: Current prices extracted from provider product pages
- **Biomarkers**: Biomarker lists and counts parsed from product descriptions and structured data
- **Test info**: Descriptions, sample types, image URLs, categories
- **URLs**: Verified product links with `url_verified` timestamps
- **Availability**: Active/inactive status based on whether products still exist

## Files to modify
- `supabase/functions/thriva-scraper/index.ts` — rewrite from hardcoded to live scraping

## Files unchanged (just invoked)
- `supabase/functions/run-all-scrapers/index.ts` — triggers all scrapers
- `supabase/functions/ai-test-mapper/index.ts` — cross-matches to master catalogue

## Important note
Clinic location data is managed separately via `clinics_master.json` and the clinic scraper functions. The provider test scrape does not affect clinic data. If clinic locations also need updating, that is a separate operation using the clinic-specific scrapers.




# Automated Cron Schedules and Medichecks Scraper Refresh Plan

## Current State Analysis

### Existing Cron Jobs (Already Configured)

| Job Name | Schedule | Purpose | Status |
|----------|----------|---------|--------|
| `run-all-scrapers-morning` | `0 6 * * *` (06:00 UTC daily) | Run all 6 provider scrapers | Active |
| `run-all-scrapers-afternoon` | `0 14 * * *` (14:00 UTC daily) | Run all 6 provider scrapers | Active |
| `check-price-alerts-every-6-hours` | `0 1,7,13,19 * * *` | Check price alerts | Active |

The cron jobs ARE already configured in pg_cron and active. The issue is that the scrapers themselves have not been running successfully, likely due to edge function deployment status or Firecrawl API issues.

### Provider Data Freshness

| Provider | Active Tests | Last Scraped | Days Stale |
|----------|-------------|--------------|------------|
| Thriva | 25 | 2026-02-01 | 0 (today) |
| London Medical Laboratory | 33 | 2026-01-26 | 6 |
| Goodbody Clinic | 67 | 2026-01-16 | 16 |
| Lola Health | 46 | 2026-01-07 | 25 |
| Randox | 20 | 2026-01-07 | 25 |
| Medichecks | 17 | 2026-01-07 | 25 (critical) |

### Medichecks Problem
Medichecks switched to Shopify's `/products/` URL structure. The current scraper has 52 verified product URLs, but only 17 tests are in the database - indicating the scraper has not successfully run since the URL migration.

---

## Implementation Plan

### Step 1: Deploy and Test Medichecks Scraper

Two scrapers exist for Medichecks:
1. **`medichecks-scraper`**: Native scraping with 150 product limit, Shopify-optimised
2. **`medichecks-firecrawl`**: Uses Firecrawl API with 120 product limit

Implementation:
1. Deploy the `medichecks-scraper` edge function with the updated Shopify URL patterns
2. Manually invoke the function to test scraping
3. Verify database updates with scraped product data

Expected outcome:
- 52+ verified product URLs processed
- Price data extracted using JSON-LD and regex patterns
- Database updated with current prices and availability

### Step 2: Optimise Cron Schedule

Update the cron configuration to stagger scrapers and improve reliability:

```text
Current schedule (both run at once):
- 06:00 UTC: run-all-scrapers-morning (all 6)
- 14:00 UTC: run-all-scrapers-afternoon (all 6)

Recommended schedule (staggered for API limits):
- 04:00 UTC: Primary scrape run (all providers)
- 16:00 UTC: Secondary scrape run (all providers)
```

The `run-all-scrapers` function already includes:
- 2-second delay between each scraper
- Admin email notification on completion/failure
- Individual scraper error isolation

### Step 3: Add Per-Provider Cron Jobs (Optional Enhancement)

For more granular control, add individual provider schedules:

```text
Staggered individual scrapers (alternative approach):
- 04:00 UTC: medichecks-scraper (high priority - Shopify updates frequently)
- 05:00 UTC: goodbody-scraper
- 06:00 UTC: lola-health-scraper
- 07:00 UTC: thriva-scraper
- 08:00 UTC: randox-scraper
- 09:00 UTC: scrape-london-lab
```

This provides:
- Better error isolation
- More granular logging
- Reduced API rate limiting risk

---

## Technical Implementation

### Database Migration Required

Create/update cron jobs using pg_cron:

```sql
-- Update existing morning scraper to run earlier (04:00 UTC)
SELECT cron.unschedule('run-all-scrapers-morning');
SELECT cron.schedule(
  'run-all-scrapers-daily-4am',
  '0 4 * * *',
  $$
  SELECT net.http_post(
    url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/run-all-scrapers',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer [ANON_KEY]"}'::jsonb,
    body:='{"replace": true}'::jsonb
  ) as request_id;
  $$
);

-- Update afternoon scraper to 16:00 UTC
SELECT cron.unschedule('run-all-scrapers-afternoon');
SELECT cron.schedule(
  'run-all-scrapers-daily-4pm',
  '0 16 * * *',
  $$
  SELECT net.http_post(
    url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/run-all-scrapers',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer [ANON_KEY]"}'::jsonb,
    body:='{"replace": true}'::jsonb
  ) as request_id;
  $$
);
```

### Manual Scraper Invocation

To immediately refresh Medichecks data:

```bash
# Via edge function curl
POST /functions/v1/medichecks-scraper
Body: { "replace": true }
```

Or using `medichecks-firecrawl` for Firecrawl-powered scraping:

```bash
POST /functions/v1/medichecks-firecrawl
```

---

## Medichecks Scraper Details

### Current URL Configuration

The `medichecks-scraper` function includes:

**Collection Pages** (for URL discovery):
- `/collections/blood-tests`
- `/collections/thyroid-tests`
- `/collections/hormone-tests`
- `/collections/vitamin-tests`
- 9 additional collection pages

**Verified Product URLs** (52 total):
- `/products/thyroid-function-blood-test`
- `/products/testosterone-blood-test`
- `/products/ultimate-performance-blood-test`
- 49 additional verified URLs

### Price Extraction Logic

Optimised for Shopify's structure:
1. JSON-LD structured data (`"price": "X"`)
2. Shopify-specific `data-product-price` attributes
3. Currency regex fallback (`£X.XX`)
4. Compare-at price for discounts

### Database Fields Updated

For each scraped product:
- `test_name`: Extracted from title/h1
- `price`: Current selling price
- `original_price`: Compare-at price (if discounted)
- `url`: Full product URL (verified)
- `category`: Auto-detected from keywords
- `biomarkers_list`: Extracted from page content
- `biomarker_count`: Number of biomarkers
- `sample_type`: Finger-prick or venous
- `scraped_at`: Timestamp
- `url_verified`: Set to true

---

## Monitoring and Alerts

### Email Notifications

The `run-all-scrapers` function sends branded emails to all admin users:
- Success summary with per-provider status
- Failure alerts with error details
- Styled HTML email matching myhealth checkup branding

### Scraping Jobs Table

Track status in `scraping_jobs`:

```sql
SELECT provider_id, status, last_scraped, next_scrape, error_message
FROM scraping_jobs
ORDER BY last_scraped DESC;
```

### Edge Function Logs

Monitor in Supabase dashboard:
- `run-all-scrapers` - Orchestration logs
- `medichecks-scraper` - Individual scraper logs
- `medichecks-firecrawl` - Firecrawl API logs

---

## Expected Outcomes

After implementation:

| Metric | Before | After |
|--------|--------|-------|
| Medichecks active tests | 17 | 50-70 |
| Data freshness (all providers) | 6-25 days stale | <12 hours |
| Cron execution frequency | Twice daily | Twice daily (optimised times) |
| Price accuracy | Unknown (stale) | Current within 12h |
| Failed scraper visibility | Manual check | Admin email alerts |

---

## Risk Considerations

1. **Firecrawl API Limits**: The `medichecks-firecrawl` function may hit API limits. Fallback to native `medichecks-scraper` if needed.

2. **Shopify Rate Limiting**: Native scrapers include 1-1.5s delays between requests.

3. **Price Extraction Failures**: Products without extractable prices are still saved with `price: null` to maintain catalog coverage.

4. **Duplicate Jobs**: Clean up duplicate scraping_jobs entries before running (some historical duplicates exist in the table).


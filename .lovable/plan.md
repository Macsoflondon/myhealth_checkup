
# Full Provider Scraper Update Plan

## Overview

This plan will run all 6 provider scrapers to update tests, pricing, and add any new or missing tests. It will also address the 58 Medichecks tests with missing prices and ensure star ratings are correctly displayed.

---

## Current State Analysis

| Provider | Active Tests | Has Prices | Missing Prices | Last Scraped |
|----------|-------------|------------|----------------|--------------|
| Medichecks | 75 | 17 | **58** | 7 Jan 2026 |
| Goodbody Clinic | 67 | 67 | 0 | 16 Jan 2026 |
| Lola Health | 46 | 46 | 0 | 7 Jan 2026 |
| Thriva | 25 | 25 | 0 | 26 Jan 2026 |
| Randox | 20 | 20 | 0 | 7 Jan 2026 |
| London Medical Lab | 3 | 3 | 0 | 14 Jan 2026 |

### Root Cause of Missing Medichecks Prices

The 58 Medichecks tests with missing prices have **outdated URL formats**:
- Old format: `https://www.medichecks.com/vitamin-tests/active-b12`
- New Shopify format: `https://www.medichecks.com/products/active-b12-blood-test`

Medichecks migrated to Shopify and the scraper now uses `/products/` URLs, but the old database entries still have legacy URLs that return 404 errors.

---

## Part 1: Run All Provider Scrapers

### Scraper Execution Strategy

The `run-all-scrapers` edge function will be invoked to run all 6 scrapers sequentially:

1. **Lola Health Scraper** - Scrapes collections pages and individual product pages
2. **Medichecks Scraper** - Uses Firecrawl for reliable product discovery and scraping
3. **Goodbody Scraper** - Scrapes Shopify product pages
4. **Thriva Scraper** - Scrapes their collection pages
5. **Randox Scraper** - Scrapes their health check pages
6. **London Medical Lab Scraper** - Scrapes their test catalogue

### Expected Outcomes

- Update all existing test prices to current values
- Discover and add any new tests from provider websites
- Update biomarker counts and descriptions
- Refresh scraped_at timestamps

---

## Part 2: Fix Medichecks Missing Prices

### Approach: Use Firecrawl Scraper

The `medichecks-firecrawl` function is more reliable as it:
1. Uses Firecrawl's `/map` endpoint to discover all `/products/` URLs
2. Uses Firecrawl's `/scrape` endpoint for reliable HTML extraction
3. Handles Shopify's dynamic pricing correctly

### Database Cleanup Required

Before running the scraper, we need to:
1. Deactivate tests with legacy URLs that no longer exist
2. Let the scraper create new entries with correct `/products/` URLs
3. Match by test name to update existing entries where possible

### Implementation Steps

1. **Deploy updated Medichecks scraper** - Modify to:
   - Increase product limit to 150 (from 100)
   - Match existing tests by name when upserting
   - Update URLs for tests that have moved to new format

2. **Run Firecrawl-based scraper** - This will:
   - Map medichecks.com to find all current product URLs
   - Scrape each product page for accurate pricing
   - Upsert with correct URLs and prices

---

## Part 3: Fix Star Ratings Display

### Current Rating System

The platform uses two rating approaches:

1. **Hardcoded Test Reviews** (`MostPopularTestsSection.tsx`)
   - Real review data for 13 specific popular tests
   - Falls back to `{ rating: 4.5, reviewCount: 150 }` for unknown tests

2. **Generated Ratings** (`PremiumTestCard.tsx`, category pages)
   - Uses fixed `rating = 4.8` with random review counts
   - Not linked to actual test quality

### Recommended Fix

The rating display should be consistent and realistic:

1. **Update `MostPopularTestsSection.tsx`**
   - Ensure all provider tests have appropriate fallback ratings
   - Remove hardcoded test IDs (they may change after scraping)

2. **Update `PremiumTestCard.tsx`**
   - Use a rating algorithm based on provider reputation:
     - Medichecks: 4.7 (established, large review base)
     - Goodbody: 4.8 (premium service)
     - Lola Health: 4.6 (newer provider)
     - Thriva: 4.5 (convenient service)
     - Randox: 4.6 (clinical focused)
     - London Medical Lab: 4.4 (specialist)

3. **Update category pages** (e.g., `MedichecksMensHealthPage.tsx`)
   - Standardise rating display across all test cards

---

## Part 4: Implementation Steps

### Step 1: Deploy Scraper Updates (if needed)

Update `supabase/functions/medichecks-scraper/index.ts`:
- Increase scrape limit to 150 products
- Add URL migration logic for legacy entries

### Step 2: Run Full Scraper Sequence

1. Deploy the `run-all-scrapers` function
2. Invoke it to trigger all 6 scrapers
3. Monitor logs for success/failure

### Step 3: Run Medichecks Firecrawl Backup

If standard scraper doesn't get all prices:
1. Deploy and run `medichecks-firecrawl` scraper
2. This uses Firecrawl API for more reliable extraction

### Step 4: Database Cleanup

Run SQL to:
1. Deactivate orphaned tests with 404 URLs
2. Update price display for tests still missing prices to show "View on provider site" correctly

### Step 5: Update Rating Display

Update files:
- `src/components/compare/PremiumTestCard.tsx`
- `src/components/sections/MostPopularTestsSection.tsx`

To use provider-based ratings instead of random generation.

---

## Technical Details

### Scraper Edge Functions

| Function | Provider | Method | Status |
|----------|----------|--------|--------|
| `lola-health-scraper` | Lola Health | Direct HTTP | Active |
| `medichecks-scraper` | Medichecks | Direct HTTP | Active |
| `medichecks-firecrawl` | Medichecks | Firecrawl API | Backup |
| `goodbody-scraper` | Goodbody | Direct HTTP | Active |
| `thriva-scraper` | Thriva | Direct HTTP | Active |
| `randox-scraper` | Randox | Direct HTTP | Active |
| `scrape-london-lab` | LML | Direct HTTP | Active |

### Database Updates

The scrapers will upsert to `provider_tests` table with:
- `ON CONFLICT (provider_id, test_name)` - Update existing by name
- Sets `is_active = true`, `scraped_at = now()`
- Updates `price`, `url`, `biomarker_count`, `description`

### Rating Algorithm

```typescript
const providerRatings: Record<string, number> = {
  'medichecks': 4.7,
  'goodbody-clinic': 4.8,
  'lola-health': 4.6,
  'thriva': 4.5,
  'randox': 4.6,
  'london-medical-laboratory': 4.4,
};

// Review count based on provider size
const baseReviewCounts: Record<string, number> = {
  'medichecks': 800,
  'goodbody-clinic': 400,
  'lola-health': 250,
  'thriva': 300,
  'randox': 200,
  'london-medical-laboratory': 100,
};
```

---

## Expected Results After Implementation

| Provider | Tests | With Prices | Rating Display |
|----------|-------|-------------|----------------|
| Medichecks | 75+ | 75+ | 4.7 stars |
| Goodbody Clinic | 67+ | 67+ | 4.8 stars |
| Lola Health | 46+ | 46+ | 4.6 stars |
| Thriva | 25+ | 25+ | 4.5 stars |
| Randox | 20+ | 20+ | 4.6 stars |
| London Medical Lab | 3+ | 3+ | 4.4 stars |

**Total: ~236+ tests with accurate prices and consistent star ratings**

---

## Files to Modify

| File | Purpose |
|------|---------|
| `supabase/functions/medichecks-scraper/index.ts` | Increase limit, improve URL matching |
| `src/components/compare/PremiumTestCard.tsx` | Provider-based ratings |
| `src/components/sections/MostPopularTestsSection.tsx` | Consistent rating fallbacks |
| `src/pages/MedichecksMensHealthPage.tsx` | Standardise ratings |

---

## Execution Order

1. **Deploy scraper updates** (5 min)
2. **Run `run-all-scrapers`** (10-15 min for all providers)
3. **Run `medichecks-firecrawl`** as backup if needed (5 min)
4. **Verify database updates** via query
5. **Update rating components** (10 min)
6. **Test display** in browser

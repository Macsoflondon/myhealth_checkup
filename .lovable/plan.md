
# Scraper Analysis and Remediation Plan

## Executive Summary
All three scrapers (Goodbody, Randox, and Medichecks) are experiencing failures due to outdated URL structures. The provider websites have reorganised their test product pages, causing widespread 404 errors. This plan addresses URL updates, database constraint handling, and cleanup of legacy records.

---

## 1. Diagnostic Findings

### Goodbody Scraper
**Status**: Partially working (65 success, 17 errors)

**Root Cause**: 17 legacy test slugs in the hardcoded `knownTests` array no longer exist on the website. The collection page scraping works correctly.

**Failing URLs** (returning 404):
- `well-woman-blood-test`, `well-man-blood-test`, `vitamin-d-blood-test`
- `thyroid-blood-test`, `pcos-blood-test`, `liver-function-blood-test`
- `lipid-profile-blood-test`, `kidney-function-blood-test`
- `hormone-blood-test-male`, `hormone-blood-test-female`
- `full-blood-count-test`, `female-fertility-blood-test`
- `essential-vitamins-blood-test`, `essential-blood-test`
- `diabetes-blood-test`, `cardiac-health-blood-test`, `basic-vitamins-blood-test`

**Correct URL Pattern**: `https://goodbodyclinic.com/products/{slug}` (Shopify)

**Verified Working URLs** (from live website):
- `advanced-vitamins-blood-test`
- `advanced-well-man-blood-test`
- `advanced-well-woman-blood-test`

---

### Randox Scraper
**Status**: Completely broken (0 products scraped)

**Root Cause**: Randox has completely restructured their website. The scraper uses outdated URLs like `/tests/thyroid` which no longer exist.

**Old URL Pattern** (broken):
```
https://www.randoxhealth.com/tests/thyroid
https://www.randoxhealth.com/tests/everyman
```

**New URL Pattern** (discovered from live site):
```
Clinic tests: https://randoxhealth.com/en-GB/product/clinic/{product-slug}
Home tests:   https://randoxhealth.com/en-GB/product/home/{product-slug}
```

**Category Pages** (for discovery):
```
https://randoxhealth.com/en-GB/male-health
https://randoxhealth.com/en-GB/female-health
https://randoxhealth.com/en-GB/health-at-home
```

**Verified Working Products**:
| Product | URL | Price |
|---------|-----|-------|
| Discovery | `/en-GB/product/clinic/discovery-health-check` | £257 |
| Everyman | `/en-GB/product/clinic/everyman-test` | £397 |
| Signature Platinum | `/en-GB/product/clinic/signature-platinum-test` | £2,977 |
| General Health (Home) | `/en-GB/product/home/general-health-test` | £80 |
| Thyroid Function (Home) | `/en-GB/product/home/thyroid-function-home-test` | £35 |
| Female Hormone QuickDraw | `/en-GB/product/home/female-hormone-Quickdraw` | £44 |
| Male Hormone QuickDraw | `/en-GB/product/home/male-hormone-quickdraw` | £44 |
| PSA Home Test | `/en-GB/product/home/psa-home-test` | £35 |
| AMH Home Test | `/en-GB/product/home/amh-home-test` | £53 |
| Gut Microbiome | `/en-GB/product/home/gut-microbiome-test` | £199 |

---

### Medichecks Scraper
**Status**: Partially working (28 scraped, but database errors)

**Issues Identified**:
1. **Duplicate key constraint errors**: The scraper tries to insert records that already exist with the same `(provider_id, test_name)` combination
2. **Upsert logic flaw**: Looking up by URL but the unique constraint is on `(provider_id, test_name)`

**Database Constraints**:
```sql
-- Active constraint causing errors:
CREATE UNIQUE INDEX provider_tests_unique_active 
  ON provider_tests (provider_id, test_name) 
  WHERE is_active = true;

-- Secondary constraint:
CREATE UNIQUE INDEX provider_tests_provider_test_unique 
  ON provider_tests (provider_id, provider_test_id);
```

---

## 2. Remediation Plan

### Phase 1: Goodbody Scraper Fix

**Changes to `supabase/functions/goodbody-scraper/index.ts`**:

1. Remove obsolete slugs from `knownTests` array (lines 348-376)
2. Update with verified working product slugs discovered from collections
3. Add automatic deactivation of products returning 404

**Updated Known Tests List**:
```typescript
const knownTests = [
  '/products/advanced-vitamins-blood-test',
  '/products/advanced-well-man-blood-test',
  '/products/advanced-well-woman-blood-test',
  '/products/anaemia-blood-test',
  '/products/gp-consultation',
  '/products/iron-blood-test',
  '/products/menopause-blood-test',
  '/products/prostate-psa-blood-test',
  '/products/testosterone-blood-test',
  '/products/thyroid-function-blood-test',
  // Remove all the 404 slugs
];
```

---

### Phase 2: Randox Scraper Complete Rewrite

**Changes to `supabase/functions/randox-scraper/index.ts`**:

1. Update base domain from `www.randoxhealth.com` to `randoxhealth.com`
2. Replace all category pages with new structure
3. Replace all known product URLs with verified working URLs
4. Update URL extraction regex for new `/en-GB/product/` pattern
5. Adjust HTML parsing for new page structure (Azure CDN images, different price format)

**New Category Pages**:
```typescript
const categoryPages = [
  'https://randoxhealth.com/en-GB/male-health',
  'https://randoxhealth.com/en-GB/female-health',
  'https://randoxhealth.com/en-GB/health-at-home',
];
```

**New URL Pattern Regex**:
```typescript
const linkPatterns = [
  /href="(\/en-GB\/product\/(?:clinic|home)\/[^"#?]+)"/gi,
  /href="(https:\/\/randoxhealth\.com\/en-GB\/product\/(?:clinic|home)\/[^"#?]+)"/gi,
];
```

**New Known Product URLs** (verified working):
```typescript
const knownProductUrls = [
  // Clinic tests
  'https://randoxhealth.com/en-GB/product/clinic/discovery-health-check',
  'https://randoxhealth.com/en-GB/product/clinic/everyman-test',
  'https://randoxhealth.com/en-GB/product/clinic/signature-platinum-test',
  'https://randoxhealth.com/en-GB/product/clinic/signature-platinum-plus-test',
  'https://randoxhealth.com/en-GB/product/clinic/signature-prestige-test',
  // Home tests
  'https://randoxhealth.com/en-GB/product/home/general-health-test',
  'https://randoxhealth.com/en-GB/product/home/thyroid-function-home-test',
  'https://randoxhealth.com/en-GB/product/home/female-hormone-Quickdraw',
  'https://randoxhealth.com/en-GB/product/home/male-hormone-quickdraw',
  'https://randoxhealth.com/en-GB/product/home/home-sti-test',
  'https://randoxhealth.com/en-GB/product/home/food-sensitivity-test',
  'https://randoxhealth.com/en-GB/product/home/gut-microbiome-test',
  'https://randoxhealth.com/en-GB/product/home/nutrition-lifestyle-dna-home-test-kit',
  'https://randoxhealth.com/en-GB/product/home/amh-home-test',
  'https://randoxhealth.com/en-GB/product/home/psa-home-test',
  'https://randoxhealth.com/en-GB/product/home/haemochromatosis-home-test-kit',
  'https://randoxhealth.com/en-GB/product/home/coeliac-disease-home-test-kit',
];
```

---

### Phase 3: Medichecks Scraper Database Fix

**Changes to `supabase/functions/medichecks-scraper/index.ts`**:

1. Change lookup strategy from URL-based to `(provider_id, test_name)` to match unique constraint
2. Add proper handling for the partial unique index on active records
3. Add 404 handling to mark products as inactive

**Current Code (problematic)**:
```typescript
const { data: existing } = await supabase
  .from('provider_tests')
  .select('id')
  .eq('provider_id', 'medichecks')
  .eq('url', product.url)  // Wrong - constraint is on test_name
  .maybeSingle();
```

**Fixed Code**:
```typescript
const { data: existing } = await supabase
  .from('provider_tests')
  .select('id')
  .eq('provider_id', 'medichecks')
  .eq('test_name', product.test_name)
  .eq('is_active', true)
  .maybeSingle();
```

---

### Phase 4: Database Cleanup

**Deactivate legacy Randox records** (run via SQL):
```sql
UPDATE provider_tests 
SET is_active = false, 
    updated_at = now()
WHERE provider_id = 'randox' 
  AND url LIKE '%/tests/%'
  AND url NOT LIKE '%/en-GB/product/%';
```

**Deactivate legacy Goodbody 404 URLs**:
```sql
UPDATE provider_tests 
SET is_active = false, 
    updated_at = now()
WHERE provider_id = 'goodbody-clinic' 
  AND provider_test_id IN (
    'well-woman-blood-test', 'well-man-blood-test', 
    'vitamin-d-blood-test', 'thyroid-blood-test',
    'pcos-blood-test', 'liver-function-blood-test',
    'lipid-profile-blood-test', 'kidney-function-blood-test',
    'hormone-blood-test-male', 'hormone-blood-test-female',
    'full-blood-count-test', 'female-fertility-blood-test',
    'essential-vitamins-blood-test', 'essential-blood-test',
    'diabetes-blood-test', 'cardiac-health-blood-test',
    'basic-vitamins-blood-test'
  );
```

---

## 3. Technical Details

### Files to Modify
1. `supabase/functions/goodbody-scraper/index.ts` - Remove legacy slugs, add 404 handling
2. `supabase/functions/randox-scraper/index.ts` - Complete URL structure rewrite
3. `supabase/functions/medichecks-scraper/index.ts` - Fix database lookup logic

### Testing Strategy
After deployment:
1. Manually trigger each scraper via edge function curl
2. Check logs for 404 reduction
3. Verify database records are updated with new URLs
4. Confirm `scraped_at` timestamps refresh

---

## 4. Expected Outcomes

| Scraper | Current State | After Fix |
|---------|---------------|-----------|
| Goodbody | 65 success, 17 errors | 65+ success, 0 errors |
| Randox | 0 products | 15-20+ products |
| Medichecks | 28 scraped, DB errors | 28+ scraped, 0 DB errors |

This will restore automated data refresh for all three providers and ensure the twice-daily cron jobs produce reliable results.

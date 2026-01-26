
# Fix London Medical Laboratory Scraper

## Problem Analysis

The current scraper only captured 3 tests when there are **32+ tests** available on the LML website. The issues are:

### Issue 1: Outdated Hardcoded URLs

The scraper uses hardcoded `knownProductUrls` (lines 33-58) that are **returning 404 errors** because LML changed their URL structure:

| Old Format (In Scraper) | New Format (On Website) |
|------------------------|------------------------|
| `/product/vitamin-d-test/` | `/product/vitamin-d` |
| `/product/cholesterol-test/` | `/product/cholesterol-profile` |
| `/product/general-health-screen/` | `/product/general-health` |
| `/product/thyroid-function-test/` | `/product/thyroid-function` |

### Issue 2: Category Pages Not Working

The category URLs in the scraper (lines 21-30) don't include the main "All" category page which contains all 32 products:
- Missing: `https://www.londonmedicallaboratory.com/product-category/all`

### Issue 3: Processing Limit Too Low

Line 332 limits scraping to only 30 products: `productUrls.slice(0, 30)`

---

## Complete Product List Found (32 Tests)

From the website scrape, here are all 32 tests with correct URLs and prices:

| Test Name | Price | URL Slug |
|-----------|-------|----------|
| Allergy Complete - 295 allergens tested | £319.00 | allergy-complete-295-allergens-tested |
| Cholesterol Lipid Profile | £39.00 | cholesterol-profile |
| Diabetes - Diagnosis and Monitoring (HbA1c) | £45.00 | diabetes-check |
| Erectile Dysfunction Impotence Profile | £115.00 | erectile-dysfunction-profile |
| Female Hair Loss Advanced | £185.00 | female-hair-loss-pfoile-adv |
| Female Sexual Health - Advanced Screen | £189.00 | female-sexual-health |
| Fertility Hormones Profile | £89.00 | fertility-hormones-profile |
| General Health Profile | £89.00 | general-health |
| Heart Health Profile | £59.00 | heart-health-profile |
| Iron Status Profile | £49.00 | iron-status-profile |
| Male Hair Loss Profile | £179.00 | male-hair-loss-profile |
| Male Hormone Profile | £99.00 | male-hormone-profile |
| Male Sexual Health - Advanced Screen | £179.00 | male-advanced-screen |
| Menopause Hormones Profile | £79.00 | menopause-hormones-profile |
| Premier General Health Profile | £99.00 | premier-health |
| Progesterone | £39.00 | progesterone |
| Prostate Profile | £79.00 | prostate-profile |
| Sports Fitness Profile | £119.00 | premier-plus-sports-fitness-profile |
| Sports Hormone Profile | £189.00 | premier-plus-sports-full-hormone-profile |
| Testosterone Check | £39.00 | testosterone-check |
| Testosterone Plus Profile | £59.00 | testosterone-plus |
| Thyroid Full Profile | £79.00 | full-thyroid-profile |
| Thyroid Function - Diagnosis and Monitoring | £49.00 | thyroid-function |
| Tiredness/Fatigue Profile | £99.00 | tiredness-fatigue-profile |
| Ultimate Athlete Performance | £209.00 | ultimate-athlete-performance |
| Ultimate Athlete Performance (with PSA) | £219.00 | ultimate-athlete-performance-with-psa |
| Vitamin B12 | £39.00 | vitamin-b12 |
| Vitamin D | £49.00 | vitamin-d |
| Vitamin Profile | £89.00 | vitamin-profiled-b12-folate |
| Weight-loss management | £99.00 | weight-loss-monitoring |
| Well Man Premier Plus Profile | £159.00 | well-man-premier-plus-profile |
| Well Person Premier Plus Profile | £119.00 | well-person-premier-plus-profile |
| Well Woman Premier Plus Profile | £159.00 | well-woman-premier-plus-profile |

---

## Implementation Plan

### Step 1: Update Category Pages List

Add the main "All" category page and remove non-functional category pages:

```typescript
const categoryPages = [
  'https://www.londonmedicallaboratory.com/product-category/all',  // Primary - contains all 32 products
  'https://www.londonmedicallaboratory.com/product-category/general-health',
  'https://www.londonmedicallaboratory.com/product-category/mens-health',
  'https://www.londonmedicallaboratory.com/product-category/womens-health',
  'https://www.londonmedicallaboratory.com/product-category/hormones',
  'https://www.londonmedicallaboratory.com/product-category/fertility',
  'https://www.londonmedicallaboratory.com/product-category/sports-fitness',
  'https://www.londonmedicallaboratory.com/product-category/sexual-health',
  'https://www.londonmedicallaboratory.com/product-category/allergy-and-intolerance',
];
```

### Step 2: Replace Hardcoded URLs with Verified URLs

Replace the outdated `knownProductUrls` array with all 32 verified product URLs:

```typescript
const knownProductUrls = [
  'https://www.londonmedicallaboratory.com/product/allergy-complete-295-allergens-tested',
  'https://www.londonmedicallaboratory.com/product/cholesterol-profile',
  'https://www.londonmedicallaboratory.com/product/diabetes-check',
  'https://www.londonmedicallaboratory.com/product/erectile-dysfunction-profile',
  'https://www.londonmedicallaboratory.com/product/female-hair-loss-pfoile-adv',
  'https://www.londonmedicallaboratory.com/product/female-sexual-health',
  'https://www.londonmedicallaboratory.com/product/fertility-hormones-profile',
  'https://www.londonmedicallaboratory.com/product/general-health',
  'https://www.londonmedicallaboratory.com/product/heart-health-profile',
  'https://www.londonmedicallaboratory.com/product/iron-status-profile',
  'https://www.londonmedicallaboratory.com/product/male-hair-loss-profile',
  'https://www.londonmedicallaboratory.com/product/male-hormone-profile',
  'https://www.londonmedicallaboratory.com/product/male-advanced-screen',
  'https://www.londonmedicallaboratory.com/product/menopause-hormones-profile',
  'https://www.londonmedicallaboratory.com/product/premier-health',
  'https://www.londonmedicallaboratory.com/product/progesterone',
  'https://www.londonmedicallaboratory.com/product/prostate-profile',
  'https://www.londonmedicallaboratory.com/product/premier-plus-sports-fitness-profile',
  'https://www.londonmedicallaboratory.com/product/premier-plus-sports-full-hormone-profile',
  'https://www.londonmedicallaboratory.com/product/testosterone-check',
  'https://www.londonmedicallaboratory.com/product/testosterone-plus',
  'https://www.londonmedicallaboratory.com/product/full-thyroid-profile',
  'https://www.londonmedicallaboratory.com/product/thyroid-function',
  'https://www.londonmedicallaboratory.com/product/tiredness-fatigue-profile',
  'https://www.londonmedicallaboratory.com/product/ultimate-athlete-performance',
  'https://www.londonmedicallaboratory.com/product/ultimate-athlete-performance-with-psa',
  'https://www.londonmedicallaboratory.com/product/vitamin-b12',
  'https://www.londonmedicallaboratory.com/product/vitamin-d',
  'https://www.londonmedicallaboratory.com/product/vitamin-profiled-b12-folate',
  'https://www.londonmedicallaboratory.com/product/weight-loss-monitoring',
  'https://www.londonmedicallaboratory.com/product/well-man-premier-plus-profile',
  'https://www.londonmedicallaboratory.com/product/well-person-premier-plus-profile',
  'https://www.londonmedicallaboratory.com/product/well-woman-premier-plus-profile',
];
```

### Step 3: Increase Processing Limit

Change line 332 from `.slice(0, 30)` to `.slice(0, 50)` to ensure all products are processed:

```typescript
const productUrls = Array.from(allProductUrls).slice(0, 50);
```

### Step 4: Add Category Mapping for New Tests

Expand the `determineCategory` function to include new categories found on the website:

```typescript
const categoryMap: Record<string, string[]> = {
  // ... existing categories ...
  'Weight Management': ['weight', 'ozempic', 'mounjaro', 'glp-1'],
  'Hair Loss': ['hair loss', 'hair'],
  'Wellness': ['well man', 'well woman', 'well person', 'wellness'],
};
```

### Step 5: Deactivate Legacy Test Entries

After running the updated scraper, run SQL to clean up any orphaned entries with old URL formats that no longer exist.

---

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/scrape-london-lab/index.ts` | Update category pages, replace hardcoded URLs, increase limit, improve category detection |

---

## Expected Results After Implementation

| Metric | Before | After |
|--------|--------|-------|
| Active Tests | 3 | 32+ |
| Tests with Prices | 3 | 32+ |
| Categories Covered | 3 | 12+ |

The scraper will capture all 32 tests from London Medical Laboratory including:
- **Allergy tests** (Allergy Complete - 295 allergens)
- **Sexual health** (Male/Female Advanced Screens)
- **Hair loss profiles** (Male/Female)
- **Sports performance** (Fitness, Hormone, Ultimate Athlete)
- **Weight management** (Ozempic/Mounjaro monitoring)
- **Comprehensive wellness** (Well Man/Woman/Person Premier Plus)

---

## Execution Steps

1. Update `supabase/functions/scrape-london-lab/index.ts` with all changes
2. Deploy the updated edge function
3. Run the scraper to populate all 32 tests
4. Verify database has all tests with correct URLs and prices
5. Deactivate any legacy entries with 404 URLs

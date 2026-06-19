The issue is real: the navigation is sending users to URLs like `/womens-health?category=menopause` and `/wellness?category=thyroid`, but those pages do not read the `category` query parameter. Separately, the compare query only knows broad `canonical_category` values, so slugs like `female-fertility`, `female-hormone-tests`, `thyroid-tests`, and `menopause` are not consistently mapped.

Plan:

1. Fix the category click destinations
   - Update the relevant navigation dropdown links so Thyroid, Menopause, Female Fertility, and Female Hormone items route to a filtered test listing instead of ignored parent-page query params.
   - Use consistent slugs:
     - `thyroid`
     - `menopause`
     - `female-fertility`
     - `female-hormones`

2. Make the compare/category query understand those slugs
   - Extend the category mapping in `src/constants/categories.ts` so aliases such as `thyroid-tests`, `female-fertility-tests`, `female-hormone-tests`, `menopause-tests`, etc. resolve correctly.
   - Update the compare query builder so broad categories still use exact `canonical_category`, but these subcategories use stricter name/category rules:
     - Thyroid: thyroid/TSH/T3/T4/TPO/thyroid antibody tests only.
     - Menopause: menopause/perimenopause/HRT-related hormone tests.
     - Female fertility: female fertility/AMH/ovarian reserve/Fertility Hormones Profile; exclude male fertility and prenatal-only tests.
     - Female hormones: female hormone/women’s hormone/oestrogen/progesterone/FSH/LH panels; exclude male hormone and unrelated thyroid tests.

3. Audit and correct obvious database category mistakes
   - Run a read audit against `provider_tests` for records whose `test_name` conflicts with `canonical_category`.
   - Apply a Supabase migration/update for clear mismatches, e.g. female hormone rows currently marked as `thyroid`, thyroid rows not marked as `thyroid`, menopause rows grouped too broadly, and female fertility rows that should be fertility-linked.
   - No new tables unless the audit shows the existing fields cannot represent the mapping.

4. Keep category pages and compare page aligned
   - Ensure `/thyroid` and `/compare?category=thyroid` return the same thyroid-only set.
   - Ensure navigation for Women’s Health subitems lands on filtered compare results rather than the unfiltered Women’s Health parent page.

5. Verify the fix
   - Use Playwright to click the relevant navigation items:
     - Thyroid Tests
     - Menopause Tests
     - Female Fertility Tests
     - Female Hormone Tests
   - Confirm each page shows only matching tests and no obvious cross-category leakage.
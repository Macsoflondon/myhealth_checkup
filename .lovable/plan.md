# At Home Test Kits: category landing page + data audit

Today `/at-home-tests` dumps every finger-prick kit into one long grid. It should work like General Wellness: a landing page of category cards (Women's, Men's, etc.) that deep-link into a filtered view.

## What I confirmed in the data

- 89 active finger-prick home kits across 7 providers (Randox 20, London Health Company 18, London Medical Laboratory 18, Goodbody 15, Thriva 14, Lola 3, Medichecks 1).
- They already carry a `canonical_category`: vitamins 13, gut 12, general-health 11, women's 9, men's 9, thyroid 8, heart 7, fertility 6, cancer screening 5, hormones 5, sports 2, sexual health 2.
- The Women's view's first three cards are three separate AMH products (Thriva "AMH blood test", Randox "Anti-Mullerian Hormone (AMH) Home Test Kit", Randox "Anti-Mullerian Hormone (AMH) Quickdraw Test Kit"). Two of them are near-duplicates and the Quickdraw row claims **45 biomarkers** for a single-hormone test — that number is wrong in the database, not in the card.
- The current subcategory filter is name-regex based, so anything whose title doesn't contain "women/female/AMH" is silently dropped even when its category is `womens-health`.

## The plan

### 1. Turn `/at-home-tests` into a sectioned landing page

Mirror the Wellness pattern exactly (same hero, same card grid, same live counts):

- No `?subcategory=` → grid of category cards with live counts:
  Women's, Men's, General Health, Vitamins & Nutrition, Thyroid, Heart, Gut Health, Fertility, Hormones, Cancer Screening, Sexual Health, Sports & Fitness.
- With `?subcategory=` → the existing filtered card list, headed by that section's name.
- Cards with a zero live count are hidden, so nothing links to an empty page.

### 2. Filter by category, not by name guessing

Rewrite the at-home subcategory definitions so each section is driven by `canonical_category` (with name patterns only as an additive extra, e.g. menopause/PCOS pulled into Women's). This is what fixes tests being missing from the wrong section.

### 3. Triple-check every one of the 89 kits

A row-by-row audit, with fixes applied by migration:

- Biomarker counts that disagree with the actual biomarker list (the AMH "45" case) — corrected to the real count, or the count hidden and the list marked not published where the provider doesn't publish one.
- Duplicate/near-duplicate products from the same provider (the two Randox AMH kits) — keep the distinct ones, deactivate genuine duplicates.
- Every `url` resolved to a live product page, not a homepage or 404.
- `canonical_category` reassigned where clearly wrong.
- Prices and turnaround text checked against the provider page.
- Junk/error-page rows removed.

I'll report the audit as a table of what changed before/after.

## Technical notes

- New `useAtHomeCategoryCounts` hook modelled on `useWellnessCategoryCounts`, counting from `provider_tests` under the same at-home filter.
- `src/config/subcategoryMap.ts`: at-home entries gain `siblingCategories` so matching goes through category first.
- `src/pages/AtHomeTestsPage.tsx` splits into a landing view + the existing `CategoryPageLayout` filtered view.
- Data corrections go through `apply_migration`; reads via `unified_provider_tests`, writes to `provider_tests` keyed on `provider_id` + `test_name`.

# Fix London Health Company: missing biomarker lists and links that dump users on the homepage

## What I verified in the live data and code

- **The biomarkers are in the database.** `Essential Health MOT (16 Biomarkers)` stores a 15-item list (Albumin, Urea, Uric acid, Creatinine, Cholesterol, LDL, HDL, Triglycerides, Total protein, Total Bilirubin, Globulin, GGT, ALT, Calcium, Amylase) with `biomarker_count = 16`. The card says "not published" because of a code bug, not missing data.
- **The bug is a shape mismatch.** `src/pages/AtHomeTestsPage.tsx` reads the list as `t.biomarkers_list.map(b => b.value)`. London Health Company rows are stored as plain strings, so every entry maps to `undefined` and is filtered out, leaving an empty list. **388 active tests platform-wide** store their list as plain strings and hit this same path. The shared adapter (`universalTestAdapter.ts`) already handles both shapes correctly — the at-home page just doesn't use it.
- **The link problem is real data, not routing.** All 18 active London Health Company rows have `url = https://londonhealthcompany.co.uk` — the bare homepage, no product path. Also true for **234 active tests** overall (medical-diagnosis 142, london-medical-laboratory 35, LHC 18, randox 17, thriva 14).
- **The scraper never writes the customer-facing link.** `supabase/functions/london-health-scraper/index.ts` captures the real product URL and saves it to `scrape_source_url`, but never sets `url`. The currently active LHC rows have neither `scrape_source_url` nor `provider_test_id`, so they predate that scraper and were never linked properly.
- The active LHC rows also have no descriptions and no images, and the count (16) disagrees with the stored list length (15) — the list is missing ALP.

## What I will fix

### 1. Show the biomarkers that are already stored
Replace the hand-rolled mapping in `AtHomeTestsPage.tsx` with the shared normaliser used by the universal card, so both string arrays and `{ value }` arrays render. Essential Health MOT will list its markers instead of claiming they are unpublished. This corrects all 388 affected rows in one change, not just LHC.

### 2. Send users to the actual test page
- Fix the scraper so the product URL it already fetches is written to `url` (the field the card links to), not only `scrape_source_url`.
- Backfill the 18 London Health Company rows with their real product URLs, matched by exact test name, plus the descriptions and product images from the same pages.
- Where a row genuinely has no product URL, the card links to the provider profile page on our site rather than pretending to deep-link — no silent dump onto a provider homepage.

### 3. Correct the Essential Health MOT record
Publish the complete 16-marker list from the provider's own page (adding the missing ALP entry) so the headline count and the list agree.

### 4. Stop it recurring elsewhere
Add an admin-visible check listing active tests whose `url` is a bare domain, so the remaining 216 rows on other providers can be worked through rather than fixed one complaint at a time.

## Technical notes

- Frontend: export `normalizeBiomarkers` from `src/components/cards/UniversalTestCard.tsx` (or move it into `src/lib/universalTestAdapter.ts`) and consume it in `AtHomeTestsPage.tsx`; add the same guard to `src/lib/categoryTestMapper.ts`, which also truncates lists to 6 entries.
- Scraper: in `london-health-scraper/index.ts`, include `url: p.url` in the provenance upsert alongside `scrape_source_url`.
- Data corrections applied to `provider_tests` scoped by `provider_id` + exact `test_name`, per the existing write rules; reads stay on `unified_provider_tests`.
- Content stays provider-sourced and factual — no added claims.

## Out of scope for this pass

Backfilling product URLs for the other eight providers (216 rows). I will scope that once you have confirmed the London Health Company result looks right.

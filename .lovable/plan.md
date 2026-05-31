## Problem

All 5 London Medical Laboratory tests shown in "Our Partners' Most Popular Tests" have `description = NULL` and `turnaround_days_text = NULL`. The matching Lola Health and Medichecks cards are fully populated, so LML cards render with no body copy.

Affected tests (all `is_popular=true`):
1. Allergy Complete
2. Cholesterol Lipid Profile
3. Diabetes – Diagnosis and Monitoring (HbA1c)
4. Erectile Dysfunction Impotence Profile
5. Female Hair Loss Advanced

Images and prices are already correct in the DB.

## Plan

1. **Extend `supabase/functions/popular-test-website-data/index.ts`**
   - Already extracts `title`, `description`, `image_url`. Add extraction of:
     - `turnaround_days_text` – parse the LML product page for the "Results in X working days" / "Turnaround" block (regex over the structured spec list).
     - `biomarker_count` – read the "Biomarkers tested" number when present (fallback: count list items in the biomarker section).
   - Return these new fields in the response payload.

2. **Update `supabase/functions/scrape-popular-tests/index.ts`**
   - When syncing scraped items back into `provider_tests`, also persist `description`, `turnaround_days_text`, and `biomarker_count` when the scraped value is non-null (never overwrite existing data with null).

3. **One-off backfill for the 5 LML rows**
   - Invoke `popular-test-website-data` for the 5 LML URLs and `UPDATE provider_tests` with the returned `description` + `turnaround_days_text` (+ `biomarker_count` if missing).
   - No schema changes needed — columns already exist.

4. **Frontend (`DreamHealthShowcase.tsx` and any shared popular-test card)**
   - No structural changes. Verify the card already renders `description` and `turnaround_days_text` for LML once populated (it does for Lola/Medichecks). If a provider-specific guard is hiding the description for LML, remove it.

5. **Verification**
   - Re-query `provider_tests` to confirm all 5 LML rows now have non-null `description` and `turnaround_days_text`.
   - Reload `/` and confirm the 5 LML cards now display the same level of detail as Lola Health and Medichecks cards.

## Out of scope

- No image regeneration (images are correct).
- No price changes.
- No changes to which tests are marked popular for LML.
- No new DB columns or migrations.

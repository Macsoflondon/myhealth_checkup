# Fix comparison table accuracy (Lola Health + Goodbody) and drop the Sample Type row

## What's wrong (verified against the live database)

Both rows you compared carry bad stored data, and the table shows a column we don't need.

**Lola Health — Core Health 45** (`£160`, correct)
- `biomarker_count` is stored as **37**; the test contains **45**. The stored biomarker list also holds only 37 entries.
- Turnaround is stored as raw text `"Results in 2 Working Days](https://lolahealth…"` — a scrape has swallowed a markdown link into the field. That corrupted string is why the table shows an odd turnaround. Correct value: **2–3 working days (typical)**.
- Clinical review fields are **empty**, so the row shows a dash. The test does include a clinical review.
- Collection method (venous blood draw) is correct.

**Goodbody Clinic — Advanced Well Man** (`£175`, `49` biomarkers, venous draw — all correct)
- Turnaround is stored as `"3-5 working days"`; correct value is **2–3 working days (typical)**.
- No additional collection fee is recorded. Correct: **optional home phlebotomy, +£20** (the in-clinic price stays £175).

## The fix

### 1. Remove the Sample Type row from comparison tables
Delete the "Sample Type" row from the side-by-side table (`ProviderComparisonTable`) and from the older `EnhancedComparisonTable`, leaving Collection Method as the single collection descriptor. No data is deleted — the column simply stops being displayed.

### 2. Correct the two provider rows (database migration)
Targeted updates keyed on provider + test name:

- Lola Health "Core Health 45": biomarker count → 45, turnaround → 2–3 working days (clean text, corrupted raw string cleared), clinical review → included.
- Goodbody "Advanced Well Man Blood Test": turnaround → 2–3 working days, collection fee → optional home phlebotomy at £20.

The full 45-biomarker list for the Lola test is not in the database (only 37 names are stored). I can set the count to 45 straight away; if you want the missing 8 names listed too, send them or point me at the source page and I'll add them in the same migration.

### 3. Stop the corrupted turnaround pattern recurring
The Lola value shows the scraper is storing raw markdown link syntax. Add a sanitising step where turnaround text is read (`src/lib/resolve-test-fields.ts`) so any `](http…` tail is stripped before display, and flag any other rows with the same corruption so they can be cleaned in one pass.

## Technical notes
- Row edits go to `provider_tests` via a Supabase migration (`provider_id` + `test_name` lookup), never to the read view.
- `collection_fee_type` = `from` / amount `20` renders as "from £20" in the fees cell; `clinical_review_type` = `included` renders as "Included".
- Turnaround display keeps the non-guaranteed wording ("typical").
- Removing the Sample Type row is presentation-only; `sample_type` stays in the schema and in the test detail modal.

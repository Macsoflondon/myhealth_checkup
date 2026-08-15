# Fix the side-by-side comparison showing stale, incomplete test data

## What I verified in the database

The stored data for both rows in your comparison is already correct:

- **Lola Health — Core Health 45**: 45 biomarkers, turnaround "2-3 working days", clinical review **included**, venous draw, £160.
- **Goodbody Clinic — Advanced Well Man**: 49 biomarkers, "2-3 working days", optional home phlebotomy from £20, £175.

So the wrong figures on screen (37 biomarkers, a dash for turnaround, a dash for clinical review) are a front-end problem, not a data problem. Three separate causes:

1. **The comparison selection is cached in the browser.** When you tick a test, the whole test object is saved to local storage and re-used forever. Your selection was saved before the data corrections, so the page keeps rendering the old snapshot (37 biomarkers, no turnaround) even though the database is right. It never re-checks.
2. **The fetch leaves columns behind.** The query that loads tests by ID asks for only a subset of columns — it never requests clinical review, collection fee, or the lab accreditation flags. Those are available in the data source but simply not fetched.
3. **The converter drops the rest.** Even when present, the step that turns a database row into a comparison row doesn't carry clinical review, collection fee, or collection method across. The table reads those fields, finds nothing, and prints a dash. This affects every test in every comparison, not just Lola.

## The fix

### 1. Always refresh comparison rows from the live data
On the results page, re-fetch every selected test by ID on load and replace the stored snapshot with fresh data, keeping the current selection and order. Stored entries become a fast first paint only, never the final truth. Also add a version stamp to the saved selection so any older cached shape is discarded rather than shown.

### 2. Fetch the full column set
Extend the by-ID query (and the equivalent search/category queries feeding comparisons) to include clinical review type and fee, collection fee type and amount, collection method, and the three lab accreditation flags.

### 3. Carry those fields through the converter
Map the new columns onto the comparison record so the table's Clinical Review, Additional Collection Fees, Collection Method and Total Expected Cost rows render real values. Where a value genuinely isn't recorded, keep the dash — no invented defaults.

### 4. Audit pass across comparison surfaces
Check the other comparison views that share this converter (compare list, provider comparison, cancer comparison, test detail) so the same fields display consistently, and confirm the biomarker figure everywhere comes from the stored count rather than the length of a partial name list.

## Expected result for your current URL

| Row | Lola Core Health 45 | Goodbody Advanced Well Man |
| --- | --- | --- |
| Biomarkers | 45 | 49 |
| Turnaround | 2-3 working days (typical) | 2-3 working days (typical) |
| Collection | Venous draw | Venous draw |
| Additional fees | None | From £20 (optional home phlebotomy) |
| Clinical review | Included | Not stated by provider |
| Total expected cost | £160.00 | £175.00 (£195.00 with home visit) |

Note: Goodbody does not currently record a clinical review value, so that cell stays honest rather than guessing. If you confirm the position, I'll correct the stored row in the same pass.

## Technical notes

- Refresh happens through `CompareService.getTestsByIds` in `useCompareUrlSync`, with `compareStore` gaining a schema version key.
- Column additions go in `CompareService` selects and `testQueryBuilder`; field mapping in `TestDataTransformer.transformSingle` plus the `LiveTestRow` interface.
- Reads stay on the `unified_provider_tests` view; no schema change and no writes required for the display fix.
- `sanitiseTurnaroundText` in `resolve-test-fields.ts` stays in the path so scrape artefacts never surface.

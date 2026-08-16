# Biomarker accuracy audit + collapsible biomarker lists

## What's wrong

The Goodbody "Premium Complete" card is not a display bug on its own — the stored data disagrees with itself:

- The header count (`biomarker_count`) says 62, which matches the provider's site.
- The stored list (`biomarkers_list`) holds only 15 entries, and the last one is cut mid-word ("Gamm" — should be "Gamma GT"). The scraper truncated the list.

A database audit across all 1,367 provider tests shows this is systemic:

| Problem | Rows |
| --- | --- |
| List shorter than the stated count (truncated) | 67 |
| List longer than the stated count (count wrong, or page junk scraped in) | 29 |
| No list at all, count present | 230 |

Worst examples: Randox "Everyman Complete" (count 350, list = 1 item), Goodbody "Advanced Well Man" (49 vs 18), Clinilabs "Advanced Female Fertility" (52 vs 11). Several Medichecks rows have website boilerplate stored as biomarkers ("Choosing a selection results in a full page refresh", clinician names) with a bogus count of 1 or 2.

## What will be done

### 1. Data repair (the real fix)

- Build an audit query/report that flags every row where the list length disagrees with the count, the list contains non-biomarker junk, or the final entry looks truncated mid-word.
- Re-scrape the affected tests per provider (Goodbody, Randox, Clinilabs, Medichecks, London Health, Medical Diagnosis) with the biomarker extraction fixed so the full list is captured and no page furniture is stored.
- Add a validation step in the ingest path: reject list entries that are boilerplate, and store `biomarker_count` from the provider's own stated figure — never silently derive one from a partial list.
- Where a provider genuinely does not publish a full list, keep the count and leave the list empty; the UI already says "list not published by this provider".

### 2. Card and modal UI

Apply everywhere biomarkers are listed: `UniversalTestCard` detail modal, `ProviderTestDetailModal`, and `ProviderTestDetailTemplate`.

- Show the first **5** biomarker chips by default.
- Add a "Show N more" / "Show less" toggle beside the heading that expands the rest inline (no layout jump, keyboard accessible, `aria-expanded`).
- Make the heading honest when the stored list is incomplete: "Biomarkers tested — showing 15 of 62 published by the provider", rather than a bare "(15)" that contradicts the header chip. Once the data repair lands, most rows will read simply "62 biomarkers".
- No change to the header chip, price, turnaround or actions.

### 3. Verification

- Re-run the audit query after re-scraping and report the remaining mismatch count.
- Spot-check Goodbody Premium Complete, Advanced Well Man, Randox Everyman Complete and one Medichecks panel against the live provider pages.

## Technical notes

- Audit lives as a SQL view plus an admin report row on the existing admin data pages.
- The 5-chip cap is presentation only; the full list still ships in the DOM behind the toggle so crawlers and structured data keep the complete set.
- Writes target `provider_tests` keyed on `provider_id` + `test_name`; reads stay on `unified_provider_tests`.

## Issues found

### 1. Two close X buttons on the modal
The shadcn `DialogContent` (`src/components/ui/dialog.tsx`, line 45–48) already renders a built-in close X in the top-right. `ProviderTestDetailModal.tsx` (line 115–120) adds a second custom X over the coloured header. That's why two X icons appear.

### 2. Wrong biomarker count on the count pill
The modal renders `{biomarkers.length || test.biomarker_count}`. For Lola Health "Peak Insights 70", the database stores `biomarker_count = 70` but the partial `biomarkers_list` JSON only contains 10 grouped category entries (e.g. "Lipids", "Liver"), so the pill shows **10**. The authoritative number (`biomarker_count`) should win on the pill, with the list section showing whatever named biomarkers we actually have.

Audit of all `is_popular = true` tests where the displayed count is wrong:

| Provider | Test | DB count | List len shown |
|---|---|---|---|
| Lola Health | Peak Insights 70 | 70 | 10 |
| Lola Health | Vital Check 56 | 56 | 9 |
| Lola Health | Female Hormones Clarity 31 | 31 | 11 |
| Lola Health | Male Active Boost 36 | 36 | 7 |
| Lola Health | Male Hormones Clarity 14 | 14 | 11 |
| Lola Health | Thyroid & Hormonal Function | 10 | 7 |
| Lola Health | Urinalysis | 15 | 6 |
| Goodbody | Advanced Well Man (count 7 vs list 161 — count is wrong) | needs fix |
| Goodbody | Advanced Well Woman (count 2 vs list 113 — count is wrong) | needs fix |
| Goodbody | Bowel Cancer FIT (count 100 — incorrect, this is a single-marker test) | needs fix |
| Goodbody | TruCheck™ (count 100 — likely incorrect) | needs verification |
| Randox | Male Hormone QuickDraw / Thyroid / Vitamin D — all stored as 150 (default, wrong) | needs fix |

### 3. Description text is just a category dump
For Lola Health popular tests the `description` column currently contains a category list, e.g. "Peak comprehensive (Lipids incl Apo B, Lp(a), Liver, Kidney, Thyroid, Diabetes, Hormones, Vitamins, Iron, Inflammation)". The biomarker chips below already show those, so the description should explain **what the test is for and who it suits**, not duplicate the list.

## Proposed fix

### A. Code change — `src/components/providers/ProviderTestDetailModal.tsx`
- Delete the custom `<button>` containing the second `<X>` (lines 115–120). Keep the shadcn built-in close button.
- Make it visible on the dark coloured header by overriding the close button styling on `DialogContent` via a className (the shadcn close uses `text-foreground` which is invisible on the brand-coloured header — switch to white via a small CSS tweak, e.g. add `[&>button]:text-white [&>button]:opacity-100 [&>button]:hover:opacity-80` to the `DialogContent` className).
- Change biomarker count badge logic:
  ```ts
  const displayedCount =
    Math.max(test.biomarker_count ?? 0, biomarkers.length);
  ```
  and only render the pill when `displayedCount > 0`. This fixes Peak Insights 70 → shows 70.

### B. Data migration — fix biomarker counts and descriptions
Create one SQL migration that updates `provider_tests` rows for each popular test where the data is wrong. Scope:

- **Lola Health (8 tests):** rewrite `description` with 1–2 sentence plain-English explanation of who the test is for and what it covers (no biomarker list duplication). Keep `biomarker_count` as it is (those numbers are correct — the issue was display).
- **Goodbody (5 tests):** correct `biomarker_count` to the real number for Advanced Well Man, Advanced Well Woman, Premium Complete, Bowel Cancer FIT (set to 1 — single FIT marker), TruCheck (verify against provider site; if uncertain, leave description but null the count rather than show "100"). Tighten description copy where it's just a marketing tagline.
- **Randox (4 tests):** correct `biomarker_count` from the placeholder 150 to the real value per test (Vitamin D = 1, Thyroid Blood Test ≈ 5, Male/Female Hormone QuickDraw — verify on Randox site; default to the parsed list length if uncertain).
- **Medichecks (3 tests):** populate `biomarker_count` from the test name where stated (e.g. Advanced Well Woman = 47 per its own description).

Where the public count cannot be confirmed I will set it to `null` rather than show a misleading number, and the modal will simply omit the pill.

I will compile the new descriptions and counts in a single migration, then run it. The new copy will be British English, professional, no diagnoses or marketing hype, in line with the project memory rules.

## Out of scope

- Repopulating full `biomarkers_list` arrays for Lola Health tests (e.g. listing all 70 biomarkers for Peak Insights 70). That requires a re-scrape from Lola Health and is a separate task. The pill will show the correct total; the chips will continue to show whatever named biomarkers we have today.
- Touching non-popular tests in the catalogue.

## Open question

Should I:
- (a) Write the new descriptions and corrected counts myself based on each provider's public test page (I will look them up and use the official figures), or
- (b) Wait for you to supply the exact descriptions/counts for the popular tests?

I will proceed with (a) by default unless you say otherwise.

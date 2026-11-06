# Verification: fix brief of 3 November 2026

Branch fix/lovable-review-2026-11-03 at e321fd4, reviewed on 6 November 2026 against origin/main (2d428d8) with `git diff origin/main HEAD`. Independent review: the reviewer did not write this code.

## Global checks

- `npx tsc --noEmit -p .`: exit 0.
- `npx vitest run`: 121 files, 1352 tests, all passed.
- `npx eslint --quiet` on the 60 changed .ts/.tsx files: 2 errors, both prettier, both on lines Lovable added on main (commit 2e32af09, 6 Nov) in files this branch also touches: src/components/sections/DecisionInfrastructureSection.tsx:20 and src/components/sections/TestCategoriesSection.tsx:88.
- `npm ci --ignore-scripts --no-audit --fund=false` (in a clean copy of package.json and package-lock.json): exit 0, 809 packages. `node scripts/check-lockfile-stale-copies.mjs`: passes.
- Merge e321fd4: every line main added since the merge base 251ab77 is still present in HEAD, except lines the branch deliberately replaced (reformatting, the SHORT_NAMES labels, the hero video gate, CardTitle to h3) and the five biomarkersChunk*.ts files, which main edited but nothing imports on main or HEAD. Nothing renders twice: each page tested has exactly one category row.
- No em dashes in user-facing copy added by the branch. Added copy uses British spelling ("recognised", "haemoglobin", "anaemia").

## Results per point

### 0. Lockfile: PASS
npm ci succeeds; stale-copy check passes.

### 1. Biomarker card counts match /compare: PASS
Card and page share one function (`CompareService.getBiomarkerTestRows`, src/services/CompareService.ts:255) built on `TestQueryBuilder.buildBiomarkerQuery` (src/services/queryBuilders/testQueryBuilder.ts:121). `processCompareTests` adds no filtering with default filters.

SQL (service role) and the same query through PostgREST with the anon key gave identical per-provider counts. In the browser (dev server, 1280px) every provider link on the card was opened and the "N tests found" figure read:

| Biomarker | Card counts per provider (all equal to the page) | Compare all |
|---|---|---|
| Ferritin | Medichecks 38, Clinilabs 14, Lola 9, Goodbody 7, LML 7, Medical Diagnosis 7, LHC 1, Randox 1 | 84 = 84 |
| HbA1c | Medichecks 23, Medical Diagnosis 18, Clinilabs 14, LML 9, Goodbody 6, Lola 5, LHC 1 | 76 = 76 |
| TSH | Medical Diagnosis 30, Medichecks 28, Clinilabs 19, LML 11, Goodbody 9, Lola 8, Randox 2, LHC 1 | 108 = 108 |
| Vitamin D | Medichecks 30, LML 10, Clinilabs 9, Lola 7, Goodbody 6, Randox 3 | 65 = 65 |
| Magnesium | Medical Diagnosis 9, Clinilabs 8, Lola 8, LML 4, Goodbody 3, LHC 2, Randox 1 | 35 = 35 |

Filter chips (Biomarker, Provider) show with remove buttons and "Clear filters". Clear filters returned to /compare. No fallback to unrelated tests. Unit tests cover URL parsing and the query (src/services/__tests__/compare-filters.test.ts, biomarker-library-index.test.ts). Minor: the h1 reads "Tests for the selected biomarker" and the chip "Biomarker: loading" until the name query resolves.

### 2. Live library matches the data: PASS
/biomarker-database at 1280px: hero "977 biomarkers", "23 categories"; "404 allergen extracts and infection tests" in their own "Allergens and infection markers" section. 977 + 404 = 1,381, the row count of `biomarker_library_public`. All 43 raw labels map in src/components/biomarker-library/biomarker-categories.ts. Thyroid (16) includes TSH, Free T4 and Free T3. Iron (7) holds ferritin, iron, iron stores, serum iron, TIBC, transferrin, transferrin saturation. No duplicate category groups. Residual data misfiles listed under defects.

### 3. Reference range toggle: PARTIAL
The five cases are implemented and unit tested (src/components/biomarker-library/__tests__/reference-ranges.test.tsx). Defects remain on real data: the unit is appended to free-text ranges, the toggle shows when both sexes have identical text, and array-format `reference_ranges` (including a `sex: "all"` shared range) are ignored. See defects 3, 4, 5.

### 4. Hero video: PASS
`npx playwright test tests/e2e/hero-video.spec.ts tests/e2e/hero-mobile-proportions.spec.ts` against the dev server: 70 passed (both projects). Code reading of src/components/sections/HeroMasthead.tsx:
- The gate is real: `videoAllowed` is set only from a `load` listener followed by `requestIdleCallback` (timeout 3 s) or a 1 s timer (lines 69 to 86). The `<video>` is not in the DOM until then (line 223).
- The video is `opacity-0` until `onPlaying` (lines 227, 234), so it cannot cover the photo before playing.
- The retry listeners from main (canplay, pause, visibilitychange, interaction) attach inside the effect keyed on `showVideo` (line 91), so they exist only after the gate opens. They cannot defeat it.
- Save-Data, 2G and reduced motion (read live) are kept. Playback rate 1.
- Source order MP4 before WebM, with a measured reason in the comment (MP4 2,879,053 bytes, WebM 2,942,488 bytes, matching the asset JSON sizes). The brief allows this.
Not checked: playback on the live site (the /__l5e/ video assets 404 locally).

### 5. Desktop category bar: PASS (one minor issue)
At 1024 and 1280 the row appears once on /, /compare, /compare/symptoms/brain-fog, /biomarker-database and a test page, with identical labels: Most popular tests, General wellness, Women's health, Men's health, Sports & fitness, Fertility - prenatal, Cancer screening, At-home test kits. No horizontal overflow. With touch: first tap on General wellness opens the panel without navigating, an outside tap closes it, Escape closes it, a second tap navigates to /wellness (both widths). Labels come from `categoryNavigationItems` (src/components/header/NavigationItems.tsx:209). Stale comments updated. Unit test: src/components/layout/CategoryPillDropdown.test.tsx. Minor issue: the General wellness panel is 725px tall with no max height (defect 7).

### 6. Type scale and buttons: PARTIAL
Measured computed sizes (px):

| Page | 375 h1 / h2 / h3 | 768 h1 / h2 / h3 | 1280 h1 / h2 / h3 |
|---|---|---|---|
| Home | 33.5 / 24 / 16-18 | 31.1 / 30 / 16-20 | 40.2 / 36 / 16-20 |
| Brain fog | 32 / 24 / 18 | 40 / 30 / 20 | 48 / 36 / 20 |
| Library | 32 / 24 / none | 40 / 30 / none | 48 / 36 / none |
| Test page | 32 / 18-24 / 14-18 | 40 / 20-30 / 14-20 | 48 / 20-36 / 14-20 |

Symptom, library and test pages follow the new scale (48/36 at desktop). The homepage does not: its hero h1 uses its own clamp, so at 768px the page title (31.1px) is barely above section headings (30px), and at 1280px it is 40 against 36, the exact gap the brief called too close (defect 2). Buttons: 44px default and 52px lg on the pages in scope; `size="sm"` (36px) is used for content-card buttons ("Compare prices" on symptom pages, "See what's tested" on the homepage) from 640px up, although button.tsx reserves sm for dense toolbars. The biomarker library's "Show more" and range toggle buttons are inline-styled, not the shared Button. No page in scope overflows horizontally. Grep of the in-scope files for heading tags with hard-coded size classes finds HeroMasthead.tsx:263 and RelatedLinks.tsx:37 (shared component used on test pages).

### 7. Symptom content: PARTIAL
Copy checked against NICE and NHS: no IgE recommendation for bloating or acne, no cortisol for sleep, CG61 tests for bloating, NG20 gluten challenge, NG88 for heavy periods, NG23 FSH rules for hot flushes are all correct. No duplicate headings on the four symptom pages checked; the lower block is now "How we compare these tests". "Compare all" goes to /compare?symptom=<slug> and lists the union of every recommended test's search.

But that union is a substring search on test name and description, so it pulls in tests the copy rules out (defect 1). Two copy issues (defects 9 and 10).

### 8. Add-on marker: PARTIAL
The marker renders ("ADD-ON / Only sold with a main test") on add-on cards: 1 on /compare?biomarker=<ferritin>&provider=lola-health, 89 on /lola-health; the button still reads "View details". Unit test src/components/cards/__tests__/UniversalTestCard.addon.test.tsx. In the four-column /compare grid at 1280px the "View details" pill covers the end of the marker text (defect 6).

### 9. AI explainer: PASS
Called live through the dev server: `explainTestForVisitor({testId: <valid uuid>})` returned `{refused: true, reason: "disabled"}`; an invalid id throws "A valid test id is required"; `listExplainableTests()` returns []. Output cap `TEST_EXPLAINER_MAX_OUTPUT_TOKENS = 900` (src/lib/ai/test-explainer.server.ts:39). Rate limiting uses only `cf-connecting-ip` (src/lib/ai/client-address.ts), and x-forwarded-for is marked untrusted. `isTestExplainerEnabled` fails closed until a shared limiter flag is set. The commit-message mismatch is recorded in AGENTS.md. `@ai-sdk/anthropic` stays in package.json, so the lockfile entry is still needed.

## Defects, ranked by severity

1. High. "Compare all <symptom> tests" lists tests the page's own evidence notes rule out. `CompareService.getSymptomTests` (src/services/CompareService.ts:294 to 317) runs `TestQueryBuilder.buildSearchQuery` (src/services/queryBuilders/testQueryBuilder.ts:163), which matches `description ILIKE %term%`. The term "iron" matches "envIRONmental" and any description that mentions iron. Measured: /compare?symptom=sleep-problems lists 185 tests, including Cortisol Stress Blood Test, Allergy Profile I, III and V (IgE) and Heavy Metals Screen. /compare?symptom=brain-fog (235) has the same allergy and cortisol tests. /compare?symptom=bloating (97) lists Genetic Coeliac Disease Home Test, while the bloating copy says a genetic coeliac test cannot diagnose the condition. Fix: select symptom tests by biomarker links (as biomarker mode does) or by test name only, not description substrings.
2. Medium. Homepage hero h1 is off the type scale. src/components/sections/HeroMasthead.tsx:263 uses `text-[clamp(1.5rem,10cqw,3.5rem)]`. Measured h1 31.1px against h2 30px at 768, 40.2 against 36 at 1280.
3. Medium. Unit appended to free-text ranges. src/components/biomarker-library/BiomarkerLibraryUI.tsx:340 adds `entry.unit` after any text value. Ferritin renders "Male: Varies by lab; typically higher lower limits in men µg/L". 62 library rows already carry the unit in the text (haemoglobin would show "130–165 g/L g/L"); 78 rows hold prose.
4. Medium. Toggle shown for identical ranges. src/components/biomarker-library/biomarker-ranges.ts:191 returns "split" whenever both sexes have content, even when the text is identical. 115 rows have `normal_range_male = normal_range_female` (HbA1c "<42", TSH "0.27-4.2"), so the visitor toggles between two identical boxes. The brief's shared case applies here.
5. Medium. Array-format reference ranges are ignored. `normaliseReferenceRanges` (src/components/biomarker-library/biomarker-ranges.ts:129 to 130) returns {} for arrays. 12 rows, including HbA1c and TSH, store `[{sex: "all", normal_min, normal_max, optimal_min, optimal_max, unit}]`, which is the data marking a range as shared. Those bands are never shown, and TSH's array (0.4 to 4.0) disagrees with its text (0.27-4.2) without notice.
6. Medium. Add-on marker overlapped by "View details". src/components/cards/UniversalTestCard.tsx:1058 places the full marker at left-3 top-3 and the pill sits at right-1 top-1 (line 1126). On cards about 245px wide (/compare, 4 columns at 1280) the pill covers "test" in "Only sold with a main test". Screenshot: p8-compare.png in the review scratchpad.
7. Low. Category panel can extend past the viewport. src/components/layout/CategoryPillDropdown.tsx:300 to 310 sets a fixed panel with no max-height. The General wellness panel is 725px tall. On the homepage at 1280x800 it spans y=313 to 1038, so the second row and "View all wellness tests" start below the fold. The panel follows the page on scroll, so it is reachable with a mouse wheel. Present on main, but this branch puts the row on every page.
8. Low. Out-of-order migration. supabase/migrations/20261104150000_biomarker_hub_iron_status_category.sql is older than versions production has already applied (20261106145709 and later). `supabase db push` refuses out-of-order files without `--include-all`, so the data fix may not apply. Production is still unmigrated (ferritin under Haematology, Iron Status 3 rows); the page relies on the slug overrides meanwhile. Production also records 20261106152233 (cap_mcp_denied_log_per_user), which is in neither this branch nor origin/main: an out-of-band change, not caused by this branch.
9. Low. Unverified claim in copy. src/data/symptomPages.ts:495 says PCOS is the condition "which the NHS now calls polyendocrine metabolic ovarian syndrome (PMOS)". The rename was proposed in May 2026 with a three-year transition; press reports from 19 May 2026 say the NHS website had not adopted it. The reviewer could not open nhs.uk to confirm the current page. Suggest "which experts have proposed renaming".
10. Low. Crisis wording. src/data/symptomPages.ts:142: "If you have thoughts of harming yourself, call 999". NHS guidance sends people with thoughts of self-harm to NHS 111 (option 2), a GP or Samaritans, and reserves 999 for when life is at risk or harm has happened.
11. Low. Prettier errors from main in changed files: src/components/sections/DecisionInfrastructureSection.tsx:20, src/components/sections/TestCategoriesSection.tsx:88. `npx eslint --fix` clears both.
12. Low. Hard-coded sizes left in scope: src/components/seo/RelatedLinks.tsx:37 (`text-sm` h3 on test pages, should be `type-eyebrow` or similar); src/pages/SymptomDetailPage.tsx:142 and 158 (`text-base` body instead of `type-body`); src/pages/SymptomDetailPage.tsx:109 and src/components/sections/DreamHealthShowcase.tsx (around 378) use `size="sm"` buttons on content cards.
13. Low. Remaining category misfiles in data: unsaturated-iron-binding-capacity-uibc stays in "Vitamins and minerals" (not in SLUG_CATEGORY_OVERRIDES, src/components/biomarker-library/biomarker-categories.ts:135 to 143); calcitriol (1,25-dihydroxyvitamin D) sits in Thyroid; liver-function-test-lft and ph-levels sit in Bone health; coagulation and genetic tests show under "Blood count". Thyroid also holds data duplicates (Anti-TPO, TPO Antibodies, Thyroid Peroxidase antibodies; Total T4 and Total Thyroxine (T4)).
14. Low. Library section order. src/components/biomarker-library/BiomarkerLibraryUI.tsx:1053 to 1093 renders "Allergens and infection markers" straight after the first 48 main entries and their "Show more" button, so the separate section appears in the middle of the main list until every page is loaded.

## Not checked

- Video playback on the live site (local /__l5e/ assets 404; the e2e stubs them).
- The current nhs.uk PCOS page (fetch was blocked).
- Real touch hardware; touch was emulated in headless Chromium.
- A production build and the prebuild chain (`npm run build`).
- Pages other than those listed, and widths other than 375, 768, 1024, 1280 and 1440.

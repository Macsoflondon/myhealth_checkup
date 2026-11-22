# Mobile download screening, part 6 — 22/11/2026

## Changes

- Compare/search/panel and recommended pools omit description and biomarker arrays, retaining biomarker_count. Compare cards fetch details only for the displayed slice; panel rows fetch details only for selected listed providers.
- Category and mapped-category projections also omit the heavy fields. Category evidence is evaluated through a bounded, strict, public read-only server function using the publishable client and public unified catalogue view. Only matching flags, add-on classification and fallback counts return; no prose returns in this pool evidence.
- Category cards still render the complete existing grid, so their details are prefetched for SSR. All currently rendered category cards are intentionally enriched; this does not defer offscreen cards or introduce pagination. Existing category search logic consumes the enriched map. No clinical or pricing rules changed.
- Details queries deduplicate base catalogue IDs across collection variants. Shared image sizing accepts page-specific slot hints without changing CSS dimensions.
- Generated/hosted 320/640px quality-75 WebPs for every original referenced by the provider kit maps: 182 sources, including 153 Medical Diagnosis boxes, eight London Medical Laboratory photographs, eleven Medichecks photographs, Clinilabs, Goodbody, Lola and EDGE kits. All 364 outputs validated for dimensions/aspect ratio; six contact sheets inspected. Mean pixel error stayed below 3.1/255. Source maps still reference originals for large views; card helpers choose smaller hosted candidates.
- Three category photos have Unsplash width candidates 480/800/1200 at q=70. Existing aspect ratio, crop and alt attributes are unchanged.
- Removed the video poster attribute: the underlying responsive picture remains the first-paint still.

## Measurements

Same localhost preview, fresh browser contexts, 390px width/DPR 3 and identical scrolling. Numbers below are **decoded response bytes and gzip-equivalent bytes**, not a production-build compressed transfer claim. The supplied 326KB production baseline cannot be compared directly to these development measurements.

| Resource | Before | After |
| --- | ---: | ---: |
| `/compare` client catalogue responses, decoded | 1,213,953 | 616,326 |
| `/compare` client catalogue responses, gzip equivalent | 245,988 | 61,455 |
| `/tests/heart` 45-row pool, decoded | 75,513 | 33,344 |
| `/tests/heart` pool, gzip equivalent | 17,603 | 3,888 |
| `/tests/heart` client catalogue transfer on initial SSR navigation | 0 | 0 |
| Heart-page hosted kit images encountered by the same scroll | 1,545,702 | 51,412 |
| Homepage hosted images encountered, excluding video | 563,089 | 198,456 |

Heart-page full HTML **did not shrink**: 876,615 → 889,652 decoded bytes (gzip equivalent 52,345 → 54,142). Complete card details remain in SSR, and the separate details cache adds serialisation overhead. Pool reduction must not be described as an overall heart-page data-transfer reduction. No pagination or visual hiding was introduced to manufacture one.

For the complete mapped kit inventory, original bytes total **53,547,689**; all 320px candidates total **799,590** and all 640px candidates total **1,726,920**. Both variant sets combined are 2,526,510 bytes; a browser chooses one candidate per kit. Originals remain hosted and were not deleted.

Homepage still requests: before AVIF 40,749 bytes plus WebP 43,352; after only AVIF 40,749. The background video continues playing.

## Verification and limitations

- 1,355 unit tests across 136 files passed; targeted query/CDN/kit tests passed; changed-file lint and automatic compilation passed.
- All mapped candidate URLs were successfully uploaded through the asset CLI; pointer JSON is committed. Image dimensions, aspect ratios, source mapping and neutral fallback are retained.
- Python Chromium checks at 375px and 1280px: homepage, compare category, heart category/subcategory, thyroid panel and wellness routes produced no page errors, hydration warnings or horizontal overflow. Compare detail modals opened at both widths. Kit/current-source screenshots inspected.
- Heart page has no rendered search input despite retaining existing search state; no new control was added. Biomarker sort retains stored counts; the details map supplies full names.
- The JavaScript Playwright smoke command failed before page navigation because its required Chromium executable is absent; it did not establish a site regression. Python Chromium checks above ran successfully.
- Manual production builds are prohibited by the sandbox instructions; automatic compilation is clean, but a production artefact and production compressed transfer comparison remain unverified.
- No publication, database migration, database write, cron change or edge-function deployment.

Skill used: `mhc-comparison-ui`.
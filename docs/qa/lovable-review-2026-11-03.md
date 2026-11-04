# Fix brief: Lovable changes of 3 November 2026

Scope: the 12 Lovable commits made on 3 November 2026 between 10:28 and 12:42 UTC, on project 37e227e1. Each point states the problem, the evidence, the root cause where known, the required fix and the acceptance checks. Fix root causes. Do not patch symptoms to make checks pass.

## 0. Lockfile out of sync (found while fixing)

Problem: commit 60148 added `@ai-sdk/anthropic` to package.json but not to package-lock.json. `npm ci` fails with "Missing: @ai-sdk/anthropic@4.0.96 from lock file", so deploy.yml, build-check.yml and the dependency scan all fail.
Fix: regenerate the lockfile entry with `npm install --package-lock-only --ignore-scripts --legacy-peer-deps`. If point 9 removes the dependency, regenerate again.
Accept: `npm ci --no-audit --fund=false` succeeds. `node scripts/check-lockfile-stale-copies.mjs` passes.

## 1. Biomarker library provider links show the wrong numbers

Problem: each opened biomarker card lists providers with "N tests". The link opens /compare?search=<name>&provider=<id>. The compare page does a text search on test name, description and category, so the counts do not match. Ferritin: Medichecks card 38, compare page 2. Randox card 1, compare page 0, and the page then falls back to unrelated "recommended" tests with no notice that the provider filter applied. The provider filter has no visible control, so a visitor cannot see or clear it.
Root cause: the card counts rows in `biomarker_provider_comparison` (biomarker to test links). The compare page never reads those links.
Fix: make the link and the destination use the same source. Give /compare a biomarker mode (for example ?biomarker=<library id>&provider=<id>) that loads exactly the active tests linked to that biomarker, optionally narrowed to one provider. Count the card from the same query the page uses (active tests only, supported providers only). Show the active biomarker and provider filters on the page with a clear control. Never silently fall back to unrelated tests when a filter is active.
Accept: for Ferritin, HbA1c, TSH, Vitamin D and Magnesium, every provider count on the card equals the number of tests the linked page shows. Clearing the filter works. Unit tests cover the query and the URL parsing.

## 2. Live biomarker library does not match the data

Problem: the live page says 101 biomarkers in 17 categories. Thyroid lists only Reverse T3 and Calcitonin, although TSH and Free T4 exist. Infectious Disease still sits in the main list. The new "Allergens and infection markers" section does not appear. `biomarker_library_public` returns about 1,500 active biomarker rows across 43 overlapping category labels (Cardiac, Cardiac Markers, Cardiovascular; Diabetes, Diabetes & Metabolic; Vitamins, Iron & Nutrients, Minerals; Liver Function, Liver & Metabolic; and so on). Ferritin is filed under Haematology, Iron under Vitamins.
Root cause: to be confirmed. The 101 / 17 figures point to a static fallback dataset or a stale build rather than the view.
Fix: find why the live page renders 101 entries and make it render the view. Map the 43 raw labels to one consumer category set in one place (data or a single mapping module, not scattered literals), and move clearly misfiled core markers (Ferritin, Iron) to the right group. Keep allergen and infection entries out of the main list and in their own section. Make the header counts come from the data.
Accept: the page shows the real count. Thyroid includes TSH, Free T4 and Free T3. Duplicate category labels no longer appear as separate groups.

## 3. Reference range toggle can mislead

Problem: Lovable changed `hasSexSplit` to `male || female` and always shows Male and Female buttons. With no sex split it says "The same guideline range applies to both sexes", which is a clinical claim the data does not support when one side is missing. Picking a sex that has no data shows an empty box.
Fix: show the toggle only when both male and female ranges exist. When only one sex has data, label it as that sex and say no range is listed for the other. When only a shared range exists, show it without the toggle and without claiming it applies to both sexes unless the data marks it as shared. Never render an empty range box.
Accept: unit tests for both, male-only, female-only, shared-only and none.

## 4. Hero video regressions

Problem: commit 70eee and later edits removed the 28 October performance fix. `videoAllowed` is set straight after mount, so the 3 MB video downloads during page load on every phone. The code comment still says it waits for load and idle. The fade-in on "playing" was removed, so an unbuffered video can cover the photo with a blank frame. MP4 now comes before WebM, so Chrome and Firefox fetch the larger file. Nobody verified the video plays on the live site.
Fix: mount the video after window load plus an idle callback, keep it hidden until "playing" fires, then fade in. Keep Save-Data, 2G and reduced-motion handling. Order sources WebM then MP4, unless a measured reason says otherwise. Keep playback rate 1. Make the comment match the code.
Accept: e2e or unit check that the video element is absent before load and present after. Hero photo stays the LCP element. Existing hero tests pass.

## 5. Desktop category bar

Problem: the restored bar renders on the homepage hero only, so desktop navigation differs page to page. Labels differ from the other header ("Home Tests" against "At Home Test Kits", "Most Popular" against "Most Popular Tests"). Sub-menus open on hover or focus only, with no click or tap behaviour, so they fail on touch laptops and tablets in landscape. AGENTS.md and a stale HeroMasthead comment still say the toolbar was removed.
Fix: use one label set from one source across every header. Make the sub-menu open on click or tap as well as hover, close on outside click and Escape, and keep keyboard access. Put the bar in the shared desktop header so it appears on every page that carries the header, or document why it is homepage only. Update the stale comments.
Accept: unit or e2e test that a tap opens and an outside click closes the panel. Labels match across pages.

## 6. Type scale

Problem: page titles (40px) and section headings (36px) sit too close in size. "Related tests and biomarkers" on test pages jumped from 18px to 36px. Homepage sections still carry hard-coded size classes instead of the shared utilities, so drift will return. Buttons were not unified, although the request asked for it. No phone or tablet check was done.
Fix: set a scale with clear steps (page title above section title above card title above body) and apply it through the shared utilities in src/styles.css. Move the homepage section headings onto the same utilities. Size the related-links heading as a minor heading. Add one shared button size set and apply it to the pages in scope (symptom pages, biomarker library, test pages, Compare by symptom, homepage). Check at 375px, 768px and 1280px.
Accept: no hard-coded heading size classes remain on the pages in scope. Screenshots at three widths reviewed.

## 7. New symptom content

Problem: bloating and adult acne recommend allergy (IgE) profiles, which have weak evidence for those symptoms (NICE CG61 advises against IgE testing for IBS-type symptoms). Sleep problems recommends a single cortisol test, which does not assess sleep. This conflicts with the evidence-led content rule. "Compare all brain fog tests" links to the B12 search only, and every symptom's "Compare all" link uses the first test's query. Each symptom page shows the heading "Why test for ..." twice.
Fix: remove or replace the weak recommendations with evidence-informed ones and explain limitations in plain English. Point "Compare all" at a page that shows all the recommended tests for that symptom. Give the lower benefits block its own heading.
Accept: no IgE recommendation for bloating or acne. No duplicate headings. Compare all link covers every recommended test.

## 8. Add-on label removed from test cards

Problem: commit 97fbf replaced `{test.is_addon ? "Add-on" : "View details"}` with "View details" for every card. Visitors can no longer tell that an add-on test needs a base test, which weakens price transparency.
Fix: show a clear add-on marker on add-on cards, separate from the button text, with plain-English wording that it is bought alongside a main test. Keep the button reading "View details".
Accept: unit test that an add-on card shows the marker and a normal card does not.

## 9. AI test explainer (archived, not yet safe to restore)

Problem: commit 60148, labelled "Updated chat history link logic", added the whole explainer and a dependency. The section is unmounted but the server functions remain callable. Issues: `maxOutputTokens: 16000` for a 4-field JSON answer; the rate limit and cache are in-memory per server instance; the client IP comes from the first `x-forwarded-for` value, which a caller can set; the model id is a literal. Server functions stay reachable while the UI is archived.
Fix: cap output tokens to what the schema needs. Take the client address from the platform's trusted header, not a caller-controlled one. Move the rate limit to shared storage or a database-backed counter, or disable the server functions while the section is archived so no anonymous traffic can reach the model. Record the commit-message mismatch in the change log.
Accept: unit tests for the token cap and the trusted-address logic. With the section archived, the explain function refuses requests.

## Out of scope for this brief

Points 10 to 12 from the review (homepage copy errors, Featured Partner wording, Google button contrast) are not covered here.

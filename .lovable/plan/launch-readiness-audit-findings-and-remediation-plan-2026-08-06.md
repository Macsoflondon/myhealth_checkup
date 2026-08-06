# Launch readiness audit — findings and remediation plan

Full sweep completed across build, routing, data, security and responsive behaviour. Headline: **the platform is close to launch — no critical security holes, no build or type errors, database and frontend fully in sync.** The remaining work is a short list of correctness and polish items, plus one content-data gap.

## Where we stand

| Area | Status |
|---|---|
| Production build (client + SSR) | Pass, no errors |
| TypeScript | 0 errors |
| Unit tests | 150/151 pass (1 failure is a data row, not code) |
| Dependency vulnerabilities | None high or critical |
| Database security linter | No issues |
| Platform security scan | 2 low-severity warnings only |
| RLS coverage | Every public table has RLS enabled |
| Frontend/backend sync | All 60 table/view names and all 6 database functions used by the app exist and match |
| Sitemap | All 117 URLs return 200 |
| Layout (mobile/tablet/desktop) | No horizontal overflow on any tested page; exactly one H1 per page |

Verified live rather than assumed: rate-limit table policies, admin log table policies, biomarker completeness, and the null category row.

## Must fix before launch

1. **Two advertised pages return 404.** `/find-clinic` and `/biomarkers` 404 on every device. The clinic finder page was lost during the framework migration; `/biomarkers` was renamed to `/biomarker-database`. Both are still advertised to AI crawlers in `public/llms.txt`, listed in the prerender script, and asserted by the smoke test. Fix: restore the clinic finder route, add a permanent redirect from `/biomarkers` to `/biomarker-database`, and correct the references. (Neither is in the sitemap, so no indexing damage yet.)

2. **A dead call-to-action.** The health resources section links to `/health-resources`, which has no route — the button 404s. Point it at the real Health Resource Hub route.

3. **One test listing missing its category.** Medichecks "Zinc (serum) Blood Test" has no `canonical_category`, which breaks the category integrity test and hides the test from category browsing. Set it to the correct slug.

4. **Duplicate pages sharing identical metadata.** `/security` and `/trust` render the same page, as do `/complaints` and `/feedback`. Two URLs with identical titles and descriptions is a duplicate-content signal. Fix: pick one canonical URL for each pair and redirect the other.

## Should fix before launch (SEO and trust)

5. **Missing page metadata on public pages.** Around 25 public routes ship no title or description of their own — including `/thyroid`, `/hormones`, `/fertility-tests`, `/sports-performance`, `/test-categories`, the `/tests/*` category pages, the `/test/*` pages, and every provider brand page. For an SEO-led comparison site these are the money pages. Fix: give each a unique, keyword-led title and description following the existing house format.

6. **Half the catalogue has no biomarker list.** 353 of 730 active listings (48%) have an empty biomarker list, so those cards show "Biomarker list not published" and the comparison and quiz features degrade. Full biomarker transparency is a stated platform requirement. Fix: run the enrichment pass across the affected providers and re-verify counts, prioritising the largest catalogues (Medichecks 200, Medical Diagnosis 172, Clinilabs 127).

7. **Console noise on live pages.** Two recurring warnings on the homepage and compare pages: an invalid image attribute casing, and a state-snapshot caching warning that risks a render loop. Both are cheap fixes and should be silent before launch.

8. **Homepage title is inconsistent between loads.** Observed three different titles for `/` across runs, which suggests the route-level and page-level metadata are competing. Fix: single source of truth for the homepage title.

## Housekeeping (can follow launch)

9. **Formatting rule was enabled but never applied** — 29,521 of the 29,568 lint errors are pure formatting. One automated formatting pass clears them and makes the linter useful again as a gate.
10. **~103 real lint findings** behind that noise: 35 uses of the forbidden `any` type, 20 React dependency warnings, 19 export-shape warnings. Worth clearing since the house standard forbids `any`.
11. **Scraper endpoint auth.** Roughly 15 scraper endpoints authenticate with the same single shared key. Not exploitable today and the key is confirmed absent from the browser bundle, but a single leak would expose all of them. Recommend moving to per-function secrets after launch.
12. **Newsletter and role provisioning warnings** from the security scan — both fail-closed and non-exploitable; worth a note in security memory rather than a code change.

## Technical notes

- Verification used: production build, TypeScript check, Vitest, ESLint, npm audit, Supabase database linter, platform security scan, live SQL against policy and catalogue tables, a 36-run browser sweep (12 routes × 3 viewports) capturing status, title, H1 count, overflow and console errors, and an HTTP check of all 117 sitemap URLs.
- Two earlier findings about open rate-limit policies and missing admin-log policies were checked against the live database and are already fixed — no action needed.
- Fixes are grouped so items 1–4 land first (correctness), then 5–8 (SEO and polish), then 9–12.

## Suggested order of work

1. Correctness pass: restore/redirect the 404 routes, fix the dead call-to-action, fix the category row, resolve the duplicate pages.
2. SEO pass: unique metadata across the ~25 public pages, homepage title single-sourced.
3. Data pass: biomarker enrichment across the 353 listings, then re-run the integrity test.
4. Hygiene pass: formatting, `any` removal, console warnings.
5. Re-run the full sweep and confirm every check is green before publishing.

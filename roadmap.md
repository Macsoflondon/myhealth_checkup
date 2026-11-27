# Roadmap

## 27 November screening, part 16
- [x] Removed strict-dynamic from script-src only; nonce, sources, Cookiebot nonce, private HTML caching and all other directives preserved.
- [x] 1,369 unit tests, changed-file lint and automatic compilation passed. Four browser routes returned 200 with zero CSP/page errors; filtering and nonce-free same-origin script execution verified. No publication/migrations. Separate production build unavailable because manual builds are prohibited; details in docs/SCREENING_PART_16.md.

## 27 November sync-secret transition, step 3
- [x] Existing header-only auth/comments/callers/SQL assertions verified; query-only requests return mismatch and any URL secret remains refused. No Apify, cron or production database definition changes.
- [x] 1,368 unit, nine auth Deno, seven scraper Deno and 45 isolated SQL scenarios passed; changed-code lint and automatic compilation passed. Seven functions deployed together; 28 live auth checks passed, and direct manual Clinilabs sync returned 200 with a persisted success row (139 updated). Full Deno run: 212 passed, five unrelated live-auth expectation failures; details in docs/SYNC_SECRET_STEP_3.md.
- [ ] Real admin manual queue verification blocked by unavailable admin MFA session; direct manual sync and isolated queue tests passed. Post-deploy scheduled run verification waits for the 28/11/2026 00:00–00:34 UTC cycle; no work runs after this turn ends.

## 27 November screening, part 17 (completes part 15)
- [x] Owner deployed mhc-edge-sync v1 and applied 20261127213546; reported 21:36 UTC success (12 updated, zero errors). No deployment, database or cron changes in this task.
- [x] Copy supplied applied migration, shared Deno parser and outside-repo entry point byte for byte; remove retired GitHub workflow/script and correct documentation.
- [x] Three supplied MD5s match; app/Deno source and behaviour parity pass; 1,376 unit tests, parser typecheck and changed-code lint pass. Automatic compilation reports build OK. Full configured Deno suite: 212 passed, five existing live-auth expectation failures (quiz-recommendations and security-alert-notify), unchanged from step 3; no access controls weakened. Commit the repository handoff.
- [ ] Separate production-build verification is blocked by the sandbox prohibition on manual builds. Full Deno-green acceptance is blocked by unrelated deployed-endpoint tests that expect anonymous/public-key requests to be accepted but receive 401; see docs/SCREENING_PART_17.md.

## 27 November screening, part 14
- [x] Add matching site and Edge stage 1 constants; gate account health-record features while preserving View/Delete for existing records and keeping stage 2 code.
- [x] Stop health-query writes/history reads in RecommendationEngine, BloodTestAnalysisPage and the three named Edge functions; deploy those functions.
- [x] Add the fixed rolling 24-hour global paid-AI ceiling with keyword-scoring fallback and a once-per-window warning.
- [x] Correct public, FAQ, privacy and account storage/tracking copy without dates or NHS integration claims.
- [x] Add focused dashboard, stage-gate and global-ceiling tests; 1,368 unit tests, 21 deployed-function Deno tests and changed-file lint pass. Public browser checks show no history/save prompts or page errors; automatic build is OK. Signed-in browser verification is unavailable for the user-managed backend; component tests cover existing-file View/Delete. Commit without publishing or migrations.

## 22 November screening, part 9
- [x] Verify own-domain Shopify product handles against one complete paginated live catalogue per store; retain per-page checks elsewhere, provider pools, 429 handling and the time budget.
- [x] Preserve incomplete-catalogue state and log provider methods. 16 Deno / 1,355 unit tests and lint/automatic compilation pass. Deployed v198; final scheduled-auth check returned 202 in 788ms, then completed all 748 links in 156.1s: 748 OK, zero broken/rate-limited/inconclusive/not-reached. Fixed Unicode-handle mismatch found during initial live check and acknowledged only its temporary false alert. Per-provider counts in docs/SCREENING_PART_9.md.
- [x] Saved tested changes without publishing, migrations or cron changes.

## 22 November screening, part 8
- [x] Return 202 and retain link verification with EdgeRuntime.waitUntil.
- [x] Prioritise never/oldest-checked URLs and stop starting work after 330 seconds, retaining provider pools, Lola and 429/redirect handling.
- [x] Deployed v195; 10 Deno and 1,355 platform tests, changed-file lint and automatic compilation pass. Live scheduled-auth path returned 202 in 701ms; background log finalised partial after 330.25s: 748 URLs, 728 checked, 301 OK, 0 broken, 427 rate-limited, 20 not reached. Counts reconcile; provider rate limits remain unchanged. Details in docs/SCREENING_PART_8.md; no publishing, migrations or cron changes.

## 22 November screening, part 7
- [x] Parse Medical Diagnosis WooCommerce prices; reject unpriced/non-product pages without refreshing fields.
- [x] Union sitemap matches, active stored URLs and recent automatic delist URLs before five-way batching; preserve manual delists.
- [x] All four rules and coverage tested: 10 Deno / 1,355 platform tests, changed-file lint and automatic compilation pass. Deployed v167; five live dry batches attempted 154 paths without catalogue writes. Correct £156/£188/£72 samples and ALEX3 £331 source verified; unpriced Sputum excluded. See docs/SCREENING_PART_7.md; no publishing, migrations or cron changes.
- [ ] Scheduled price correction and ALEX3 persistence await 12:16–12:28 UTC jobs; four provider 429 responses and one other unreadable listing were recorded during dry checks.

## Public header and ferritin guide
- [x] Match inner-page brand sizing and slogan to the homepage; retain the mobile hamburger and sticky bar.
- [x] Add the desktop category toolbar beneath inner-page branding without duplicating the homepage toolbar.
- [x] Replace the ferritin-versus-iron navy heading box with the standard white heading area.
- [x] Verified homepage, compare and guide at 375/768/1280/1689px: slogan visible, one desktop toolbar, no overflow or page errors; category link opens popular tests. Typography regression and changed-file lint pass; automatic compilation clean. Committed without publishing.

## 22 November screening, part 6
- [x] Slim compare, search, recommended, panel and category projections; rendered-card/table details and base-ID deduplication preserve prose/markers. Public server evidence preserves subcategory matching, add-on classification and missing-count fallback.
- [x] Hosted 364 WebPs for 182 mapped kits; 53,547,689 original bytes versus 799,590 at 320px or 1,726,920 at 640px; original maps retained.
- [x] Category Unsplash candidates 480/800/1200px at q=70; hero network trace shows only the AVIF still.
- [x] Preview transfer measurement, 375/1280px route/modal checks, 1,355 unit tests, changed-file lint and automatic compilation passed. Details in docs/SCREENING_PART_6.md; no publication or database changes.
- [ ] Production artefact verification depends on harness compilation; manual production builds are prohibited.
- [ ] JavaScript Playwright smoke suite could not launch its missing Chromium version; Python Chromium route checks passed instead.

## 22 November screening, part 5
- [x] Shared complete entity decoding, parity tests, app aggregation/public article read and bounded repair/EDGE article helpers implemented. Deno tests and prepared entry-point handoff pass.
- [ ] Restore and deploy blog-aggregate — sandbox refused adding the missing function entry point. Updated standalone source is prepared; daily production EDGE handling and stored-row repair remain unapplied. Documentation accurately retains outside-repository status.
- [x] Responsive Shopify images and build-generated 480/768px illustrative variants implemented; exact dimensions verified for all ten variants, mobile images/fallbacks render and retain lazy/async/dimensions.
- [x] Showcase prose removed from pool projection and read from prefetched details. SSR article text unchanged (15,842 characters); homepage HTML 536,766 → 518,987 bytes. Animation-owned attribute race removed; final browser run has zero hydration warnings or page errors.
- [x] Three blog breadcrumb trails measured 24px link heights with unchanged 14px text; mobile screenshots inspected.
- [x] Final 1,348 unit tests, 28 type-checked Deno tests, changed-file lint, lockfile check and automatic compilation passed. No publishing, migrations or cron changes; details in docs/SCREENING_PART_5.md.
- [ ] Production build/artefact verification — manual builds are prohibited by the sandbox workflow; build-hook image tests and automatic compilation are verified, not a production artefact.

## 22 November security screening, part 4
- [x] Replace forwarded-address reads with validated Cloudflare/gateway helpers and repository guard tests; two additional sibling functions and existing nullable-helper consumers covered.
- [ ] Restore landing-signup and deploy its address fix — blocked by the sandbox's explicit prohibition on adding absent Edge-function source. Upload SHA-256 matches; existing verify_jwt=false setting recorded, production signup unchanged.
- [x] Correct blog aggregation documentation and inventory out-of-repository functions, including the still-blocked landing-signup restoration.
- [x] 1,315 unit tests, 35 targeted Deno tests, 15 live public API checks and eight retried legacy live tests passed; 14 deployed versions verified from invocation logs. Automatic compilation clean. Lint run: one pre-existing intentional control-regex finding plus existing generated MCP formatting/no-var findings remain. Details in docs/SECURITY_SCREENING_PART_4.md. No publishing, migrations or cron changes.

## Medical Diagnosis batch coverage follow-up
- [x] Partition stable matched paths into five dynamic slices using the existing offset/limit batch positions; preserve urls_only and report batch_index, batch_count and slice_size.
- [x] Exact coverage tests for 150, 151 and 180 URLs pass (15 Deno tests plus 3 targeted URL tests); automatic compilation clean. Deployed mhc-page-scrape v159 confirmed in logs. All five live URL-only calls return 200 with 152 matched URLs and slice_size=31: batch lengths are 31/31/31/31/28, covering all 152. No cron, migration or catalogue price updates; site not published.

## 22 November backend screening
- [x] Remove password verification from auth-throttle; strict 254-character email, check/failure schema and 2KB streaming body cap. Client never sends passwords to the throttle. Live check 200, password field 400; mocked bucket isolation/429 tested.
- [x] Detect homepage/non-product redirects and prefer stable URLs in both scrapers. Deployed versions: auth-throttle 171, scrape-and-verify 188, mhc-shopify-rich-sync 154, mhc-page-scrape 156, confirmed by edge logs. Dry runs: London Health Company 14/14 matches, Goodbody 58/58, Medical Diagnosis 152 matched URLs, 2/2 sampled pages; written=0. No hand-edited prices or migrations executed.
- [x] Copy all six already-applied migration files byte for byte; all supplied MD5s match.
- [x] Upgrade typescript-eslint and its packages to first patched 8.73.0; replace vulnerable minimatch override with 11.0.1+, reconcile both lockfiles. Standard npm ci and stale-copy check pass; npm audit reports zero advisories; existing production package versions unchanged.
- [x] Remove six inline-colour substring selectors, move provider quote hues and light-surface section text to semantic tokens. 375/1280px homepage/providers have no page errors or horizontal overflow, quotes keep EB Garamond at full opacity without wrapper. 1,290 unit tests, 20 checked Deno tests, changed-file lint (three existing refresh warnings), SEO regression and automatic compilation passed.
- [ ] Full production build verification remains unavailable: manual builds are disabled by the sandbox workflow; automatic compilation reports build OK, not a verified production artefact.
- [x] Medical Diagnosis coverage fixed in function v159: existing offsets identify five dynamic partitions rather than a 150-item capacity. No cron or migration changes required.

## 22 November performance screening
- [x] Resize public Storage/Shopify product images with contain transforms and responsive candidates, prioritise the first two listing cards, and optimise EDGE kit/logo assets; other unresizable image hosts remain unchanged.
- [x] Gate wheel/marquees/timers by viewport, visibility and reduced motion, replace two per-frame marquees with compositor animation, and batch reveal scans.
- [x] Filter compact homepage reads (677 rows / 442,894 bytes to 52 rows / 23,252 bytes for the main query; selected-row biomarker enrichment additional), hydrate prefetched homepage/listing queries once and memoise public SSR catalogue reads for five minutes. HTML cache headers unchanged: hosting support unverified.
- [x] Dynamically load non-English locales and replace five Montserrat weights with a 37,956-byte Latin variable font. Existing family name/brand paths retained.
- [x] Add shared listing loader prefetching and router hydration; local /tests/diabetes and /biomarkers CLS measured 0, not production evidence.
- [x] Run 1,287 unit tests, final 31 targeted tests, lint (no errors; existing fast-refresh warnings), SEO and automatic compilation; commit without publishing or database changes.
- [ ] Production performance, locale bundle and uploaded script verification await a local production artefact; none is available in this sandbox. Full uploaded script against preview: 44 checks, `pages with failures: 4` (home/provider decoration and kit text); subsequent corrections passed compilation but final script rerun timed out before emitting results. Homepage reveal/hydration attribute warnings and unresizable-image warnings remain. No claim of complete production verification.

## 22 November mobile accessibility screening
- [x] Fix wrapping stats, seven source-backed educational comparisons and similar-test categories; keep educational copy and use tracked catalogue product links.
- [x] Fix public text sizes, form sizes, targeted tap targets, contrast tokens/quotes, eyebrow, footer and British spelling without changing brand bars.
- [x] Verify ten public routes and nine real provider detail pages at 360/390px: no measured unintended overflow or visible text below 12px outside branding; measured fields are 16px. All 1,277 unit tests passed, final 17 focused tests passed, core lint and SEO checks passed, automatic build OK. No publishing or database changes. Fresh Lighthouse contrast scoring and native iOS focus behaviour remain unverified.

## Claude hand-off and nine-provider coverage
- [x] Consolidate all pending Claude work in docs/claude-pending-work.md, with activation prerequisites and verification gates; this is a repository hand-off, not a started Claude session.
- [x] Update current platform provider counts and coverage to nine, including EDGE; preserve source-backed catalogue data and remove the upper showcase's eight-card cap.
- [x] Verify preview changes and save the hand-off: provider directory shows nine cards with EDGE's image loaded and no horizontal overflow at 375/1280px; homepage checked at 390/1280px; 18 focused regressions and eight browser smoke tests pass, SEO/lint and automatic build clean. No database changes or publishing.

## Homepage SEO Soft 404
- [x] Prefetch and hydrate the existing live comparison query in the homepage loader, preserving the canonical, prices and comparison journey.
- [x] Verified HTTP 200 and four source-backed comparison rows without JavaScript, 375/1280px screenshots with no overflow, hydrated prices without errors, populated comparison-link destination, 63 tests, changed-file lint, SEO/structured-data checks and automatic build OK. Preview only; Google classification remains subject to publishing and recrawl.

## Medichecks kit photographs
- [x] Audit all 192 active Medichecks tests: 191 image URLs return 200, ten blocked promotional assets and one missing image.
- [x] Retrieve official photographs for all 11 affected tests; preserve the real box artwork and isolate it on white, with per-test source evidence.
- [x] Ultimate Performance photo loads in sports listing and test details at 1280/375px; screenshots checked, 32 image regressions and all 1,236 unit tests pass, changed-file lint and automatic build clean. Preview only; no database changes or publishing.

## EDGE provider updates
- [x] EDGE display maps and homepage provider labels updated; stable sports-blood-tests ID retained.
- [x] Verified all 12 fixed-product prices (£99–£130), full marker lists and verbatim descriptions; prepared exact-price migration including omitted Advanced Testosterone.
- [x] Added EDGE's 24 biomarker articles to daily aggregation; verified source publication dates and prepared article migration with no provider-icon heroes.
- [x] Prepared six-hourly workflow (00:32/06:32/12:32/18:32 UTC) using shared provider upsert, source-price parser and scrape-run logging; 37 regression tests pass.
- [ ] Activate EDGE catalogue/articles and confirm scheduled refresh/card readback — blocked on Claude reviewing/applying the onboarding + two follow-up migrations, recording the laboratory identity/accreditation evidence, and GitHub workflow activation/server-only secret. Owner confirmed CQC partner clinics on 07/11/2026. No database writes or publishing performed.

- [x] Delete the desktop/tablet category pill toolbar site-wide; the brand bar's menu drawer is now the only navigation entry point at every width, with a sticky trigger once the brand bar scrolls away. Bar absent and drawer opening at 1280/768/375 on / and /popular-tests; 1,147 tests passed, changed-file lint clean, automatic build OK. Preview only; no database changes.

- [x] Clarify the homepage comparison offer, search snippet and matching WebPage description; visible copy and SSR/social metadata browser-verified, 46 regression tests passed, changed-file lint and SEO check clean, automatic build OK. No search-performance diagnosis below 100 homepage impressions; reaches live on next publish.

- [x] Optimise blood-test comparison titles, social metadata and source-priced Product/MedicalTest, CollectionPage and breadcrumb JSON-LD; remove hidden FAQ markup and root image overrides. Six routes verified in SSR HTML and populated comparison page checked; 1,139 tests passed, final 42 SEO regressions passed, SEO validation and changed-file lint clean, automatic build OK. Preview only; no catalogue writes or publishing. Existing nine SEO warnings remain non-blocking.

- [x] Match the "Take Control of Your Health Today" panel to the test cards' turquoise border and glow, give the two live catalogue panels below it a navy outline that warms to turquoise on hover, and give all three buttons a navy border with alternate hover fills (turquoise↔pink, white→navy). Verified computed border/glow values identical to a test card at rest and hover, and at 1280/768/393px; 1,131 tests passed, changed-file lint clean, automatic build OK. Preview only; no database changes.


- [x] Audit all 446 stored provider articles: 236 missing images, 11 logo images, 2 broken URLs; shared renderer supplies local topic illustrations, category guides now use live articles, hub shows actual check date. Six feeds verified current; Randox public index has no article links in retrieved HTML, LML says no articles found. 1,131 tests passed; changed-file lint, SEO and automatic build passed; phone/desktop images verified. Full lint has pre-existing errors; smoke runner browser executable missing. No database writes.

- [x] Remove category biomarker truncation and retain confirmed zero-fee venous collection variants; 1,128 tests passed, changed-file lint clean, automatic build OK. Medichecks currently publishes 34 biomarkers, clinic £35 and home nurse £59. No catalogue writes; specific modal browser verification remains unconfirmed because the test was not found in the tried category filters.

- [x] Correct Lola add-on presentation when the stored flag contradicts explicit provider evidence; Omega listing and detail gallery verified with orange kit, all 89 provider-grid add-on buttons match orange images, homepage exclusion regression passed; 1,126 tests passed, lint has no errors and automatic build OK. Preview only; stored flags/scraper unchanged, no database changes.

- [x] Balance both homepage test showcases across all eight providers without inventing popularity; all eight providers and kit images verified, Medical Diagnosis modal opened, mobile overflow absent, 1,119 tests passed and automatic build OK. Preview only; no database changes.

- [x] Isolate assistant reply signing in CHAT_SIGNING_SECRET; reject invalid assistant history with private-safe logs and restart the chat. Live valid reply HTTP 200, edited/unsigned HTTP 400 and timestamp/endpoint/reason-only logs verified; browser storage cleared and restart message visible; 15 tests passed and automatic build OK. Not published.

- [x] Repair provider directory/profile/test navigation: canonical Randox links and alias redirects, distinct London provider matching; all eight populated profiles and test details browser-verified, 15 regression tests and changed-link lint passed, automatic build OK; no database changes or publishing.

- [x] Confirm Cloudflare Pages deployment of the current homepage and At-Home Tests page: eb26cd13 succeeded at https://f6ae8a6e.myhealthcheckup.pages.dev.
- [x] Verify stored Randox kit images in test cards and at-home listings; add the missing active comparison-table photo using TestCardImage, retaining provider logos. Verified at 375px and 1280px; 20 targeted tests and changed-file lint passed, automatic build OK; no migrations.

- [x] Align homepage section widths and rounded provider corners, tighten excess gaps, separate clinical standards text and markers, and remove the empty navy padding above Featured Partner; verified at 375px, 768px and 1351px with no horizontal overflow, order tests passed.

- [x] Replace all test-card brand pictures with source product images and a shared neutral fallback; verified sports/Clinilabs listings at 375px, without migrations.

- [x] Clarify the homepage UK private blood-test comparison offer and search snippet; preserve layout, branding and comparison links.

- [x] Make the homepage hero video clickable through to myhealthcheckup.co.uk; verified at five phone sizes and desktop.
- [ ] Update the hero e2e spec's stale wordmark/headline thresholds — the project's Playwright runner also cannot launch here (its browser build is missing libglib-2.0.so.0).

- [x] Inspect and save the two supplied replacement logos in the video reference collection.
- [x] Replace the old transparent video reference logo with the owner's chosen turquoise checkup version; preserve original files.

- [x] Correct home-kit postage allocation and verify route-specific clinic pricing without database changes or publishing.

- [x] Repair the Human Context Engine's case-sensitive OpenAI secret lookup with regression tests, preserving its provider, model and recommendations.
- [ ] Activate and verify the Human Context Engine secret-name repair — blocked until this draft is accepted and the edge function is deployed from the main thread.
- [x] Unify the three homepage comparison tables with the approved compact layout and prevent duplicate test panels.

- [x] Delete inactive £0–£1 Medical Diagnosis junk rows + linked history (136 rows).
- [x] Guard upsertWithProvenance: new inserts with price ≤ £1 stay inactive with a `suspicious_price` warning (deployed to all 8 scrapers).
- [x] Verify no active £0–£1 rows remain (0 rows).
- [x] Diagnose critical SOC incidents: broken_url storms were HTTP 429 rate-limit false positives from scrape-and-verify (medichecks 108, clinilabs 112 alerts/3d).
- [x] Fix scrape-and-verify: 429-after-retry now treated as inconclusive — no alert, url_verified untouched (deployed).
- [ ] Verify next daily url-verification run (05:15 UTC cron) produces zero 429 broken_url alerts.
- [x] Resolved all 85 open broken_url SOC incidents as false positives; zero critical/high incidents remain open.
- [ ] London Health Company partial runs: mhc-shopify-rich-sync fuzzy-matcher leaves 7/16 tests in needs_review (name drift vs Shopify feed). Name renames rejected by user; alternative = set provider_test_id from feed handles (all LHC rows currently NULL) pending confirmation the sync matches on it.
- [x] Medichecks: capture biomarker lists + provider-verbatim sections from product pages (195/200 biomarkers & prep/limitations, 41 "what can I learn"); parser `_shared/scrape/medichecksProductPage.ts`, enrichment in `medichecks-firecrawl` (runs each sync).
- [x] Surface provider-verbatim sections on test detail page + modal; biomarker empty state distinguishes capture gap from unpublished data.
- [ ] Extend page-level enrichment to remaining providers (randox, goodbody, clinilabs, lola-health, LML, LHC, medical-diagnosis) — each needs its own page parser.
- [ ] Route-split listings (home kit vs clinic vs nurse visit) across category/provider listings.
- [x] Correct London Medical Laboratory Allergy Complete allergen count, collection wording and £3.99/£35/£80 charges; preserve them in future scrapes.
- [x] Use the supplied Lola Health add-on kit image on all Lola add-on test cards without changing stored provider images.
- [x] Present and install three approved licensed real-stock hero images with branded slogans in a six-slide homepage sequence.
- [x] Correct the three slogan slides with art-directed mobile/desktop photos and responsive live text so no wording is cropped.
- [x] Phase 0 audit closed to the limit of agent access: migration reconciliation executed (93 marker files, 33 policy exclusions), `public.profiles` retired reversibly, storage prefix and bucket controls regression-tested.
- [ ] Phase 0 exit gate — blocked on the site owner: Supabase dashboard verification (auth policy, backups/PITR, cron inventory, live grants, bucket `allowed_mime_types`) and the `SUPABASE_DB_URL` repository secret for the live migration parity check.
- [x] Health Intelligence groundwork schema: 18 additive tables, RLS and grants throughout, `SECURITY DEFINER` helpers moved to a non-exposed schema, Supabase linter clean.
- [x] Canonical health contracts, release state machine, longitudinal series maths and health-record read layer, with 19 tests.
- [x] Forth Connect competitive architecture review; capabilities cherry-picked into backlog F.A-F.I, proprietary scores explicitly refused.
- [ ] F.A release transitions as server functions writing an audit event in the same transaction.
- [ ] F.I manual-entry adapter, then document upload, as the reference ingestion implementations.
- [ ] F.B longitudinal charts on the health dashboard once observations can exist.
- [ ] F.G notification dispatch abstraction and preference screen.
- [x] Inset all live hero content by 57px at tablet/desktop widths, preserving mobile, and verify wrapping at 390px, 768px and 1280px.
- [x] Apply the canonical eight-colour category palette to navigation pills and universal test-card category tags; verify populated women’s and cancer routes plus the at-home adapter path.
- [x] Update all five homepage hero slides and verify responsive copy avoids people at six widths.
- [x] Show active tests without images (All Tests/catalogue), brand-tile fallback; report 5 uncategorised tests
- [ ] Security: Assisted Test Finder and Hidden Gap Detector AI calls restricted to signed-in users
- [ ] Security: Assisted Test Finder and Hidden Gap Detector AI calls restricted to signed-in users
- [x] Reformat the whole site and verify types, unit tests and production build.
- [x] "Know What's Inside" 30s video ad delivered: 5 approved scenes animated at 1080p, stitched with music bed and brand card; seams verified.
- [x] Speed pass: right-size logos (WebP), Shopify card image resizing, keepalive web-vitals beacon, React Query biomarker library, explicit column lists, restore 28 Sep plan file.

## Code review fixes (Blood Taken Media Section draft, 19/10/2026)

- [x] 1. Collection fee rules table + view staged as a draft migration (applies on accept); types.ts regenerates on accept
- [x] 2. Hardcoded Clinilabs fee removed; fees read from unified_provider_tests
- [x] 3. Fee labels: self-arranged wording, pence formatting, tests
- [x] 4. Panel view no longer writes placeholders into the compare tray; store guards; tests
- [x] 5. Homepage card: "Price checked", fee line, new footnote
- [x] 6. Assistant: lazy panel, plugins removed, server hardening, fee data, storage guards, privacy copy
- [x] 7. Decision infrastructure copy and image alt corrected
- [x] 8. How We Rank reviewer, fixed review date, refresh copy
- [x] 9. Homepage mission copy and accessible quiz button colour
- [x] 10. Test finder: anonymous, 8/min and 30/day per IP, Deno tests (deploy from main chat after accept)
- [x] 11. Em dashes removed from touched copy
- [x] Swapped "Trusted by users" and "Why myhealth checkup" on the homepage and placed "Featured Partner of the Month" above the moved section; order guarded by a unit test.

- [x] 06/11/2026 open items: acronym normaliser at render time (IgG etc.), font weights trimmed, article images to WebP + img dimensions, Cookiebot no-shift guard, comparison tray lazy + 16 unused packages removed, 44px touch targets in shared components, chat button hides on scroll-down (<640px), drawer scroll-position fix, deep scan reviewed, e2e 69/69 per project. Not published; no database changes.

## Part 11 (queued after part 10)
- [x] Hero: still image only below md / reduced motion / Save-Data; update e2e
- [x] Homepage fingerprick + clinic images 320/640 WebP; dedupe PSA and Goodbody widths
- [x] 24px tap targets: guides breadcrumbs, cancer-screening-compare names, conditions "View tests"
- [ ] Health-data removal — ON HOLD: conflicts with 29/10/2026 owner rule withdrawing the prohibition; needs confirmation
- [x] bun.lock only: workflows to setup-bun, delete package-lock.json, docs
- [x] Delete blog-aggregate.yml; update CLAUDE.md and EDGE_FUNCTIONS_OUTSIDE_REPO.md

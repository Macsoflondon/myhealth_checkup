# Roadmap

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

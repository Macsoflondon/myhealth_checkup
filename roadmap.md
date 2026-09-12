# Roadmap

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
- [ ] Correct London Medical Laboratory Allergy Complete allergen count, collection wording and £3.99/£35/£80 charges; preserve them in future scrapes.

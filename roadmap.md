# Roadmap

- [x] Delete inactive £0–£1 Medical Diagnosis junk rows + linked history (136 rows).
- [x] Guard upsertWithProvenance: new inserts with price ≤ £1 stay inactive with a `suspicious_price` warning (deployed to all 8 scrapers).
- [x] Verify no active £0–£1 rows remain (0 rows).
- [x] Diagnose critical SOC incidents: broken_url storms were HTTP 429 rate-limit false positives from scrape-and-verify (medichecks 108, clinilabs 112 alerts/3d).
- [x] Fix scrape-and-verify: 429-after-retry now treated as inconclusive — no alert, url_verified untouched (deployed).
- [ ] Verify next daily url-verification run (05:15 UTC cron) produces zero 429 broken_url alerts.
- [ ] Resolve open false-positive broken_url SOC incidents in soc_incidents.
- [ ] London Health Company partial runs: mhc-shopify-rich-sync fuzzy-matcher leaves 7/16 tests in needs_review (name drift vs Shopify feed). Name renames rejected by user; alternative = set provider_test_id from feed handles (all LHC rows currently NULL) pending confirmation the sync matches on it.

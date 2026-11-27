# EDGE activation

Display name: **EDGE**. Catalogue/provider ID: `sports-blood-tests`.

## Claude hand-off

**Activated 07/11/2026.** Owner signed off EDGE (UKAS ISO 15189 laboratory, CQC-regulated partner clinics) on 07/11/2026. Onboarding applied as a migration; 12 tests are active. The owner deployed `mhc-edge-sync` v1 on 27/11/2026 and reports HTTP 200 with 12 updated and zero errors at 21:36 UTC. The article draft is historical; deployed `blog-aggregate` v12 includes EDGE in daily pg_cron aggregation.

1. `20261106234500_onboard_sports_blood_tests.sql` (existing draft onboarding).
2. `20261107001500_edge_exact_prices_and_name.sql` (12 exact prices, provider-verbatim descriptions and biomarkers, missing Advanced Testosterone, EDGE view label; no TEC calculation changes).
3. `20261107001600_edge_provider_articles.sql` (24 articles with publication dates verified from individual source JSON-LD).

Check view price parity before/after: only EDGE source prices should change; existing providers' displayed prices must remain identical. Regenerate Supabase types and run advisors/parity checks after application.

## Refreshes

- Owner-applied migration `20261127213546` schedules pg_cron `mhc-edge` at 00:32, 06:32, 12:32 and 18:32 UTC and adds `sports-blood-tests` to `mhc_price_sync_jobs` for the admin manual queue. This task only commits the supplied applied SQL; it does not run it or change cron.
- `mhc-edge-sync` v1 authenticates through `_shared/mhc-auth.ts`: Vault `mhc_sync_secret` in `x-mhc-sync-secret` only; URL secrets are rejected and there is no environment fallback.
- The retired GitHub workflow/script were removed after 42 HTTP 403 failures since 07/11/2026. The entry-point reference is `docs/edge-functions-outside-repo/mhc-edge-sync/index.ts`; it is not deployed from this repository.
- The app parser `src/lib/edge-source.ts` remains; `_shared/scrape/edge-source.ts` is its byte-exact Deno copy apart from the HTML import. A parity test guards both implementations.
- New fixed products are discovered from the provider's blood-test index. Removed index links are only deactivated after their page returns 404/410. Failed discovery/parsing preserves existing catalogue data.
- Product prices come exclusively from `#p-price-normal`, not navigation's bespoke offer from £35. Build-your-own is variable-priced and is not represented as a fixed-price kit.
- EDGE biomarker articles use deployed `blog-aggregate` v12 via daily pg_cron `aggregate-provider-blogs`. Real article pictures take priority; the generic EDGE icon is rejected and the existing labelled topic illustrations remain the fallback.

## Verified source prices (06/11/2026)

| Test | GBP |
|---|---:|
| Male runner | 129 |
| Female runner | 130 |
| Male cyclist | 129 |
| Female cyclist | 130 |
| Male triathlete | 129 |
| Female triathlete | 130 |
| Male weightlifter | 125 |
| Female weightlifter | 125 |
| Male CrossFitter | 120 |
| Female CrossFitter | 129 |
| Advanced Testosterone | 99 |
| RED-S MyFORM® | 129 |

24 biomarker articles show source publication date 22/05/2025; a fresh check does not imply fresh clinical review.

## Verification status

Owner evidence: EDGE is active, and the 27/11/2026 21:36 UTC `mhc-edge-sync` run returned 200 with a successful log, 12 updated and zero errors. The supplied migration, parser and reference entry-point hashes are recorded in `docs/EDGE_FUNCTIONS_OUTSIDE_REPO.md`. Scheduled-cycle and authenticated admin queue checks remain separate from this reference-copy task; no new live write run is required or performed here.

The historical consolidated hand-off is `docs/claude-pending-work.md`. Public showcase eligibility still requires real catalogue rows; no demonstration prices or cards are added. No publishing, database execution or cron changes are authorised for Part 17.

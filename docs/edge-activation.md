# EDGE activation

Display name: **EDGE**. Catalogue/provider ID: `sports-blood-tests`.

## Claude hand-off

No database changes were applied in this task. The owner confirmed on 07/11/2026 that EDGE uses CQC-regulated clinics; this is partner-clinic confirmation, not a claim that EDGE itself is regulated. Record that date and the actual laboratory identity/accreditation evidence before activation. Apply, in order, after checking live migration state and completing the evidence record:

1. `20261106234500_onboard_sports_blood_tests.sql` (existing draft onboarding).
2. `20261107001500_edge_exact_prices_and_name.sql` (12 exact prices, provider-verbatim descriptions and biomarkers, missing Advanced Testosterone, EDGE view label; no TEC calculation changes).
3. `20261107001600_edge_provider_articles.sql` (24 articles with publication dates verified from individual source JSON-LD).

Check view price parity before/after: only EDGE source prices should change; existing providers' displayed prices must remain identical. Regenerate Supabase types and run advisors/parity checks after application.

## Refreshes

- `.github/workflows/edge-price-sync.yml`: four runs daily, at 00:32, 06:32, 12:32 and 18:32 UTC. GitHub schedules can be delayed; six-hourly is the requested cadence, not a timing guarantee.
- Requires repository `SUPABASE_SERVICE_ROLE_KEY` secret, as the existing article workflow does; never expose it in browser code.
- Run manually after onboarding, confirm a successful `scrape_runs` entry, inspect data-quality views and five public catalogue rows, then verify homepage card prices.
- New fixed products are discovered from the provider's blood-test index. Removed index links are only deactivated after their page returns 404/410. Failed discovery/parsing preserves existing catalogue data.
- Product prices come exclusively from `#p-price-normal`, not navigation's bespoke offer from £35. Build-your-own is variable-priced and is not represented as a fixed-price kit.
- EDGE biomarker articles use the existing daily article workflow. Real article pictures take priority; the generic EDGE icon is rejected and the existing labelled topic illustrations remain the fallback.

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

## Outstanding verification

The read-only database check found no EDGE catalogue rows. Live scheduling, successful write logs, public article/card readback and accreditation flags cannot be marked verified until activation. No publish was performed.

The refreshed consolidated hand-off is `docs/claude-pending-work.md`. The preview now includes EDGE in the shared nine-provider directory/partner roster and removes the upper showcase's eight-card cap. Both showcases still require real eligible EDGE rows; no demonstration cards or prices were added.
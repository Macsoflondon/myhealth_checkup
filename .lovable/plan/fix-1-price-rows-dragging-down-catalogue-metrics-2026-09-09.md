# Fix £1 price rows dragging down catalogue metrics

## What I found

- There are **no active £1 rows right now** — the earlier cleanup worked. But **136 inactive junk rows** remain in `provider_tests`, all `medical-diagnosis`, priced £0–£1: legacy `2101-xx` profile codes plus a few real-named tests (e.g. Stool Bacteria and Parasites PCR, Chlamydia Trachomatis PCR) scraped 2026-07-21 with no real price.
- These rows still pollute any aggregate over the whole table (platform health / business summary averages, per-provider completeness), and they can be **reactivated by the next scraper run**: `upsertWithProvenance` inserts every scraped row with `is_active: true` regardless of price, so a re-scrape that emits a £0/£1 product puts it live again.
- The live site is not currently affected: `ProviderComparisonPage` avg price filters `is_active = true`, and no admin page displays `field_completeness_score`.

## The fix

1. **Migration: delete the 136 junk rows permanently.**
   - Delete `provider_test_history` snapshots referencing them first (FK), then delete the `provider_tests` rows where `provider_id = 'medical-diagnosis' AND price <= 1 AND is_active = false`.
   - This removes them from every aggregate, including the MCP summary tools.

2. **Guard the write path so junk can't come back** (`supabase/functions/_shared/scrape/upsertWithProvenance.ts`):
   - On insert: if `price !== null && price <= 1`, insert with `is_active: false` and flag a warning (`suspicious_price`) instead of going live.
   - On update: never set `is_active: true` for a row whose incoming price is ≤ £1 (update path already doesn't force activation — verified).
   - Add the warning to the returned `warnings` array so scrape runs surface it in `scrape_run_log`.

3. **Deploy** the updated shared scraper module (it ships with the scraper functions) and run the migration.

## Verification

- Re-query: zero rows with `price <= 1` remain; active catalogue count and average price unchanged (no active rows are touched).
- Dry-check the guard logic compiles (`deno check` on the shared module if available, else rely on build).
- Confirm `scrape_runs`/dashboard flows unaffected since update-path behaviour is unchanged for legitimate prices.

## Notes

- Medical Diagnosis synthetic parent groups (`meddiag-parent-*`, `price: null`) are **not** touched — null price is legitimate "price on enquiry" handling; only £0–£1 numeric prices are treated as junk.
- No frontend changes needed.

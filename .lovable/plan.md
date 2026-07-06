## Plan

Invoke the `trigger-all-scrapers` edge function once with the service role, then report the resulting null-count deltas.

### Steps

1. **Trigger** via `supabase.functions.invoke('trigger-all-scrapers')` from the sandbox using the service role key (same pattern that fixed the Vault sync earlier). Wait for the response.
2. **Poll `scrape_run_log`** for the three provider runs (`medichecks-firecrawl`, `clinilabs-scraper`, `lola-health-scraper`) until each reports `completed` or `failed`, or 3 min elapses.
3. **Query `provider_tests`** for each of the three providers and report:
   - Rows with `image_url IS NULL` (before → after)
   - Rows with `biomarker_count IS NULL` (before → after)
   - % of previously-null rows now populated

### Not touching

- No code changes to scrapers, pricing, category, or dedupe logic.
- No changes to Vault or auth helpers — those were fixed in the previous turn.

### If a scraper 500s

Report the error surface from `scrape_run_log.error_message` / edge function logs and stop — don't attempt fixes without a fresh request.

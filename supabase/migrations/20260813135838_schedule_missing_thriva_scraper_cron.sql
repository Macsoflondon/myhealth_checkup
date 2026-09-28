-- Restored verbatim from supabase_migrations.schema_migrations (version 20260813135838, name schedule_missing_thriva_scraper_cron).
-- md5 of the recorded statements: bf047b1eb727f66dbf3292214063d417
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- Thriva's replacement scraper (mhc-thriva-scrape) was deployed but never scheduled,
-- unlike its 8 sibling mhc-* scrapers which all run every 6 hours. This is the direct
-- cause of Thriva's provider_tests rows (14 active, 100% missing turnaround) going stale
-- since 2026-08-06. Wire it into the same 6-hourly cadence, same shared-secret auth
-- pattern, same timeout as its siblings (see mhc-randox / mhc-lml jobs).
select cron.schedule(
  'mhc-thriva',
  '18 */6 * * *',
  $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-thriva-scrape?secret=mhc-sync-7f3a91', timeout_milliseconds:=120000)$$
);

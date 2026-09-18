-- Thriva's replacement scraper (mhc-thriva-scrape) was deployed but never scheduled,
-- unlike its 8 sibling mhc-* scrapers which all run every 6 hours. This is the direct
-- cause of Thriva's provider_tests rows (14 active, 100% missing turnaround) going stale
-- since 2026-08-06. Wire it into the same 6-hourly cadence, same shared-secret auth
-- pattern, same timeout as its siblings (see mhc-randox / mhc-lml jobs).
-- REDACTED BY CLAUDE (2026-09-14): the original migration recorded in production hardcodes
-- a live shared secret in this URL. It is intentionally NOT reproduced here to avoid
-- committing a live credential to git. See docs/PHASE_0_AUDIT_WORKLIST.md -- this secret
-- should be rotated and moved to Vault/env config rather than embedded in cron job SQL.
select cron.schedule(
  'mhc-thriva',
  '18 */6 * * *',
  $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-thriva-scrape?secret=REDACTED_ROTATE_THIS_SECRET', timeout_milliseconds:=120000)$$
);
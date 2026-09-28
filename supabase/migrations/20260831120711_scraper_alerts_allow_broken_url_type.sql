-- Restored verbatim from supabase_migrations.schema_migrations (version 20260831120711, name scraper_alerts_allow_broken_url_type).
-- md5 of the recorded statements: 830179c7256c8c08951b15153704086f
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- scrape-and-verify's new alerting was silently dropping every row: the
-- check constraint on alert_type only allowed the original four values from
-- the price/volume-anomaly alerting this table was built for. broken_url is
-- a genuinely distinct category (a dead product link, not a scrape failure
-- or a count anomaly), so it's added rather than overloaded onto
-- scrape_failed.

ALTER TABLE public.scraper_alerts
  DROP CONSTRAINT scraper_alerts_alert_type_check,
  ADD CONSTRAINT scraper_alerts_alert_type_check
  CHECK (alert_type = ANY (ARRAY['below_floor','sudden_drop','scrape_failed','no_data','broken_url']));

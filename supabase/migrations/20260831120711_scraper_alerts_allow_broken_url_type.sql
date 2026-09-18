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
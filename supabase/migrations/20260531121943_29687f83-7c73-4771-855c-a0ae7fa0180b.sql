-- Nightly full re-scrape of all providers. run-all-scrapers chains
-- scrape-popular-tests + sanitize_popular_provider_tests at the end.
-- Uses the service role bearer for invocation (same pattern as
-- trigger-all-scrapers); pg_net + pg_cron are already enabled.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'run-all-scrapers-nightly') THEN
    PERFORM cron.unschedule('run-all-scrapers-nightly');
  END IF;
END$$;

SELECT cron.schedule(
  'run-all-scrapers-nightly',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/trigger-all-scrapers',
    headers := '{"Content-Type":"application/json"}'::jsonb,
    body := jsonb_build_object('scheduled', true, 'time', now())
  );
  $$
);
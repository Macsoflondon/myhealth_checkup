-- Remove any existing MHC scrape schedules so this migration is idempotent
DO $$
DECLARE
  j record;
BEGIN
  FOR j IN
    SELECT jobname FROM cron.job
    WHERE jobname IN ('mhc-nightly-scrape-all', 'mhc-nightly-scrape-health-check')
  LOOP
    PERFORM cron.unschedule(j.jobname);
  END LOOP;
END $$;

-- Nightly: run all scrapers at 02:30 UTC
SELECT cron.schedule(
  'mhc-nightly-scrape-all',
  '30 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/run-all-scrapers',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdnVpb2Fnc2dmYWR5bnV2b2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQ1MDcsImV4cCI6MjA2ODA4MDUwN30.N_ddGrc6YhEYnINwofAI-SNOtsxZr5D-dLVuA5TZEBM"}'::jsonb,
    body := jsonb_build_object('scheduled', true, 'time', now())
  );
  $$
);

-- 30 minutes later: run scraper-health-check at 03:00 UTC
SELECT cron.schedule(
  'mhc-nightly-scrape-health-check',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/scraper-health-check',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdnVpb2Fnc2dmYWR5bnV2b2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQ1MDcsImV4cCI6MjA2ODA4MDUwN30.N_ddGrc6YhEYnINwofAI-SNOtsxZr5D-dLVuA5TZEBM"}'::jsonb,
    body := jsonb_build_object('scheduled', true, 'time', now())
  );
  $$
);
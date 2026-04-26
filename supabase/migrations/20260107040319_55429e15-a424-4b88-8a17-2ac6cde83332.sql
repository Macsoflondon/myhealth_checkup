-- Remove old individual scraper cron jobs
SELECT cron.unschedule('scrape-medichecks-every-6-hours');
SELECT cron.unschedule('scrape-london-lab-every-6-hours');
SELECT cron.unschedule('scrape-goodbody-every-6-hours');

-- Create new unified scraper schedule at 06:00 UTC daily
SELECT cron.schedule(
  'run-all-scrapers-morning',
  '0 6 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/run-all-scrapers',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdnVpb2Fnc2dmYWR5bnV2b2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQ1MDcsImV4cCI6MjA2ODA4MDUwN30.N_ddGrc6YhEYnINwofAI-SNOtsxZr5D-dLVuA5TZEBM"}'::jsonb,
        body:='{"replace": true}'::jsonb
    ) as request_id;
  $$
);

-- Create new unified scraper schedule at 14:00 UTC daily
SELECT cron.schedule(
  'run-all-scrapers-afternoon',
  '0 14 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/run-all-scrapers',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdnVpb2Fnc2dmYWR5bnV2b2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQ1MDcsImV4cCI6MjA2ODA4MDUwN30.N_ddGrc6YhEYnINwofAI-SNOtsxZr5D-dLVuA5TZEBM"}'::jsonb,
        body:='{"replace": true}'::jsonb
    ) as request_id;
  $$
);
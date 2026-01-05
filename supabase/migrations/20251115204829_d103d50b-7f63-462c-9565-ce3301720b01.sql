-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule Medichecks scraper to run every 6 hours
SELECT cron.schedule(
  'scrape-medichecks-every-6-hours',
  '0 */6 * * *', -- At minute 0 past every 6th hour
  $$
  SELECT
    net.http_post(
        url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/scrape-medichecks',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdnVpb2Fnc2dmYWR5bnV2b2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQ1MDcsImV4cCI6MjA2ODA4MDUwN30.N_ddGrc6YhEYnINwofAI-SNOtsxZr5D-dLVuA5TZEBM"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Schedule London Medical Laboratory scraper to run every 6 hours (offset by 2 hours)
SELECT cron.schedule(
  'scrape-london-lab-every-6-hours',
  '0 2,8,14,20 * * *', -- At minute 0 past hour 2, 8, 14, and 20
  $$
  SELECT
    net.http_post(
        url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/scrape-london-lab',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdnVpb2Fnc2dmYWR5bnV2b2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQ1MDcsImV4cCI6MjA2ODA4MDUwN30.N_ddGrc6YhEYnINwofAI-SNOtsxZr5D-dLVuA5TZEBM"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Schedule Goodbody scraper to run every 6 hours (offset by 4 hours)
SELECT cron.schedule(
  'scrape-goodbody-every-6-hours',
  '0 4,10,16,22 * * *', -- At minute 0 past hour 4, 10, 16, and 22
  $$
  SELECT
    net.http_post(
        url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/goodbody-scraper',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdnVpb2Fnc2dmYWR5bnV2b2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQ1MDcsImV4cCI6MjA2ODA4MDUwN30.N_ddGrc6YhEYnINwofAI-SNOtsxZr5D-dLVuA5TZEBM"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);
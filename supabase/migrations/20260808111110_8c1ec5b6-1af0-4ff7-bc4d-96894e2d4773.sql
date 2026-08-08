CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.unschedule('aggregate-provider-blogs')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'aggregate-provider-blogs');

SELECT cron.schedule(
  'aggregate-provider-blogs',
  '0 4 * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--37e227e1-0d67-4515-b064-99c243036534.lovable.app/api/public/blog-aggregate',
    headers := '{"Content-Type": "application/json", "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdnVpb2Fnc2dmYWR5bnV2b2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQ1MDcsImV4cCI6MjA2ODA4MDUwN30.N_ddGrc6YhEYnINwofAI-SNOtsxZr5D-dLVuA5TZEBM"}'::jsonb,
    body := '{"source": "pg_cron"}'::jsonb,
    timeout_milliseconds := 300000
  );
  $$
);
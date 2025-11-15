-- Schedule price alert checker to run every 6 hours
SELECT cron.schedule(
  'check-price-alerts-every-6-hours',
  '0 1,7,13,19 * * *', -- At minute 0 past hour 1, 7, 13, and 19
  $$
  SELECT
    net.http_post(
        url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/price-alert-checker',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdnVpb2Fnc2dmYWR5bnV2b2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQ1MDcsImV4cCI6MjA2ODA4MDUwN30.N_ddGrc6YhEYnINwofAI-SNOtsxZr5D-dLVuA5TZEBM"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove any prior job with the same name to keep this idempotent.
DO $$
BEGIN
  PERFORM cron.unschedule('security-scan-snapshot-hourly');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

SELECT cron.schedule(
  'security-scan-snapshot-hourly',
  '7 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/security-scan-snapshot',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdnVpb2Fnc2dmYWR5bnV2b2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQ1MDcsImV4cCI6MjA2ODA4MDUwN30.N_ddGrc6YhEYnINwofAI-SNOtsxZr5D-dLVuA5TZEBM"}'::jsonb,
    body := '{"trigger":"cron"}'::jsonb
  );
  $$
);

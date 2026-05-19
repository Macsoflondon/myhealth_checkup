SELECT cron.schedule(
  'verify-provider-images-weekly',
  '15 3 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/verify-provider-images',
    headers := '{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdnVpb2Fnc2dmYWR5bnV2b2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQ1MDcsImV4cCI6MjA2ODA4MDUwN30.N_ddGrc6YhEYnINwofAI-SNOtsxZr5D-dLVuA5TZEBM"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
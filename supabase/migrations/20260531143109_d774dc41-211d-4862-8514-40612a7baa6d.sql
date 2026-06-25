-- Unique constraint required by promote upsert
CREATE UNIQUE INDEX IF NOT EXISTS uq_provider_test_mapping_provider_master
  ON public.provider_test_mapping(provider_id, test_master_id);

-- Schedule twice-daily scrape + verify
SELECT cron.schedule(
  'scrape-and-verify-twice-daily',
  '0 6,18 * * *',
  $$
  SELECT net.http_post(
    url := 'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/scrape-and-verify',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := '{}'::jsonb
  );
  $$
);
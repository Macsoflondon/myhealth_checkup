-- Permanent fix for the link-verification gap: scrape-and-verify existed,
-- was already provider-agnostic (derives providers dynamically, so all 8 —
-- including lola-health, which had never been checked — are covered
-- automatically), but had no schedule at all. Runs daily at 05:15, after
-- the last 6-hourly scrape cycle of the previous day and before business
-- hours, using the same working call_edge_with_service_role pattern as the
-- two functions fixed earlier today.

SELECT cron.schedule(
  'url-verification-daily',
  '15 5 * * *',
  $$
    SELECT public.call_edge_with_service_role(
      'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/scrape-and-verify',
      '{}'::jsonb
    );
  $$
);
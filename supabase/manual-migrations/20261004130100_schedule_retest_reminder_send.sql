-- Daily retest reminder dispatch at 08:00 Europe/London.
-- pg_cron runs in UTC, so the job fires at 07:00 and 08:00 UTC and only makes
-- the call when it is 08:00 in London (BST: 07:00 UTC, GMT: 08:00 UTC).
-- Uses the vault-backed call_edge_with_service_role helper: no plaintext key
-- in cron.job. The sender is an app server route (new Supabase edge functions
-- are not used on this stack); it checks Bearer <service role key>.

SELECT cron.unschedule('retest-reminder-send-daily')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'retest-reminder-send-daily');

SELECT cron.schedule(
  'retest-reminder-send-daily',
  '0 7,8 * * *',
  $$
    SELECT public.call_edge_with_service_role(
      'https://project--37e227e1-0d67-4515-b064-99c243036534.lovable.app/api/public/retest-reminder/send',
      '{}'::jsonb
    )
    WHERE extract(hour FROM (now() AT TIME ZONE 'Europe/London')) = 8;
  $$
);

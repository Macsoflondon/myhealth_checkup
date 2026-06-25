create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Remove any prior schedule to keep this idempotent
do $$
declare jid int;
begin
  for jid in select jobid from cron.job where jobname = 'gsc-resubmit-sitemap-daily'
  loop perform cron.unschedule(jid); end loop;
end $$;

select cron.schedule(
  'gsc-resubmit-sitemap-daily',
  '0 6 * * *',
  $$
  select net.http_post(
    url := 'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/gsc-resubmit-sitemap',
    headers := '{"Content-Type":"application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
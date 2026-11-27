-- Platform screening, 27 Nov 2026: EDGE prices refresh from Supabase.
--
-- The GitHub workflow edge-price-sync.yml failed on every run from 22:10 UTC
-- on 7 Nov 2026 with "EDGE source HTTP 403": sportsbloodtests.co.uk refuses
-- GitHub's runner addresses, so EDGE prices were not refreshed for 20 days.
-- The edge function mhc-edge-sync (Lovable part 15) now does the same work
-- from Supabase, which EDGE accepts. This migration schedules it six-hourly
-- at minute 32 in the same header form as the other price jobs, and adds it
-- to mhc_price_sync_jobs() so the admin manual price sync covers EDGE too.

create or replace function public.mhc_price_sync_jobs()
returns table (provider_id text, job_name text, reads_shopify_feed boolean)
language sql
immutable
set search_path = public
as $$
  values
    ('medichecks', 'mhc-medichecks-p1', true),
    ('medichecks', 'mhc-medichecks-p2', true),
    ('medichecks', 'mhc-medichecks-p3', true),
    ('clinilabs', 'mhc-clinilabs', true),
    ('lola-health', 'mhc-lola', true),
    ('goodbody-clinic', 'mhc-goodbody', true),
    ('london-health-company', 'mhc-london-health', true),
    ('randox', 'mhc-randox', false),
    ('medical-diagnosis', 'mhc-medical-diagnosis-b1', false),
    ('medical-diagnosis', 'mhc-medical-diagnosis-b2', false),
    ('medical-diagnosis', 'mhc-medical-diagnosis-b3', false),
    ('medical-diagnosis', 'mhc-medical-diagnosis-b4', false),
    ('medical-diagnosis', 'mhc-medical-diagnosis-b5', false),
    ('london-medical-laboratory', 'mhc-lml', false),
    ('sports-blood-tests', 'mhc-edge', false)
$$;

revoke all on function public.mhc_price_sync_jobs() from public, anon, authenticated;
grant execute on function public.mhc_price_sync_jobs() to service_role;

select cron.schedule('mhc-edge', '32 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-edge-sync?provider=sports-blood-tests', headers:=jsonb_build_object('x-mhc-sync-secret', public.mhc_sync_secret()), timeout_milliseconds:=120000)$$);

do $$
begin
  if not public.mhc_is_price_sync_command((select command from cron.job where jobname = 'mhc-edge')) then
    raise exception 'mhc-edge is not in the price sync header form';
  end if;
end;
$$;

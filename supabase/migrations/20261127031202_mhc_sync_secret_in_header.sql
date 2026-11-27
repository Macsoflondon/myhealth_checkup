-- Platform screening, 27 Nov 2026: the sync secret moves from the URL into
-- the x-mhc-sync-secret request header (step 2 of 3).
--
-- Supabase's function_edge_logs store the full query string of every request,
-- so each scheduled run wrote ?secret=<mhc_sync_secret> into the logs in plain
-- text. The edge logs keep only a fixed set of request headers, and
-- x-mhc-sync-secret is not one of them. The functions read the header since
-- commit ea99e44 (part 10). Step 3 removes the ?secret= fallback from the
-- functions and replaces the secret.
--
-- Every job keeps its name, schedule and query parameters. The secret is read
-- inside the database through public.mhc_sync_secret(), the same function the
-- edge functions call, so the jobs and the functions share one value.
--
-- mhc_process_manual_runs() replays a job's own command only when
-- mhc_is_price_sync_command() accepts it, so the check changes to the new
-- shape in the same migration. randox-kit-images is not a price sync and stays
-- outside that check, as before.

create or replace function public.mhc_is_price_sync_command(p_command text)
returns boolean
language sql
immutable
set search_path = public
as $$
  select coalesce(p_command ~ ('^select net\.http_get\(url:=''https://clvuioagsgfadynuvodj\.supabase\.co/functions/v1/mhc-[a-z-]+\?[a-z0-9=&-]+'', '
    || 'headers:=jsonb_build_object\(''x-mhc-sync-secret'', public\.mhc_sync_secret\(\)\), timeout_milliseconds:=120000\)$'), false)
$$;

revoke all on function public.mhc_is_price_sync_command(text) from public, anon, authenticated;
grant execute on function public.mhc_is_price_sync_command(text) to service_role;

select cron.schedule('mhc-medichecks-p1', '0 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-medichecks-sync?page=1', headers:=jsonb_build_object('x-mhc-sync-secret', public.mhc_sync_secret()), timeout_milliseconds:=120000)$$);
select cron.schedule('mhc-medichecks-p2', '2 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-medichecks-sync?page=2', headers:=jsonb_build_object('x-mhc-sync-secret', public.mhc_sync_secret()), timeout_milliseconds:=120000)$$);
select cron.schedule('mhc-medichecks-p3', '4 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-medichecks-sync?page=3', headers:=jsonb_build_object('x-mhc-sync-secret', public.mhc_sync_secret()), timeout_milliseconds:=120000)$$);
select cron.schedule('mhc-clinilabs', '6 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-shopify-sync?provider=clinilabs&page=1', headers:=jsonb_build_object('x-mhc-sync-secret', public.mhc_sync_secret()), timeout_milliseconds:=120000)$$);
select cron.schedule('mhc-lola', '8 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-shopify-sync?provider=lola-health&page=1', headers:=jsonb_build_object('x-mhc-sync-secret', public.mhc_sync_secret()), timeout_milliseconds:=120000)$$);
select cron.schedule('mhc-goodbody', '10 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-shopify-rich-sync?provider=goodbody-clinic', headers:=jsonb_build_object('x-mhc-sync-secret', public.mhc_sync_secret()), timeout_milliseconds:=120000)$$);
select cron.schedule('mhc-london-health', '12 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-shopify-rich-sync?provider=london-health-company', headers:=jsonb_build_object('x-mhc-sync-secret', public.mhc_sync_secret()), timeout_milliseconds:=120000)$$);
select cron.schedule('mhc-randox', '14 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-randox-scrape?limit=40', headers:=jsonb_build_object('x-mhc-sync-secret', public.mhc_sync_secret()), timeout_milliseconds:=120000)$$);
select cron.schedule('mhc-medical-diagnosis-b1', '16 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-page-scrape?provider=medical-diagnosis&offset=0&limit=30', headers:=jsonb_build_object('x-mhc-sync-secret', public.mhc_sync_secret()), timeout_milliseconds:=120000)$$);
select cron.schedule('mhc-medical-diagnosis-b2', '19 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-page-scrape?provider=medical-diagnosis&offset=30&limit=30', headers:=jsonb_build_object('x-mhc-sync-secret', public.mhc_sync_secret()), timeout_milliseconds:=120000)$$);
select cron.schedule('mhc-medical-diagnosis-b3', '22 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-page-scrape?provider=medical-diagnosis&offset=60&limit=30', headers:=jsonb_build_object('x-mhc-sync-secret', public.mhc_sync_secret()), timeout_milliseconds:=120000)$$);
select cron.schedule('mhc-medical-diagnosis-b4', '25 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-page-scrape?provider=medical-diagnosis&offset=90&limit=30', headers:=jsonb_build_object('x-mhc-sync-secret', public.mhc_sync_secret()), timeout_milliseconds:=120000)$$);
select cron.schedule('mhc-medical-diagnosis-b5', '28 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-page-scrape?provider=medical-diagnosis&offset=120&limit=30', headers:=jsonb_build_object('x-mhc-sync-secret', public.mhc_sync_secret()), timeout_milliseconds:=120000)$$);
select cron.schedule('mhc-lml', '20 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-lml-scrape?limit=40', headers:=jsonb_build_object('x-mhc-sync-secret', public.mhc_sync_secret()), timeout_milliseconds:=120000)$$);
select cron.schedule('randox-kit-images', '34 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/randox-kit-images', headers:=jsonb_build_object('x-mhc-sync-secret', public.mhc_sync_secret()), timeout_milliseconds:=120000)$$);

-- Fail the migration if any of the 14 price sync jobs no longer passes the
-- check, or if any job still puts the secret in a URL.
do $$
declare
  v_bad text;
begin
  select string_agg(p.job_name, ', ')
    into v_bad
    from public.mhc_price_sync_jobs() p
    left join cron.job j on j.jobname = p.job_name
   where j.command is null or not public.mhc_is_price_sync_command(j.command);
  if v_bad is not null then
    raise exception 'price sync jobs not in the header form: %', v_bad;
  end if;
  if exists (select 1 from cron.job where command like '%?secret=%' or command like '%&secret=%') then
    raise exception 'a cron job still sends a secret in its URL';
  end if;
end;
$$;

-- Manual price sync from Crux Control, through the live mhc-* pipeline.
--
-- The Scrapers, Data refresh and Crawls buttons used to call the older
-- run-all-scrapers / *-scraper functions, which no cron job uses and which
-- write to scraping_jobs rather than scrape_runs. The prices visitors see come
-- from the mhc-* jobs that pg_cron runs every six hours. This migration lets
-- an admin queue those same jobs by hand:
--
--   admin_request_price_sync(provider or null for all)  admin + MFA only
--   admin_price_sync_status()                           admin + MFA only
--   mhc_process_manual_runs()                           cron, every minute
--
-- A manual run replays each job's own cron.job command, so it sends exactly
-- the request the schedule sends, with the Vault secret read inside the
-- database. The browser never sees the secret. Jobs keep the spacing their
-- schedules give them (Medical Diagnosis batches three minutes apart,
-- Medichecks pages two minutes apart), and the Shopify-fed jobs wait two
-- minutes for a fresh database copy of their feeds when the last copy is
-- more than 100 minutes old (mhc_feed_page() only serves copies under two
-- hours old). A provider cannot be queued again within 15 minutes of a
-- manual request or of its last recorded run.

create table if not exists public.mhc_manual_runs (
  id bigint generated always as identity primary key,
  provider_id text not null,
  job_name text not null,
  requested_by uuid,
  requested_at timestamptz not null default now(),
  run_after timestamptz not null,
  sent_at timestamptz,
  request_id bigint,
  error text
);

create index if not exists mhc_manual_runs_provider_idx
  on public.mhc_manual_runs (provider_id, requested_at desc);
create index if not exists mhc_manual_runs_pending_idx
  on public.mhc_manual_runs (run_after) where sent_at is null;

alter table public.mhc_manual_runs enable row level security;
revoke all on public.mhc_manual_runs from anon, authenticated;
grant all on public.mhc_manual_runs to service_role;

comment on table public.mhc_manual_runs is
  'Price sync jobs an admin queued from Crux Control. Written by admin_request_price_sync(), sent by mhc_process_manual_runs().';

-- Which scheduled jobs make up each provider's price sync, and whether the job
-- reads a Shopify feed (and so needs the database copy of it).
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
    ('london-medical-laboratory', 'mhc-lml', false)
$$;

revoke all on function public.mhc_price_sync_jobs() from public, anon, authenticated;
grant execute on function public.mhc_price_sync_jobs() to service_role;

-- True only for the exact shape every mhc-* sync job has: one GET to an mhc-*
-- edge function on this project, with the Vault secret and plain query
-- parameters. Anything else in cron.job is never replayed.
create or replace function public.mhc_is_price_sync_command(p_command text)
returns boolean
language sql
immutable
set search_path = public
as $$
  select coalesce(p_command ~ ('^select net\.http_get\(url:=''https://clvuioagsgfadynuvodj\.supabase\.co/functions/v1/mhc-[a-z-]+\?secret='''
    || ' \|\| \(select decrypted_secret from vault\.decrypted_secrets where name=''mhc_sync_secret''\) \|\| '
    || '''[a-z0-9=&-]+'', timeout_milliseconds:=120000\)$'), false)
$$;

revoke all on function public.mhc_is_price_sync_command(text) from public, anon, authenticated;
grant execute on function public.mhc_is_price_sync_command(text) to service_role;

-- Sends every queued job that is due. Runs every minute from cron and once
-- straight after each request, so jobs due now go out at once.
create or replace function public.mhc_process_manual_runs()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
  v_command text;
  v_request bigint;
  v_sent integer := 0;
begin
  for r in
    select m.id, m.job_name
    from public.mhc_manual_runs m
    where m.sent_at is null and m.run_after <= now()
    order by m.run_after, m.id
    for update skip locked
  loop
    select j.command into v_command from cron.job j where j.jobname = r.job_name;
    if v_command is null or not public.mhc_is_price_sync_command(v_command) then
      update public.mhc_manual_runs
        set sent_at = now(), error = 'The scheduled job is missing or is not a price sync request.'
        where id = r.id;
      continue;
    end if;
    execute v_command into v_request;
    update public.mhc_manual_runs set sent_at = now(), request_id = v_request where id = r.id;
    v_sent := v_sent + 1;
  end loop;
  return v_sent;
end;
$$;

revoke all on function public.mhc_process_manual_runs() from public, anon, authenticated;
grant execute on function public.mhc_process_manual_runs() to service_role;

-- Queues a price sync for one provider, or every provider when p_provider is
-- null. Returns what was queued and what was skipped, with the reason.
create or replace function public.admin_request_price_sync(p_provider text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_now timestamptz := now();
  v_providers text[];
  v_eligible text[] := '{}';
  v_skipped jsonb := '[]'::jsonb;
  v_queued jsonb := '[]'::jsonb;
  v_feed_refresh boolean := false;
  v_feed_base timestamptz := now();
  v_min_minute integer;
  v_provider text;
  v_pending integer;
  v_last_request timestamptz;
  v_last_run timestamptz;
  v_oldest_feed timestamptz;
  v_feed_pages integer;
begin
  if not public.has_role(v_uid, 'admin') then
    raise exception 'Admin role required' using errcode = '42501';
  end if;

  if p_provider is null then
    select array_agg(distinct j.provider_id order by j.provider_id) into v_providers
    from public.mhc_price_sync_jobs() j;
  elsif exists (select 1 from public.mhc_price_sync_jobs() j where j.provider_id = p_provider) then
    v_providers := array[p_provider];
  else
    raise exception 'Unknown provider: %', p_provider using errcode = '22023';
  end if;

  foreach v_provider in array v_providers loop
    select count(*) filter (where m.sent_at is null), max(m.requested_at)
      into v_pending, v_last_request
      from public.mhc_manual_runs m where m.provider_id = v_provider;
    select max(s.started_at) into v_last_run
      from public.scrape_runs s where s.provider_id = v_provider;

    if v_pending > 0 then
      v_skipped := v_skipped || jsonb_build_object('provider_id', v_provider,
        'reason', 'A manual sync is already queued.');
    elsif v_last_request > v_now - interval '15 minutes' then
      v_skipped := v_skipped || jsonb_build_object('provider_id', v_provider,
        'reason', format('A manual sync was requested at %s. Try again after %s.',
          to_char(v_last_request at time zone 'Europe/London', 'HH24:MI'),
          to_char((v_last_request + interval '15 minutes') at time zone 'Europe/London', 'HH24:MI')));
    elsif v_last_run > v_now - interval '15 minutes' then
      v_skipped := v_skipped || jsonb_build_object('provider_id', v_provider,
        'reason', format('Prices were synced at %s. Try again after %s.',
          to_char(v_last_run at time zone 'Europe/London', 'HH24:MI'),
          to_char((v_last_run + interval '15 minutes') at time zone 'Europe/London', 'HH24:MI')));
    else
      v_eligible := v_eligible || v_provider;
    end if;
  end loop;

  if cardinality(v_eligible) = 0 then
    return jsonb_build_object('queued', v_queued, 'skipped', v_skipped, 'feeds_refreshing', false);
  end if;

  if exists (
    select 1 from public.mhc_price_sync_jobs() j
    where j.provider_id = any (v_eligible) and j.reads_shopify_feed
  ) then
    select min(f.requested_at), count(*) into v_oldest_feed, v_feed_pages
      from public.mhc_feed_requests f;
    if v_feed_pages < 9 or v_oldest_feed < v_now - interval '100 minutes' then
      perform public.mhc_prefetch_shopify_feeds();
      v_feed_refresh := true;
      v_feed_base := v_now + interval '2 minutes';
    end if;
  end if;

  select min(split_part(c.schedule, ' ', 1)::integer) into v_min_minute
    from public.mhc_price_sync_jobs() j
    join cron.job c on c.jobname = j.job_name
    where j.provider_id = any (v_eligible);

  with ins as (
    insert into public.mhc_manual_runs (provider_id, job_name, requested_by, run_after)
    select j.provider_id, j.job_name, v_uid,
      (case when j.reads_shopify_feed then v_feed_base else v_now end)
        + make_interval(mins => split_part(c.schedule, ' ', 1)::integer - v_min_minute)
    from public.mhc_price_sync_jobs() j
    join cron.job c on c.jobname = j.job_name
    where j.provider_id = any (v_eligible)
    returning provider_id, run_after
  )
  select coalesce(jsonb_agg(jsonb_build_object(
      'provider_id', q.provider_id, 'jobs', q.jobs,
      'first_run_at', q.first_run_at, 'last_run_at', q.last_run_at)
      order by q.first_run_at, q.provider_id), '[]'::jsonb)
    into v_queued
    from (
      select provider_id, count(*) as jobs, min(run_after) as first_run_at, max(run_after) as last_run_at
      from ins group by provider_id
    ) q;

  -- Providers whose scheduled jobs no longer exist get nothing queued.
  select v_skipped || coalesce(jsonb_agg(jsonb_build_object('provider_id', e.p,
      'reason', 'Its scheduled sync job was not found.')), '[]'::jsonb)
    into v_skipped
    from unnest(v_eligible) as e(p)
    where not exists (select 1 from jsonb_array_elements(v_queued) x where x ->> 'provider_id' = e.p);

  perform public.mhc_process_manual_runs();

  return jsonb_build_object('queued', v_queued, 'skipped', v_skipped, 'feeds_refreshing', v_feed_refresh);
end;
$$;

revoke all on function public.admin_request_price_sync(text) from public, anon;
grant execute on function public.admin_request_price_sync(text) to authenticated, service_role;

-- One row per provider: the latest sync cycle (runs within 40 minutes of the
-- newest), the next scheduled start, queued manual jobs and how the latest
-- manual request went.
create or replace function public.admin_price_sync_status()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_result jsonb;
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Admin role required' using errcode = '42501';
  end if;

  with providers as (
    select j.provider_id, min(split_part(c.schedule, ' ', 1)::integer) as first_minute
    from public.mhc_price_sync_jobs() j
    left join cron.job c on c.jobname = j.job_name
    group by j.provider_id
  ),
  latest as (
    select s.provider_id, max(s.started_at) as newest
    from public.scrape_runs s
    join providers p on p.provider_id = s.provider_id
    group by s.provider_id
  ),
  cycle as (
    select s.provider_id,
      min(s.started_at) as started_at,
      max(s.finished_at) as finished_at,
      case
        when bool_or(s.status in ('error', 'failed')) then 'error'
        when bool_or(s.status = 'partial') then 'partial'
        when bool_and(s.status = 'success') then 'success'
        else max(s.status)
      end as status,
      sum(s.tests_seen) as tests_seen,
      sum(s.tests_updated) as tests_updated,
      sum(s.tests_new) as tests_new,
      sum(s.tests_deactivated) as tests_deactivated,
      sum(case when jsonb_typeof(s.errors) = 'array' then jsonb_array_length(s.errors) else 0 end) as errors,
      count(*) as runs
    from public.scrape_runs s
    join latest l on l.provider_id = s.provider_id
    where s.started_at >= l.newest - interval '40 minutes'
    group by s.provider_id
  ),
  manual as (
    select m.provider_id,
      count(*) filter (where m.sent_at is null) as queued_jobs,
      min(m.run_after) filter (where m.sent_at is null) as next_job_at,
      max(m.requested_at) as last_requested_at
    from public.mhc_manual_runs m
    group by m.provider_id
  ),
  last_batch as (
    select m.provider_id,
      count(*) filter (where m.error is not null
        or r.timed_out
        or (r.status_code is not null and r.status_code not between 200 and 299)) as failed_jobs,
      max(coalesce(m.error,
        case when r.timed_out then 'The request timed out.'
             when r.status_code not between 200 and 299 then format('The sync answered %s.', r.status_code)
        end)) as failure
    from public.mhc_manual_runs m
    join manual x on x.provider_id = m.provider_id and m.requested_at = x.last_requested_at
    left join net._http_response r on r.id = m.request_id
    group by m.provider_id
  ),
  active as (
    select t.provider_id, count(*) as active_tests
    from public.provider_tests t
    where t.is_active
    group by t.provider_id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
      'provider_id', p.provider_id,
      'active_tests', coalesce(a.active_tests, 0),
      'last_cycle', case when c.provider_id is null then null else jsonb_build_object(
        'status', c.status, 'started_at', c.started_at, 'finished_at', c.finished_at,
        'tests_seen', c.tests_seen, 'tests_updated', c.tests_updated, 'tests_new', c.tests_new,
        'tests_deactivated', c.tests_deactivated, 'errors', c.errors, 'runs', c.runs) end,
      'next_scheduled_at', case when p.first_minute is null then null else (
        select min(t) from (values
          (date_trunc('hour', now()) - make_interval(hours => extract(hour from now() at time zone 'UTC')::integer % 6)
            + make_interval(mins => p.first_minute)),
          (date_trunc('hour', now()) - make_interval(hours => extract(hour from now() at time zone 'UTC')::integer % 6)
            + make_interval(hours => 6, mins => p.first_minute))
        ) v(t) where t > now()) end,
      'queued_jobs', coalesce(m.queued_jobs, 0),
      'next_job_at', m.next_job_at,
      'last_requested_at', m.last_requested_at,
      'last_request_failed_jobs', coalesce(b.failed_jobs, 0),
      'last_request_failure', b.failure
    ) order by p.provider_id), '[]'::jsonb)
    into v_result
    from providers p
    left join cycle c on c.provider_id = p.provider_id
    left join manual m on m.provider_id = p.provider_id
    left join last_batch b on b.provider_id = p.provider_id
    left join active a on a.provider_id = p.provider_id;

  return v_result;
end;
$$;

revoke all on function public.admin_price_sync_status() from public, anon;
grant execute on function public.admin_price_sync_status() to authenticated, service_role;

-- lovable-cron-fallback-reviewed: a no-op select unless an admin has queued a
-- manual price sync; sends each queued job when its spacing says it is due.
select cron.unschedule('mhc-manual-runs')
where exists (select 1 from cron.job where jobname = 'mhc-manual-runs');

select cron.schedule('mhc-manual-runs', '* * * * *', $$select public.mhc_process_manual_runs()$$);

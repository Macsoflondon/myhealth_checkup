-- System health alerts: email when a platform system stops responding.
--
-- The site was unpublished from 10 to 14 October 2026 and the mhc-* price
-- sync answered 401 from 28 September to 14 October. The AI OS site-status
-- check logged the first outage every hour, but nothing told anyone. This
-- adds one health check, run by cron every ten minutes, that emails the
-- addresses in security_alert_recipients (alert types system_down and
-- system_recovered) through the existing security-alert-notify function.
--
-- What it watches:
--   site:<url>       the public site answers 200-399 with the real page
--                    (not Lovable's "No published build" placeholder). Probed
--                    directly by pg_net each run; down after two failures.
--   price_sync:<id>  each provider's mhc-* scraper wrote a success or
--                    partial scrape_runs row in the last 13 hours (two
--                    six-hourly cycles).
--   cron:<job>       the latest run of each active pg_cron job succeeded.
--   os_plugins_sync  the hourly AI OS sync logged a run in the last 3 hours.
--   plugin:<id>      each enabled AI OS plugin's last two syncs did not both
--                    fail (site_status is left to the site probes).
--   ai_engine        ai-human-context answers an anonymous POST with 401
--                    (configured, sign-in required) rather than 500 (OpenAI
--                    key missing). The probe never reaches OpenAI.
--
-- Each run evaluates the probe responses the previous run requested, then
-- requests new ones, so a site check reflects a response at most ten
-- minutes old. A check that turns down sends one email listing every check
-- that turned down in that run; a check still down 24 hours after its last
-- email is repeated in a reminder; a recovery sends one email. Alert emails
-- are best effort: a failed send is retried on the next run because
-- last_alerted_at is only set once the request is queued.

create table if not exists public.system_health_state (
  check_id text primary key,
  label text not null,
  status text not null default 'ok',
  detail text,
  consecutive_failures integer not null default 0,
  failing_since timestamptz,
  last_checked_at timestamptz,
  last_alerted_at timestamptz,
  constraint system_health_state_status_chk check (status in ('ok', 'down')),
  constraint system_health_state_detail_chk check (detail is null or char_length(detail) <= 1000)
);

alter table public.system_health_state enable row level security;
revoke all on public.system_health_state from anon, authenticated;
grant all on public.system_health_state to service_role;

comment on table public.system_health_state is
  'Current state of each system health check, written by system_health_check() every ten minutes.';

create table if not exists public.system_health_probes (
  probe_id text primary key,
  request_id bigint not null,
  requested_at timestamptz not null default now()
);

alter table public.system_health_probes enable row level security;
revoke all on public.system_health_probes from anon, authenticated;
grant all on public.system_health_probes to service_role;

comment on table public.system_health_probes is
  'pg_net request id of the latest HTTP probe for each probed check, read on the next system_health_check() run.';

create or replace function public.system_health_check()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_sites constant text[] := array[
    'https://www.myhealthcheckup.co.uk/',
    'https://myhealthcheckup.co.uk/'
  ];
  v_providers constant text[] := array[
    'medichecks', 'clinilabs', 'lola-health', 'goodbody-clinic',
    'london-health-company', 'randox', 'medical-diagnosis',
    'london-medical-laboratory'
  ];
  v_ai_url constant text :=
    'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/ai-human-context';
  v_notify_url constant text :=
    'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/security-alert-notify';
  v_url text;
  v_id text;
  v_probe record;
  v_resp record;
  v_ok boolean;
  v_detail text;
  v_down text[] := '{}';
  v_still text[] := '{}';
  v_up text[] := '{}';
  v_down_ids text[] := '{}';
  v_still_ids text[] := '{}';
  v_up_ids text[] := '{}';
  r record;
begin
  create temporary table if not exists pg_temp.health_results (
    check_id text primary key,
    label text not null,
    ok boolean,          -- null: no verdict this run (probe still pending)
    detail text,
    threshold integer not null default 1
  ) on commit drop;
  truncate pg_temp.health_results;

  -- 1. HTTP probes requested by the previous run.
  for v_probe in select * from public.system_health_probes loop
    select status_code, headers, content, timed_out, error_msg
      into v_resp
    from net._http_response where id = v_probe.request_id;

    if not found then
      -- Still pending, or pg_net already purged it.
      if v_probe.requested_at < v_now - interval '5 minutes' then
        v_ok := false;
        v_detail := 'No response within five minutes.';
      else
        v_ok := null;
        v_detail := null;
      end if;
    elsif v_resp.timed_out or v_resp.status_code is null then
      v_ok := false;
      v_detail := coalesce('The request failed: ' || left(v_resp.error_msg, 200), 'The request timed out.');
    elsif v_probe.probe_id = 'ai_engine' then
      -- 401 means the engine is configured and asks for sign-in; 500 means a
      -- missing key or setting.
      v_ok := v_resp.status_code in (200, 400, 401, 429);
      v_detail := case when v_ok then null
        else format('ai-human-context answered %s: %s', v_resp.status_code,
          left(regexp_replace(coalesce(v_resp.content, ''), '\s+', ' ', 'g'), 200)) end;
    else
      v_ok := v_resp.status_code between 200 and 399
        and coalesce(v_resp.headers->>'x-lovable-serve-error', v_resp.headers->>'X-Lovable-Serve-Error', '') = ''
        and coalesce(v_resp.content, '') !~* 'no published build';
      v_detail := case
        when v_ok then null
        when coalesce(v_resp.content, '') ~* 'no published build'
          or coalesce(v_resp.headers->>'x-lovable-serve-error', v_resp.headers->>'X-Lovable-Serve-Error', '') <> ''
          then format('The host answered %s: Lovable reports no published build. Republish the project in Lovable.', v_resp.status_code)
        else format('The host answered %s.', v_resp.status_code)
      end;
    end if;

    insert into pg_temp.health_results (check_id, label, ok, detail, threshold)
    values (
      v_probe.probe_id,
      case when v_probe.probe_id = 'ai_engine' then 'AI test finder (ai-human-context)'
        else 'Public site ' || substr(v_probe.probe_id, 6) end,
      v_ok, v_detail,
      2
    );
  end loop;

  -- 2. Request this run's probes.
  foreach v_url in array v_sites loop
    v_id := 'site:' || v_url;
    insert into public.system_health_probes (probe_id, request_id, requested_at)
    values (v_id, net.http_get(
        url := v_url,
        headers := jsonb_build_object('User-Agent', 'myhealthcheckup-health-check/1.0'),
        timeout_milliseconds := 30000), v_now)
    on conflict (probe_id) do update
      set request_id = excluded.request_id, requested_at = excluded.requested_at;
  end loop;
  insert into public.system_health_probes (probe_id, request_id, requested_at)
  values ('ai_engine', net.http_post(
      url := v_ai_url,
      body := '{}'::jsonb,
      headers := jsonb_build_object('Content-Type', 'application/json',
        'User-Agent', 'myhealthcheckup-health-check/1.0'),
      timeout_milliseconds := 30000), v_now)
  on conflict (probe_id) do update
    set request_id = excluded.request_id, requested_at = excluded.requested_at;

  -- 3. Price sync: a good scrape_runs row per provider in 13 hours.
  insert into pg_temp.health_results (check_id, label, ok, detail)
  select 'price_sync:' || p,
         'Price sync: ' || p,
         s.last_good is not null and s.last_good > v_now - interval '13 hours',
         case when s.last_good is null or s.last_good <= v_now - interval '13 hours'
           then format('No successful mhc-* sync since %s.',
             coalesce(to_char(s.last_good at time zone 'Europe/London', 'DD Mon YYYY HH24:MI'), 'records began'))
         end
  from unnest(v_providers) p
  left join lateral (
    select max(started_at) as last_good from public.scrape_runs
    where provider_id = p and status in ('success', 'partial')
      and started_at > v_now - interval '30 days'
  ) s on true;

  -- 4. Cron: the latest run of every active job that ran in the last 26 hours.
  insert into pg_temp.health_results (check_id, label, ok, detail)
  select 'cron:' || j.jobname,
         'Scheduled job ' || j.jobname,
         d.status = 'succeeded',
         case when d.status <> 'succeeded'
           then format('Last run at %s ended %s: %s',
             to_char(d.start_time at time zone 'Europe/London', 'DD Mon HH24:MI'),
             d.status, left(coalesce(d.return_message, ''), 300)) end
  from cron.job j
  join lateral (
    select status, start_time, return_message from cron.job_run_details
    where jobid = j.jobid order by start_time desc limit 1
  ) d on true
  where j.active and j.jobname is not null
    and d.start_time > v_now - interval '26 hours'
    and d.status in ('succeeded', 'failed');

  -- 5. AI OS hourly sync.
  insert into pg_temp.health_results (check_id, label, ok, detail)
  select 'os_plugins_sync', 'AI OS hourly sync',
         max(started_at) > v_now - interval '3 hours',
         case when coalesce(max(started_at), '-infinity') <= v_now - interval '3 hours'
           then format('No AI OS sync logged since %s.',
             coalesce(to_char(max(started_at) at time zone 'Europe/London', 'DD Mon HH24:MI'), 'records began')) end
  from public.os_plugin_sync_log;

  -- 6. Enabled AI OS plugins: down when the last two syncs both failed.
  insert into pg_temp.health_results (check_id, label, ok, detail)
  select 'plugin:' || s.plugin_id, 'AI OS plugin ' || s.plugin_id,
         not (count(*) = 2 and bool_and(l.status = 'error')),
         case when count(*) = 2 and bool_and(l.status = 'error')
           then left(max(l.message) filter (where l.rn = 1), 500) end
  from public.os_plugin_settings s
  join lateral (
    select status, message, row_number() over (order by started_at desc) rn
    from public.os_plugin_sync_log
    where plugin_id = s.plugin_id and status in ('ok', 'error')
    order by started_at desc limit 2
  ) l on true
  where s.enabled and s.plugin_id <> 'site_status'
  group by s.plugin_id;

  -- 7. Apply results to the stored state and collect transitions.
  for r in
    select h.*, st.status as prev_status, st.consecutive_failures as prev_failures,
           st.last_alerted_at, st.failing_since
    from pg_temp.health_results h
    left join public.system_health_state st on st.check_id = h.check_id
    where h.ok is not null
  loop
    if r.ok then
      insert into public.system_health_state (check_id, label, status, detail,
        consecutive_failures, failing_since, last_checked_at)
      values (r.check_id, r.label, 'ok', null, 0, null, v_now)
      on conflict (check_id) do update
        set label = excluded.label, status = 'ok', detail = null,
            consecutive_failures = 0, failing_since = null,
            last_checked_at = v_now;
      if r.prev_status = 'down' then
        v_up := v_up || format('%s: back to normal (down since %s).', r.label,
          to_char(r.failing_since at time zone 'Europe/London', 'DD Mon HH24:MI'));
        v_up_ids := v_up_ids || r.check_id;
      end if;
    else
      insert into public.system_health_state (check_id, label, status, detail,
        consecutive_failures, failing_since, last_checked_at)
      values (r.check_id, r.label,
        case when r.threshold <= 1 then 'down' else 'ok' end,
        left(r.detail, 1000), 1, v_now, v_now)
      on conflict (check_id) do update
        set label = excluded.label,
            detail = left(r.detail, 1000),
            consecutive_failures = public.system_health_state.consecutive_failures + 1,
            failing_since = coalesce(public.system_health_state.failing_since, v_now),
            status = case when public.system_health_state.consecutive_failures + 1 >= r.threshold
              then 'down' else public.system_health_state.status end,
            last_checked_at = v_now;

      if coalesce(r.prev_failures, 0) + 1 >= r.threshold then
        if coalesce(r.prev_status, 'ok') = 'ok' then
          v_down := v_down || format('%s: %s', r.label, coalesce(r.detail, 'failing.'));
          v_down_ids := v_down_ids || r.check_id;
        elsif r.last_alerted_at is null or r.last_alerted_at < v_now - interval '24 hours' then
          v_still := v_still || format('%s: still down since %s. %s', r.label,
            to_char(r.failing_since at time zone 'Europe/London', 'DD Mon HH24:MI'),
            coalesce(r.detail, ''));
          v_still_ids := v_still_ids || r.check_id;
        end if;
      end if;
    end if;
  end loop;

  -- 8. Email. One message per kind per run.
  if cardinality(v_down) + cardinality(v_still) > 0 then
    perform public.call_edge_with_service_role(v_notify_url, jsonb_build_object(
      'alert_type', 'system_down',
      'subject', case when cardinality(v_down) > 0
        then format('[MHC] Down: %s', array_to_string((
          select array_agg(label) from public.system_health_state where check_id = any(v_down_ids)), ', '))
        else format('[MHC] Still down: %s', array_to_string((
          select array_agg(label) from public.system_health_state where check_id = any(v_still_ids)), ', '))
      end,
      'lines', to_jsonb(v_down || v_still),
      'started_at', v_now
    ));
    update public.system_health_state set last_alerted_at = v_now
    where check_id = any(v_down_ids || v_still_ids);
  end if;

  if cardinality(v_up) > 0 then
    perform public.call_edge_with_service_role(v_notify_url, jsonb_build_object(
      'alert_type', 'system_recovered',
      'subject', format('[MHC] Recovered: %s', array_to_string((
        select array_agg(label) from public.system_health_state where check_id = any(v_up_ids)), ', ')),
      'lines', to_jsonb(v_up),
      'started_at', v_now
    ));
  end if;

  return jsonb_build_object(
    'checked', (select count(*) from pg_temp.health_results where ok is not null),
    'down', (select count(*) from public.system_health_state where status = 'down'),
    'alerted_down', cardinality(v_down),
    'reminded', cardinality(v_still),
    'recovered', cardinality(v_up)
  );
end;
$$;

revoke all on function public.system_health_check() from public, anon, authenticated;
grant execute on function public.system_health_check() to service_role;

-- lovable-cron-fallback-reviewed: 144 runs/day; three HTTP probes per run
-- (two site addresses and one AI engine request that stops before OpenAI)
-- plus read-only queries. Emails only on a change of state or a 24-hour
-- reminder.
select cron.unschedule('system-health-check')
where exists (select 1 from cron.job where jobname = 'system-health-check');

select cron.schedule(
  'system-health-check',
  '*/10 * * * *',
  $$select public.system_health_check()$$
);

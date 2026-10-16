-- Stand-ins used by run-system-health.sh only. Never load into a real project.
-- Stand-ins for the Supabase pieces system_health_check() touches.
do $$ begin create role anon nologin; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated nologin; exception when duplicate_object then null; end $$;
do $$ begin create role service_role nologin bypassrls; exception when duplicate_object then null; end $$;

create schema net;
create sequence net.req_seq;
create table net.requests (id bigint primary key, method text, url text, body jsonb, headers jsonb);
create table net._http_response (
  id bigint primary key, status_code int, headers jsonb, content text,
  timed_out boolean default false, error_msg text, created timestamptz default now()
);
create function net.http_get(url text, params jsonb default '{}', headers jsonb default '{}', timeout_milliseconds int default 5000)
returns bigint language plpgsql as $$
declare v bigint := nextval('net.req_seq');
begin insert into net.requests values (v, 'GET', url, null, headers); return v; end $$;
create function net.http_post(url text, body jsonb default '{}', params jsonb default '{}', headers jsonb default '{}', timeout_milliseconds int default 5000)
returns bigint language plpgsql as $$
declare v bigint := nextval('net.req_seq');
begin insert into net.requests values (v, 'POST', url, body, headers); return v; end $$;

create schema cron;
create table cron.job (jobid bigserial primary key, jobname text unique, schedule text, command text, active boolean default true);
create table cron.job_run_details (jobid bigint, status text, start_time timestamptz, return_message text);
create function cron.schedule(job_name text, schedule text, command text) returns bigint language sql as $$
  insert into cron.job (jobname, schedule, command) values (job_name, schedule, command)
  on conflict (jobname) do update set schedule = excluded.schedule, command = excluded.command
  returning jobid $$;
create function cron.unschedule(job_name text) returns boolean language sql as $$
  delete from cron.job where jobname = job_name returning true $$;

create table public.sent_alerts (id serial, url text, body jsonb, at timestamptz default clock_timestamp());
create function public.call_edge_with_service_role(p_url text, p_body jsonb) returns bigint language sql as $$
  insert into public.sent_alerts (url, body) values (p_url, p_body) returning id::bigint $$;

create table public.scrape_runs (provider_id text, status text, started_at timestamptz);
create table public.os_plugin_settings (plugin_id text primary key, enabled boolean);
create table public.os_plugin_sync_log (plugin_id text, status text, started_at timestamptz, message text);

-- Answer every pending probe: site probes by URL, the AI probe by method.
create function public.fake_answer(p_site_status int, p_site_body text, p_ai_status int, p_www_status int default null, p_www_body text default null)
returns void language sql as $$
  insert into net._http_response (id, status_code, headers, content)
  select r.id,
    case when r.method = 'POST' then p_ai_status
         when r.url like 'https://www.%' and p_www_status is not null then p_www_status
         else p_site_status end,
    '{}'::jsonb,
    case when r.method = 'POST' then '{"error":"AI recommendation service is not configured"}'
         when r.url like 'https://www.%' and p_www_body is not null then p_www_body
         else p_site_body end
  from net.requests r
  where r.url not like '%security-alert-notify%'
    and not exists (select 1 from net._http_response x where x.id = r.id)
$$;

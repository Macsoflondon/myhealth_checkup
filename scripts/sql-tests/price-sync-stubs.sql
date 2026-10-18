-- Stand-ins used by run-price-sync.sh only. Never load into a real project.
-- Stand-ins for the Supabase pieces the manual price sync touches.
do $$ begin create role anon nologin; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated nologin; exception when duplicate_object then null; end $$;
do $$ begin create role service_role nologin bypassrls; exception when duplicate_object then null; end $$;
grant usage on schema public to anon, authenticated, service_role;

create schema auth;
grant usage on schema auth to anon, authenticated, service_role;
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('test.uid', true), '')::uuid
$$;

-- Admin when test.admin is on (production's has_role also requires AAL2).
create type public.app_role as enum ('admin', 'moderator', 'user');
create function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable as $$
  select _user_id is not null and coalesce(current_setting('test.admin', true), 'off') = 'on'
$$;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

create schema vault;
create table vault.decrypted_secrets (name text primary key, decrypted_secret text);
insert into vault.decrypted_secrets values ('mhc_sync_secret', 'test-secret');

create schema net;
create sequence net.req_seq;
create table net.requests (id bigint primary key, url text, headers jsonb, at timestamptz default clock_timestamp());
create table net._http_response (
  id bigint primary key, status_code int, headers jsonb, content text,
  timed_out boolean default false, error_msg text, created timestamptz default now()
);
create function net.http_get(url text, params jsonb default '{}', headers jsonb default '{}', timeout_milliseconds int default 5000)
returns bigint language plpgsql as $$
declare v bigint := nextval('net.req_seq');
begin insert into net.requests (id, url, headers) values (v, url, headers); return v; end $$;

create schema cron;
create table cron.job (jobid bigserial primary key, jobname text unique, schedule text, command text, active boolean default true);
create function cron.schedule(job_name text, schedule text, command text) returns bigint language sql as $$
  insert into cron.job (jobname, schedule, command) values (job_name, schedule, command)
  on conflict (jobname) do update set schedule = excluded.schedule, command = excluded.command
  returning jobid $$;
create function cron.unschedule(job_name text) returns boolean language plpgsql as $$
begin
  delete from cron.job where jobname = job_name;
  return found;
end $$;

create table public.scrape_runs (
  id uuid primary key default gen_random_uuid(),
  provider_id text not null,
  scraper_function text,
  status text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  tests_seen int not null default 0,
  tests_updated int not null default 0,
  tests_new int not null default 0,
  tests_deactivated int not null default 0,
  errors jsonb not null default '[]'
);
create table public.provider_tests (id serial primary key, provider_id text, is_active boolean);
insert into public.provider_tests (provider_id, is_active)
select p, a from unnest(array['randox','randox','randox','medichecks']) p, unnest(array[true]) a;
insert into public.provider_tests (provider_id, is_active) values ('randox', false);

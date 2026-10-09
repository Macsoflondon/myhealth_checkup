-- Minimal stand-ins for the Supabase platform pieces the AI OS migrations
-- touch (roles, auth, vault, cron, has_role). Used by run-ai-os.sh only.
do $$ begin create role anon nologin; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated nologin; exception when duplicate_object then null; end $$;
do $$ begin create role service_role nologin bypassrls; exception when duplicate_object then null; end $$;
grant usage on schema public to anon, authenticated, service_role;

create schema auth;
grant usage on schema auth to anon, authenticated, service_role;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;
create function auth.jwt() returns jsonb language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
$$;

create type public.app_role as enum ('admin', 'moderator', 'user');
create table public.user_roles (user_id uuid not null, role public.app_role not null);
create schema private;
grant usage on schema private to authenticated, service_role;

-- Same body as production (2026-10-09): admin requires an AAL2 session.
create function private.has_role(_user_id uuid, _role app_role)
returns boolean language plpgsql stable security definer set search_path to 'public' as $function$
DECLARE
  _has boolean;
  _aal text;
BEGIN
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) INTO _has;
  IF NOT _has THEN RETURN false; END IF;
  IF _role = 'admin'::public.app_role THEN
    BEGIN
      _aal := (auth.jwt() ->> 'aal');
    EXCEPTION WHEN OTHERS THEN
      _aal := NULL;
    END;
    IF _aal IS DISTINCT FROM 'aal2' THEN RETURN false; END IF;
  END IF;
  RETURN true;
END;
$function$;
create function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable set search_path to 'public', 'private' as $function$
  SELECT private.has_role(_user_id, _role);
$function$;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

create schema vault;
create table vault.secrets (
  id uuid primary key default gen_random_uuid(),
  name text unique,
  description text not null default '',
  secret text not null,
  key_id uuid,
  nonce bytea,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create view vault.decrypted_secrets as
  select id, name, description, secret, secret as decrypted_secret, key_id, nonce, created_at, updated_at
  from vault.secrets;
create function vault.create_secret(new_secret text, new_name text default null,
  new_description text default '', new_key_id uuid default null)
returns uuid language plpgsql as $$
declare v uuid;
begin
  insert into vault.secrets (secret, name, description) values (new_secret, new_name, new_description)
  returning id into v;
  return v;
end $$;
create function vault.update_secret(secret_id uuid, new_secret text default null, new_name text default null,
  new_description text default null, new_key_id uuid default null)
returns void language sql as $$
  update vault.secrets set secret = coalesce(new_secret, secret), name = coalesce(new_name, name),
    description = coalesce(new_description, description), updated_at = now()
  where id = secret_id
$$;

create schema cron;
create table cron.job (jobid bigserial primary key, jobname text unique, schedule text, command text);
create function cron.schedule(job_name text, schedule text, command text) returns bigint language plpgsql as $$
declare v bigint;
begin
  insert into cron.job (jobname, schedule, command) values (job_name, schedule, command)
  on conflict (jobname) do update set schedule = excluded.schedule, command = excluded.command
  returning jobid into v;
  return v;
end $$;
create function cron.unschedule(job_name text) returns boolean language plpgsql as $$
begin
  delete from cron.job where jobname = job_name;
  return found;
end $$;

create function public.call_edge_with_service_role(p_url text, p_body jsonb default '{}'::jsonb)
returns bigint language sql as $$ select 1::bigint $$;

create table public.provider_tests (id uuid primary key, provider_id text, test_name text);
grant select on public.provider_tests to authenticated, service_role;

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  table_name text not null,
  record_id uuid,
  user_id uuid references auth.users (id) on delete set null,
  new_data jsonb,
  created_at timestamptz not null default now()
);

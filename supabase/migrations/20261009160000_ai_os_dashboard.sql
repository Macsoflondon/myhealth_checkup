-- AI OS dashboard (Crux Control): API plugin registry, Vault-held plugin
-- credentials, pre-aggregated summaries for provider clicks and revenue, and
-- the hourly plugin sync.
--
-- Privacy: nothing here stores an IP address, user agent, name, email or
-- account id for site visitors. affiliate_clicks.traffic_flag is a label
-- derived at ingest time; the user agent it was derived from is discarded.
-- Plugin credentials live in Vault and are never readable by the browser.

-- ---------------------------------------------------------------------------
-- 1. Click quality
-- ---------------------------------------------------------------------------

-- Set by /api/public/affiliate-click: 'headless' (automation browser user
-- agent), 'bot' (crawler user agent) or 'burst' (one address sending clicks
-- faster than a person can). Null means no flag at ingest.
alter table public.affiliate_clicks
  add column if not exists traffic_flag text;

alter table public.affiliate_clicks
  drop constraint if exists affiliate_clicks_traffic_flag_chk;
alter table public.affiliate_clicks
  add constraint affiliate_clicks_traffic_flag_chk
  check (traffic_flag is null or traffic_flag in ('headless', 'bot', 'burst'));

-- Supports the per-page burst window in os_clicks_summary.
create index if not exists affiliate_clicks_page_time_idx
  on public.affiliate_clicks (source_page, clicked_at);

-- Where a conversion row came from: 'csv' (manual import) or a network sync.
alter table public.affiliate_conversions
  add column if not exists source text not null default 'csv';

alter table public.affiliate_conversions
  drop constraint if exists affiliate_conversions_source_chk;
alter table public.affiliate_conversions
  add constraint affiliate_conversions_source_chk
  check (source ~ '^[a-z0-9_]{2,32}$');

-- ---------------------------------------------------------------------------
-- 2. Plugin registry tables
-- ---------------------------------------------------------------------------

-- Non-secret plugin settings (ids, site URLs, mappings). Credentials never go
-- here: they are written to Vault through os_set_plugin_secret.
create table if not exists public.os_plugin_settings (
  plugin_id text primary key,
  enabled boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  constraint os_plugin_settings_id_chk check (plugin_id ~ '^[a-z0-9_]{2,40}$'),
  constraint os_plugin_settings_config_chk
    check (jsonb_typeof(config) = 'object' and octet_length(config::text) <= 16384)
);

grant select, insert, update on public.os_plugin_settings to authenticated;
grant all on public.os_plugin_settings to service_role;
revoke all on public.os_plugin_settings from anon;

alter table public.os_plugin_settings enable row level security;

drop policy if exists "Admins read plugin settings" on public.os_plugin_settings;
create policy "Admins read plugin settings"
  on public.os_plugin_settings for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins add plugin settings" on public.os_plugin_settings;
create policy "Admins add plugin settings"
  on public.os_plugin_settings for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins change plugin settings" on public.os_plugin_settings;
create policy "Admins change plugin settings"
  on public.os_plugin_settings for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.os_plugin_settings_touch()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists os_plugin_settings_touch on public.os_plugin_settings;
create trigger os_plugin_settings_touch
  before insert or update on public.os_plugin_settings
  for each row execute function public.os_plugin_settings_touch();

-- Latest normalised result of each plugin dataset, written by the os-plugins
-- edge function. The dashboard reads these instead of calling third-party
-- APIs from the browser, so pages load from one indexed lookup.
create table if not exists public.os_plugin_snapshots (
  plugin_id text not null,
  dataset text not null,
  payload jsonb not null,
  period_start date,
  period_end date,
  fetched_at timestamptz not null default now(),
  primary key (plugin_id, dataset),
  constraint os_plugin_snapshots_ids_chk
    check (plugin_id ~ '^[a-z0-9_]{2,40}$' and dataset ~ '^[a-z0-9_]{1,60}$')
);

grant select on public.os_plugin_snapshots to authenticated;
grant all on public.os_plugin_snapshots to service_role;
revoke all on public.os_plugin_snapshots from anon;

alter table public.os_plugin_snapshots enable row level security;

drop policy if exists "Admins read plugin snapshots" on public.os_plugin_snapshots;
create policy "Admins read plugin snapshots"
  on public.os_plugin_snapshots for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- One row per plugin per sync attempt. Kept for 90 days.
create table if not exists public.os_plugin_sync_log (
  id bigint generated always as identity primary key,
  plugin_id text not null,
  trigger text not null,
  status text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  records integer,
  message text,
  constraint os_plugin_sync_log_id_chk check (plugin_id ~ '^[a-z0-9_]{2,40}$'),
  constraint os_plugin_sync_log_trigger_chk check (trigger in ('cron', 'manual', 'test')),
  constraint os_plugin_sync_log_status_chk check (status in ('ok', 'error', 'skipped')),
  constraint os_plugin_sync_log_message_chk check (message is null or char_length(message) <= 2000)
);

create index if not exists os_plugin_sync_log_plugin_idx
  on public.os_plugin_sync_log (plugin_id, started_at desc);

grant select on public.os_plugin_sync_log to authenticated;
grant all on public.os_plugin_sync_log to service_role;
revoke all on public.os_plugin_sync_log from anon;

alter table public.os_plugin_sync_log enable row level security;

drop policy if exists "Admins read plugin sync log" on public.os_plugin_sync_log;
create policy "Admins read plugin sync log"
  on public.os_plugin_sync_log for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------------
-- 3. Plugin credentials in Vault (write-only from the dashboard)
-- ---------------------------------------------------------------------------

-- Stores, replaces or (with an empty value) removes one plugin credential.
-- Admin with MFA only (has_role enforces AAL2 for 'admin'). The value is
-- never returned by any function the browser can call.
create or replace function public.os_set_plugin_secret(
  p_plugin text,
  p_key text,
  p_value text
)
returns void
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  v_name text;
  v_id uuid;
  v_value text := btrim(coalesce(p_value, ''));
  v_action text;
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Admin role with MFA required' using errcode = '42501';
  end if;
  if p_plugin is null or p_plugin !~ '^[a-z0-9_]{2,40}$'
     or p_key is null or p_key !~ '^[A-Z][A-Z0-9_]{1,63}$' then
    raise exception 'Invalid plugin or credential name' using errcode = '22023';
  end if;
  if length(v_value) > 16384 then
    raise exception 'Credential is too long' using errcode = '22001';
  end if;

  v_name := 'os_plugin:' || p_plugin || ':' || p_key;
  select s.id into v_id from vault.secrets s where s.name = v_name;

  if v_value = '' then
    if v_id is null then
      return;
    end if;
    delete from vault.secrets where id = v_id;
    v_action := 'os_plugin_secret_removed';
  elsif v_id is null then
    perform vault.create_secret(v_value, v_name, 'AI OS plugin credential');
    v_action := 'os_plugin_secret_set';
  else
    perform vault.update_secret(v_id, v_value);
    v_action := 'os_plugin_secret_set';
  end if;

  -- Audit trail without the value.
  insert into public.audit_logs (action, table_name, record_id, user_id, new_data)
  values (v_action, 'vault.secrets', v_name, auth.uid(),
          jsonb_build_object('plugin_id', p_plugin, 'key', p_key));
end;
$$;

revoke all on function public.os_set_plugin_secret(text, text, text) from public, anon;
grant execute on function public.os_set_plugin_secret(text, text, text) to authenticated;

-- Which plugin credentials are stored in Vault (names and dates only).
create or replace function public.os_plugin_secret_status()
returns table (plugin_id text, secret_key text, updated_at timestamptz)
language plpgsql
stable
security definer
set search_path = public, vault
as $$
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Admin role with MFA required' using errcode = '42501';
  end if;
  return query
    select split_part(s.name, ':', 2), split_part(s.name, ':', 3), s.updated_at
    from vault.secrets s
    where starts_with(s.name, 'os_plugin:')
    order by 1, 2;
end;
$$;

revoke all on function public.os_plugin_secret_status() from public, anon;
grant execute on function public.os_plugin_secret_status() to authenticated;

-- Decrypted credentials for one plugin. Service role only: called by the
-- os-plugins edge function, never by the browser.
create or replace function public.os_get_plugin_secrets(p_plugin text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, vault
as $$
begin
  if p_plugin is null or p_plugin !~ '^[a-z0-9_]{2,40}$' then
    raise exception 'Invalid plugin name' using errcode = '22023';
  end if;
  return coalesce((
    select jsonb_object_agg(split_part(d.name, ':', 3), d.decrypted_secret)
    from vault.decrypted_secrets d
    where starts_with(d.name, 'os_plugin:' || p_plugin || ':')
  ), '{}'::jsonb);
end;
$$;

revoke all on function public.os_get_plugin_secrets(text) from public, anon, authenticated;
grant execute on function public.os_get_plugin_secrets(text) to service_role;

-- ---------------------------------------------------------------------------
-- 4. Provider click summary
-- ---------------------------------------------------------------------------

-- Clicks on outbound provider links for [p_from, p_to), compared with the
-- window of the same length immediately before it.
--
-- A click is excluded from "qualified" clicks when it carries an ingest flag,
-- or when 10 or more clicks hit the same source page within 120 seconds either
-- side of it (an automated sweep, such as the run of 180 clicks on
-- /provider/lola-health on 4 October 2026). Excluded clicks are still counted
-- and reported, never silently dropped. Days are Europe/London calendar days.
create or replace function public.os_clicks_summary(
  p_from timestamptz,
  p_to timestamptz
)
returns jsonb
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_prev_from timestamptz;
  v_result jsonb;
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Admin role required' using errcode = '42501';
  end if;
  if p_from is null or p_to is null or p_to <= p_from
     or p_to - p_from > interval '400 days' then
    raise exception 'Invalid date range' using errcode = '22023';
  end if;
  v_prev_from := p_from - (p_to - p_from);

  with base as (
    select
      c.clicked_at, c.provider_id, c.test_id, c.source_page, c.placement, c.traffic_flag,
      count(*) over (
        partition by c.source_page
        order by c.clicked_at
        range between interval '120 seconds' preceding and interval '120 seconds' following
      ) as neighbours
    from public.affiliate_clicks c
    where c.clicked_at >= v_prev_from - interval '120 seconds'
      and c.clicked_at < p_to + interval '120 seconds'
  ), classified as (
    select
      b.*,
      b.clicked_at >= p_from as is_current,
      coalesce(b.traffic_flag, case when b.neighbours >= 10 then 'burst' end) as excluded_reason
    from base b
    where b.clicked_at >= v_prev_from and b.clicked_at < p_to
  ), cur as (
    select * from classified where is_current
  ), qual as (
    select * from cur where excluded_reason is null
  ), totals as (
    select
      (select count(*) from cur) as raw,
      (select count(*) from qual) as qualified,
      (select count(*) from classified where not is_current) as prev_raw,
      (select count(*) from classified where not is_current and excluded_reason is null) as prev_qualified
  ), days as (
    select d::date as day
    from generate_series(
      (p_from at time zone 'Europe/London')::date,
      ((p_to - interval '1 microsecond') at time zone 'Europe/London')::date,
      interval '1 day'
    ) d
  ), daily as (
    select
      d.day,
      count(c.clicked_at) filter (where c.excluded_reason is null) as qualified,
      count(c.clicked_at) filter (where c.excluded_reason is not null) as excluded
    from days d
    left join cur c on (c.clicked_at at time zone 'Europe/London')::date = d.day
    group by d.day
  ), burst_rows as (
    select
      c.source_page, c.clicked_at, c.provider_id,
      coalesce(
        c.clicked_at - lag(c.clicked_at) over (partition by c.source_page order by c.clicked_at)
          > interval '120 seconds',
        true
      ) as starts_group
    from cur c
    where c.excluded_reason = 'burst'
  ), burst_groups as (
    select
      r.*,
      sum(case when r.starts_group then 1 else 0 end)
        over (partition by r.source_page order by r.clicked_at) as grp
    from burst_rows r
  ), bursts as (
    select
      g.source_page,
      min(g.clicked_at) as started_at,
      max(g.clicked_at) as ended_at,
      count(*) as clicks,
      array_agg(distinct g.provider_id order by g.provider_id) as providers
    from burst_groups g
    group by g.source_page, g.grp
  ), top_tests as (
    select q.provider_id, q.test_id, count(*) as clicks
    from qual q
    where q.test_id is not null
    group by q.provider_id, q.test_id
    order by count(*) desc, q.test_id
    limit 10
  )
  select jsonb_build_object(
    'from', p_from,
    'to', p_to,
    'generated_at', now(),
    'method', jsonb_build_object(
      'burst_window_seconds', 120,
      'burst_min_clicks', 10,
      'timezone', 'Europe/London'
    ),
    'totals', (
      select jsonb_build_object(
        'raw', t.raw,
        'qualified', t.qualified,
        'excluded', t.raw - t.qualified,
        'excluded_by_reason', coalesce((
          select jsonb_object_agg(x.excluded_reason, x.n)
          from (
            select excluded_reason, count(*) as n
            from cur where excluded_reason is not null
            group by excluded_reason
          ) x
        ), '{}'::jsonb)
      )
      from totals t
    ),
    'previous', (
      select jsonb_build_object('raw', t.prev_raw, 'qualified', t.prev_qualified)
      from totals t
    ),
    'daily', coalesce((
      select jsonb_agg(jsonb_build_object(
        'day', to_char(d.day, 'YYYY-MM-DD'),
        'qualified', d.qualified,
        'excluded', d.excluded
      ) order by d.day)
      from daily d
    ), '[]'::jsonb),
    'by_provider', coalesce((
      select jsonb_agg(jsonb_build_object(
        'provider_id', p.provider_id,
        'clicks', p.clicks,
        'share', round(p.clicks::numeric / nullif(t.qualified, 0), 4)
      ) order by p.clicks desc, p.provider_id)
      from (select provider_id, count(*) as clicks from qual group by provider_id) p
      cross join totals t
    ), '[]'::jsonb),
    'by_placement', coalesce((
      select jsonb_agg(jsonb_build_object(
        'placement', p.placement,
        'clicks', p.clicks,
        'share', round(p.clicks::numeric / nullif(t.qualified, 0), 4)
      ) order by p.clicks desc, p.placement)
      from (select placement, count(*) as clicks from qual group by placement) p
      cross join totals t
    ), '[]'::jsonb),
    'top_pages', coalesce((
      select jsonb_agg(jsonb_build_object(
        'source_page', p.source_page,
        'clicks', p.clicks
      ) order by p.clicks desc, p.source_page)
      from (
        select source_page, count(*) as clicks
        from qual
        group by source_page
        order by count(*) desc, source_page
        limit 10
      ) p
    ), '[]'::jsonb),
    'top_tests', coalesce((
      select jsonb_agg(jsonb_build_object(
        'provider_id', tt.provider_id,
        'test_id', tt.test_id,
        'test_name', pt.test_name,
        'clicks', tt.clicks
      ) order by tt.clicks desc, tt.test_id)
      from top_tests tt
      left join public.provider_tests pt
        on pt.id = case
          when tt.test_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
          then tt.test_id::uuid
        end
    ), '[]'::jsonb),
    'excluded_bursts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'source_page', b.source_page,
        'started_at', b.started_at,
        'ended_at', b.ended_at,
        'clicks', b.clicks,
        'providers', to_jsonb(b.providers)
      ) order by b.clicks desc, b.started_at)
      from (select * from bursts order by clicks desc, started_at limit 5) b
    ), '[]'::jsonb),
    'last_click_at', (select max(clicked_at) from public.affiliate_clicks),
    'last_qualified_click_at', (select max(clicked_at) from qual)
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.os_clicks_summary(timestamptz, timestamptz) from public, anon;
grant execute on function public.os_clicks_summary(timestamptz, timestamptz) to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Revenue summary
-- ---------------------------------------------------------------------------

-- Affiliate commission for [p_from, p_to) from affiliate_conversions (CSV
-- imports and network syncs), compared with the window before it. Reversed
-- conversions are reported but never counted as revenue. All amounts GBP.
create or replace function public.os_revenue_summary(
  p_from timestamptz,
  p_to timestamptz
)
returns jsonb
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_prev_from timestamptz;
  v_result jsonb;
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Admin role required' using errcode = '42501';
  end if;
  if p_from is null or p_to is null or p_to <= p_from
     or p_to - p_from > interval '400 days' then
    raise exception 'Invalid date range' using errcode = '22023';
  end if;
  v_prev_from := p_from - (p_to - p_from);

  with conv as (
    select v.*, v.converted_at >= p_from as is_current
    from public.affiliate_conversions v
    where v.converted_at >= v_prev_from and v.converted_at < p_to
  ), cur as (
    select * from conv where is_current
  ), days as (
    select d::date as day
    from generate_series(
      (p_from at time zone 'Europe/London')::date,
      ((p_to - interval '1 microsecond') at time zone 'Europe/London')::date,
      interval '1 day'
    ) d
  ), daily as (
    select
      d.day,
      count(c.id) filter (where c.status <> 'reversed') as conversions,
      coalesce(sum(c.commission_gbp) filter (where c.status <> 'reversed'), 0) as commission_gbp
    from days d
    left join cur c on (c.converted_at at time zone 'Europe/London')::date = d.day
    group by d.day
  )
  select jsonb_build_object(
    'from', p_from,
    'to', p_to,
    'generated_at', now(),
    'totals', (
      select jsonb_build_object(
        'conversions', count(*) filter (where status <> 'reversed'),
        'pending', count(*) filter (where status = 'pending'),
        'confirmed', count(*) filter (where status = 'confirmed'),
        'reversed', count(*) filter (where status = 'reversed'),
        'commission_gbp', round(coalesce(sum(commission_gbp) filter (where status <> 'reversed'), 0), 2),
        'commission_confirmed_gbp', round(coalesce(sum(commission_gbp) filter (where status = 'confirmed'), 0), 2),
        'commission_pending_gbp', round(coalesce(sum(commission_gbp) filter (where status = 'pending'), 0), 2),
        'commission_reversed_gbp', round(coalesce(sum(commission_gbp) filter (where status = 'reversed'), 0), 2),
        'order_value_gbp', round(coalesce(sum(order_value_gbp) filter (where status <> 'reversed'), 0), 2),
        'attributed', count(*) filter (where status <> 'reversed' and click_id is not null),
        'unattributed', count(*) filter (where status <> 'reversed' and click_id is null),
        'missing_commission', count(*) filter (where status <> 'reversed' and commission_gbp is null)
      )
      from cur
    ),
    'previous', (
      select jsonb_build_object(
        'conversions', count(*) filter (where status <> 'reversed'),
        'commission_gbp', round(coalesce(sum(commission_gbp) filter (where status <> 'reversed'), 0), 2)
      )
      from conv where not is_current
    ),
    'daily', coalesce((
      select jsonb_agg(jsonb_build_object(
        'day', to_char(d.day, 'YYYY-MM-DD'),
        'conversions', d.conversions,
        'commission_gbp', round(d.commission_gbp, 2)
      ) order by d.day)
      from daily d
    ), '[]'::jsonb),
    'by_provider', coalesce((
      select jsonb_agg(jsonb_build_object(
        'provider_id', p.provider_id,
        'conversions', p.conversions,
        'commission_gbp', round(p.commission_gbp, 2),
        'order_value_gbp', round(p.order_value_gbp, 2)
      ) order by p.commission_gbp desc, p.provider_id)
      from (
        select
          provider_id,
          count(*) filter (where status <> 'reversed') as conversions,
          coalesce(sum(commission_gbp) filter (where status <> 'reversed'), 0) as commission_gbp,
          coalesce(sum(order_value_gbp) filter (where status <> 'reversed'), 0) as order_value_gbp
        from cur
        group by provider_id
      ) p
    ), '[]'::jsonb),
    'by_source', coalesce((
      select jsonb_agg(jsonb_build_object(
        'source', s.source,
        'conversions', s.conversions,
        'commission_gbp', round(s.commission_gbp, 2)
      ) order by s.commission_gbp desc, s.source)
      from (
        select
          source,
          count(*) filter (where status <> 'reversed') as conversions,
          coalesce(sum(commission_gbp) filter (where status <> 'reversed'), 0) as commission_gbp
        from cur
        group by source
      ) s
    ), '[]'::jsonb),
    'last_converted_at', (select max(converted_at) from public.affiliate_conversions),
    'last_imported_at', (select max(imported_at) from public.affiliate_conversions)
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.os_revenue_summary(timestamptz, timestamptz) from public, anon;
grant execute on function public.os_revenue_summary(timestamptz, timestamptz) to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Network conversion upsert (service role only)
-- ---------------------------------------------------------------------------

-- Used by the os-plugins edge function to store transactions pulled from an
-- affiliate network API. Same conflict key as import_affiliate_conversions,
-- so a transaction imported by CSV and later synced is stored once.
-- Rows: {provider_id, network_reference, status (pending|confirmed|reversed),
-- order_value_gbp, commission_gbp, converted_at, click_ref}. click_ref is
-- matched to affiliate_clicks.click_id when it is one of our click ids.
create or replace function public.os_upsert_network_conversions(
  p_source text,
  p_rows jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_received integer;
  v_upserted integer := 0;
  v_matched integer := 0;
begin
  if p_source is null or p_source !~ '^[a-z0-9_]{2,32}$' then
    raise exception 'Invalid source' using errcode = '22023';
  end if;
  if p_rows is null or jsonb_typeof(p_rows) <> 'array' then
    raise exception 'Rows must be a JSON array' using errcode = '22023';
  end if;
  v_received := jsonb_array_length(p_rows);

  with src as (
    select
      btrim(r->>'provider_id') as provider_id,
      btrim(r->>'network_reference') as network_reference,
      lower(btrim(r->>'status')) as status,
      nullif(r->>'order_value_gbp', '')::numeric as order_value_gbp,
      nullif(r->>'commission_gbp', '')::numeric as commission_gbp,
      nullif(r->>'converted_at', '')::timestamptz as converted_at,
      case
        when btrim(r->>'click_ref') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        then lower(btrim(r->>'click_ref'))
      end as click_raw
    from jsonb_array_elements(p_rows) r
  ), valid as (
    select * from src
    where coalesce(provider_id, '') <> ''
      and coalesce(network_reference, '') <> ''
      and status in ('pending', 'confirmed', 'reversed')
      and converted_at is not null
  ), dedup as (
    -- A network's transaction reference is unique within that network, so
    -- one reference maps to one row whatever provider it is filed under.
    select distinct on (network_reference) *
    from valid
    order by network_reference, converted_at desc
  ), moved as (
    -- An advertiser mapped after its first sync was stored under a
    -- placeholder provider (e.g. awin-12345). Drop that copy so the
    -- transaction is counted once, under the provider it now maps to.
    delete from public.affiliate_conversions a
    using dedup d
    where a.source = p_source
      and a.network_reference = d.network_reference
      and a.provider_id <> d.provider_id
  ), resolved as (
    select d.*, c.click_id
    from dedup d
    left join public.affiliate_clicks c on c.click_id = d.click_raw::uuid
  ), up as (
    insert into public.affiliate_conversions
      (click_id, provider_id, network_reference, status, order_value_gbp,
       commission_gbp, converted_at, source)
    select click_id, provider_id, network_reference, status, order_value_gbp,
      commission_gbp, converted_at, p_source
    from resolved
    on conflict (provider_id, network_reference) do update set
      click_id = coalesce(excluded.click_id, public.affiliate_conversions.click_id),
      status = excluded.status,
      order_value_gbp = excluded.order_value_gbp,
      commission_gbp = excluded.commission_gbp,
      converted_at = excluded.converted_at,
      source = excluded.source,
      imported_at = now()
    returning click_id
  )
  select count(*), count(click_id) into v_upserted, v_matched from up;

  return jsonb_build_object(
    'received', v_received,
    'upserted', v_upserted,
    'matched', v_matched,
    'rejected', v_received - v_upserted
  );
end;
$$;

revoke all on function public.os_upsert_network_conversions(text, jsonb) from public, anon, authenticated;
grant execute on function public.os_upsert_network_conversions(text, jsonb) to service_role;

-- ---------------------------------------------------------------------------
-- 7. Schedules
-- ---------------------------------------------------------------------------

-- lovable-cron-fallback-reviewed: 24 runs/day; pulls third-party analytics,
-- social and revenue APIs whose data changes hourly at most. Each plugin that
-- is disabled or has no credentials skips itself without calling out.
select cron.unschedule('os-plugins-sync')
where exists (select 1 from cron.job where jobname = 'os-plugins-sync');

select cron.schedule(
  'os-plugins-sync',
  '23 * * * *',
  $$
  select public.call_edge_with_service_role(
    'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/os-plugins',
    jsonb_build_object('action', 'sync', 'trigger', 'cron')
  );
  $$
);

select cron.unschedule('os-plugin-sync-log-retention')
where exists (select 1 from cron.job where jobname = 'os-plugin-sync-log-retention');

select cron.schedule(
  'os-plugin-sync-log-retention',
  '50 3 * * *',
  $$delete from public.os_plugin_sync_log where started_at < now() - interval '90 days'$$
);

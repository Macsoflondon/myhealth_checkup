-- Affiliate click tracking and conversion import.
-- Stores no IP address, user agent, email, name or account id.
-- Clicks: anonymous insert only (via /api/public/affiliate-click), admin read.
-- Conversions: admin only. Clicks older than 24 months are deleted daily.

create table if not exists public.affiliate_clicks (
  click_id uuid primary key,
  clicked_at timestamptz not null default now(),
  provider_id text not null,
  test_id text,
  source_page text not null,
  placement text not null,
  destination_host text not null,
  constraint affiliate_clicks_placement_chk
    check (placement in ('card', 'detail', 'comparison', 'quiz', 'provider_page')),
  constraint affiliate_clicks_provider_len_chk check (char_length(provider_id) between 1 and 64),
  constraint affiliate_clicks_test_len_chk check (test_id is null or char_length(test_id) <= 200),
  constraint affiliate_clicks_source_page_chk
    check (char_length(source_page) between 1 and 300 and source_page like '/%' and position('?' in source_page) = 0),
  constraint affiliate_clicks_host_chk check (char_length(destination_host) between 1 and 253)
);

create index if not exists affiliate_clicks_clicked_at_idx on public.affiliate_clicks (clicked_at);
create index if not exists affiliate_clicks_provider_idx on public.affiliate_clicks (provider_id, clicked_at);

grant insert on public.affiliate_clicks to anon, authenticated;
grant select on public.affiliate_clicks to authenticated;
grant all on public.affiliate_clicks to service_role;
revoke all on public.affiliate_clicks from anon;
grant insert on public.affiliate_clicks to anon;

alter table public.affiliate_clicks enable row level security;

-- Insert only. No select policy for anon; signed-in users read nothing unless admin.
create policy "Anyone can log an affiliate click"
  on public.affiliate_clicks for insert to anon, authenticated
  with check (clicked_at between now() - interval '5 minutes' and now() + interval '5 minutes');

create policy "Admins can read affiliate clicks"
  on public.affiliate_clicks for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create table if not exists public.affiliate_conversions (
  id uuid primary key default gen_random_uuid(),
  click_id uuid references public.affiliate_clicks (click_id) on delete set null,
  provider_id text not null,
  network_reference text not null,
  status text not null default 'pending',
  order_value_gbp numeric(12, 2),
  commission_gbp numeric(12, 2),
  converted_at timestamptz not null,
  imported_at timestamptz not null default now(),
  constraint affiliate_conversions_status_chk check (status in ('pending', 'confirmed', 'reversed')),
  constraint affiliate_conversions_ref_key unique (provider_id, network_reference)
);

create index if not exists affiliate_conversions_click_idx on public.affiliate_conversions (click_id);
create index if not exists affiliate_conversions_converted_idx on public.affiliate_conversions (converted_at);

grant select, insert, update, delete on public.affiliate_conversions to authenticated;
grant all on public.affiliate_conversions to service_role;
revoke all on public.affiliate_conversions from anon;

alter table public.affiliate_conversions enable row level security;

create policy "Admins manage affiliate conversions"
  on public.affiliate_conversions for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Import: unmatched click_ids are stored as null; re-imports update by (provider_id, network_reference).
create or replace function public.import_affiliate_conversions(p_rows jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_total integer := 0;
  v_matched integer := 0;
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Admin role required' using errcode = '42501';
  end if;

  with src as (
    select
      nullif(trim(r->>'click_id'), '') as click_raw,
      trim(r->>'provider_id') as provider_id,
      trim(r->>'network_reference') as network_reference,
      coalesce(nullif(lower(trim(r->>'status')), ''), 'pending') as status,
      nullif(r->>'order_value_gbp', '')::numeric as order_value_gbp,
      nullif(r->>'commission_gbp', '')::numeric as commission_gbp,
      (r->>'converted_at')::timestamptz as converted_at
    from jsonb_array_elements(p_rows) r
  ), dedup as (
    select distinct on (provider_id, network_reference) *
    from src
    where provider_id <> '' and network_reference <> ''
    order by provider_id, network_reference, converted_at desc
  ), resolved as (
    select d.*, c.click_id
    from dedup d
    left join public.affiliate_clicks c
      on c.click_id = case when d.click_raw ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then d.click_raw::uuid end
  ), up as (
    insert into public.affiliate_conversions
      (click_id, provider_id, network_reference, status, order_value_gbp, commission_gbp, converted_at)
    select click_id, provider_id, network_reference, status, order_value_gbp, commission_gbp, converted_at
    from resolved
    on conflict (provider_id, network_reference) do update set
      click_id = coalesce(excluded.click_id, public.affiliate_conversions.click_id),
      status = excluded.status,
      order_value_gbp = excluded.order_value_gbp,
      commission_gbp = excluded.commission_gbp,
      converted_at = excluded.converted_at,
      imported_at = now()
    returning click_id
  )
  select count(*), count(click_id) into v_total, v_matched from up;

  return jsonb_build_object('imported', v_total, 'matched', v_matched, 'unmatched', v_total - v_matched);
end;
$$;

revoke all on function public.import_affiliate_conversions(jsonb) from public, anon;
grant execute on function public.import_affiliate_conversions(jsonb) to authenticated;

-- Aggregates by provider and placement. Conversions take the placement of their
-- matched click; conversions without a matched click appear as 'unattributed'.
create or replace function public.affiliate_performance(
  p_from timestamptz,
  p_to timestamptz,
  p_provider text default null
)
returns jsonb
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_result jsonb;
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Admin role required' using errcode = '42501';
  end if;

  with clicks as (
    select provider_id, placement, count(*)::bigint as clicks
    from public.affiliate_clicks
    where clicked_at >= p_from and clicked_at < p_to
      and (p_provider is null or provider_id = p_provider)
    group by provider_id, placement
  ), conv as (
    select
      v.provider_id,
      coalesce(c.placement, 'unattributed') as placement,
      count(*) filter (where v.status <> 'reversed')::bigint as conversions,
      count(*) filter (where v.status = 'confirmed')::bigint as confirmed,
      count(*) filter (where v.status = 'reversed')::bigint as reversed,
      coalesce(sum(v.commission_gbp) filter (where v.status <> 'reversed'), 0) as commission_gbp,
      coalesce(sum(v.order_value_gbp) filter (where v.status <> 'reversed'), 0) as order_value_gbp
    from public.affiliate_conversions v
    left join public.affiliate_clicks c on c.click_id = v.click_id
    where v.converted_at >= p_from and v.converted_at < p_to
      and (p_provider is null or v.provider_id = p_provider)
    group by v.provider_id, coalesce(c.placement, 'unattributed')
  ), merged as (
    select
      coalesce(k.provider_id, v.provider_id) as provider_id,
      coalesce(k.placement, v.placement) as placement,
      coalesce(k.clicks, 0) as clicks,
      coalesce(v.conversions, 0) as conversions,
      coalesce(v.confirmed, 0) as confirmed,
      coalesce(v.reversed, 0) as reversed,
      coalesce(v.commission_gbp, 0) as commission_gbp,
      coalesce(v.order_value_gbp, 0) as order_value_gbp
    from clicks k
    full join conv v on v.provider_id = k.provider_id and v.placement = k.placement
  )
  select jsonb_build_object(
    'from', p_from,
    'to', p_to,
    'provider', p_provider,
    'totals', (
      select jsonb_build_object(
        'clicks', coalesce(sum(clicks), 0),
        'conversions', coalesce(sum(conversions), 0),
        'conversion_rate', case when sum(clicks) > 0 then round(sum(conversions)::numeric / sum(clicks), 4) end,
        'commission_gbp', round(coalesce(sum(commission_gbp), 0), 2),
        'order_value_gbp', round(coalesce(sum(order_value_gbp), 0), 2))
      from merged),
    'by_provider', coalesce((
      select jsonb_agg(jsonb_build_object(
        'provider_id', provider_id, 'clicks', clicks, 'conversions', conversions,
        'conversion_rate', case when clicks > 0 then round(conversions::numeric / clicks, 4) end,
        'commission_gbp', round(commission_gbp, 2)) order by clicks desc)
      from (select provider_id, sum(clicks) clicks, sum(conversions) conversions, sum(commission_gbp) commission_gbp
            from merged group by provider_id) p), '[]'::jsonb),
    'by_placement', coalesce((
      select jsonb_agg(jsonb_build_object(
        'placement', placement, 'clicks', clicks, 'conversions', conversions,
        'conversion_rate', case when clicks > 0 then round(conversions::numeric / clicks, 4) end,
        'commission_gbp', round(commission_gbp, 2)) order by clicks desc)
      from (select placement, sum(clicks) clicks, sum(conversions) conversions, sum(commission_gbp) commission_gbp
            from merged group by placement) p), '[]'::jsonb),
    'by_provider_placement', coalesce((
      select jsonb_agg(jsonb_build_object(
        'provider_id', provider_id, 'placement', placement, 'clicks', clicks, 'conversions', conversions,
        'confirmed', confirmed, 'reversed', reversed,
        'conversion_rate', case when clicks > 0 then round(conversions::numeric / clicks, 4) end,
        'commission_gbp', round(commission_gbp, 2)) order by provider_id, placement)
      from merged), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.affiliate_performance(timestamptz, timestamptz, text) from public, anon;
grant execute on function public.affiliate_performance(timestamptz, timestamptz, text) to authenticated;

-- Retention: delete clicks older than 24 months, daily at 03:40 UTC.
-- Unschedule first so re-running this file never creates a duplicate job.
select cron.unschedule('affiliate-clicks-retention')
where exists (select 1 from cron.job where jobname = 'affiliate-clicks-retention');

select cron.schedule(
  'affiliate-clicks-retention',
  '40 3 * * *',
  $$delete from public.affiliate_clicks where clicked_at < now() - interval '24 months'$$
);

-- os_upsert_network_conversions: keep the click link when a stale copy moves.
--
-- 20261009160000 deletes the stale copy of a transaction filed under another
-- provider (an advertiser mapped after its first sync, stored as awin-12345,
-- or a CSV import of the same sale within two days) and writes the synced
-- row under the provider it now maps to. The delete threw away the copy's
-- click_id, so when the network row carried no click reference of its own the
-- sale lost the click that led to it and showed as unattributed.
--
-- This version reads the removed copies back from the delete and carries one
-- click onto the replacement row. Precedence, highest first:
--   1. the incoming row's own click_ref, when it is one of our clicks;
--   2. a click already stored on the row being updated (unchanged from
--      20261009160000, which never replaced a stored click with nothing);
--   3. the click from a removed copy: the copy closest in time to the
--      incoming sale, then the lowest click_id, so a rerun picks the same one.
-- A carried click counts towards "matched", like a stored click kept by the
-- upsert already did: matched is the number of stored rows linked to a click,
-- the same test os_revenue_summary uses for "attributed".
--
-- affiliate_conversions.click_id references affiliate_clicks (on delete set
-- null), so a non-null click_id read in this statement's snapshot always
-- names a click that exists in that snapshot.
--
-- Same signature, return keys, security and grants as before. Only the
-- moved / carried / resolved CTEs and the click_id conflict rule change.

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
    -- The same transaction filed under another provider is a stale copy:
    -- an advertiser mapped after its first sync (stored as awin-12345), or a
    -- CSV import of the same sale. Drop it so the sale counts once, under
    -- the provider it now maps to. CSV rows carry no network, so one only
    -- counts as the same sale when its date is within two days. The copy's
    -- click link is kept: its click_id is returned here and carried onto the
    -- replacement row when that row has no click of its own.
    delete from public.affiliate_conversions a
    using dedup d
    where a.network_reference = d.network_reference
      and a.provider_id <> d.provider_id
      and (
        a.source = p_source
        or (
          a.source = 'csv'
          and abs(extract(epoch from (a.converted_at - d.converted_at))) <= 172800
        )
      )
    returning a.network_reference, a.click_id, a.converted_at
  ), carried as (
    -- One click per reference from the removed copies: the copy closest in
    -- time to the incoming sale, ties broken by the lowest click_id.
    select distinct on (m.network_reference) m.network_reference, m.click_id
    from moved m
    join dedup d on d.network_reference = m.network_reference
    where m.click_id is not null
    order by m.network_reference,
      abs(extract(epoch from (m.converted_at - d.converted_at))),
      m.click_id
  ), resolved as (
    -- own_click_id is the incoming click_ref when it is one of our clicks.
    -- click_id falls back to the carried click, so a new row gets it too.
    select d.*, c.click_id as own_click_id, coalesce(c.click_id, k.click_id) as click_id
    from dedup d
    left join public.affiliate_clicks c on c.click_id = d.click_raw::uuid
    left join carried k on k.network_reference = d.network_reference
  ), up as (
    insert into public.affiliate_conversions
      (click_id, provider_id, network_reference, status, order_value_gbp,
       commission_gbp, converted_at, source)
    select click_id, provider_id, network_reference, status, order_value_gbp,
      commission_gbp, converted_at, p_source
    from resolved
    on conflict (provider_id, network_reference) do update set
      -- The incoming row's own click wins, then the click already stored on
      -- this row, then the carried click (excluded.click_id when the incoming
      -- row has none). network_reference is unique in resolved (dedup).
      click_id = coalesce(
        (select r.own_click_id from resolved r
          where r.network_reference = excluded.network_reference),
        public.affiliate_conversions.click_id,
        excluded.click_id
      ),
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

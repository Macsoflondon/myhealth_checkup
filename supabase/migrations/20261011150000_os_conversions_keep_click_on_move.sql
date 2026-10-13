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
--   3. the click from a removed copy: of the removed copies that have a
--      click, the one closest in time to the incoming sale, then the lowest
--      click_id, so the same starting rows always give the same click.
-- A carried click counts towards "matched", like a stored click kept by the
-- upsert already did: matched is the number of rows this call stored that
-- are linked to a click, reversed ones included. os_revenue_summary's
-- "attributed" applies the same click test to non-reversed rows in its window.
--
-- affiliate_conversions.click_id references affiliate_clicks (on delete set
-- null), so a non-null click_id read in this statement's snapshot always
-- names a click that exists in that snapshot.
--
-- Same signature, return keys, security and grants as before. Only the
-- moved / resolved CTEs and the click_id conflict rule change. Because
-- resolved reads moved, the stale-copy delete now finishes before the
-- insert starts; the two touch different rows, so the result is the same.
-- The work stays linear in batch size: the conflict rule checks the row's
-- reference against a hashed set of the references whose incoming click is
-- one of ours, built once per call.

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
    -- counts as the same sale when its date is within two days. The copies'
    -- click_ids are returned here; resolved carries one onto the replacement
    -- row when that row has neither its own click nor a stored one.
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
    returning a.network_reference, a.click_id,
      abs(extract(epoch from (a.converted_at - d.converted_at))) as gap
  ), resolved as (
    -- One row per reference (dedup), so distinct on keeps every incoming row.
    -- Of the removed copies that have a click, it picks the one closest in
    -- time to the incoming sale, then the lowest click_id.
    select distinct on (d.network_reference)
      d.*, c.click_id as own_click_id, coalesce(c.click_id, m.click_id) as click_id
    from dedup d
    left join public.affiliate_clicks c on c.click_id = d.click_raw::uuid
    left join moved m on m.network_reference = d.network_reference and m.click_id is not null
    order by d.network_reference, m.gap, m.click_id
  ), up as (
    insert into public.affiliate_conversions
      (click_id, provider_id, network_reference, status, order_value_gbp,
       commission_gbp, converted_at, source)
    select click_id, provider_id, network_reference, status, order_value_gbp,
      commission_gbp, converted_at, p_source
    from resolved
    on conflict (provider_id, network_reference) do update set
      -- The incoming row's own click wins, then the click already stored on
      -- this row, then the carried click. excluded.click_id is the own click
      -- when the reference is in the set below, else the carried click or
      -- null. The set is uncorrelated, so it is hashed once per call.
      click_id = case
        when excluded.network_reference in
            (select r.network_reference from resolved r where r.own_click_id is not null)
          then excluded.click_id
        else coalesce(public.affiliate_conversions.click_id, excluded.click_id)
      end,
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

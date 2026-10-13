-- Assertions for supabase/migrations/20261009160000_ai_os_dashboard.sql and
-- 20261011150000_os_conversions_keep_click_on_move.sql.
-- Run with scripts/sql-tests/run-ai-os.sh.
\set ON_ERROR_STOP 1
\pset pager off

-- ---------- helpers ----------
create function pg_temp.eq(label text, got anyelement, want anyelement) returns void language plpgsql as $$
begin
  if got is distinct from want then
    raise exception 'FAIL %: got %, want %', label, got, want;
  end if;
  raise notice 'ok  %', label;
end $$;

create function pg_temp.expect_error(label text, p_sql text, p_state text) returns void language plpgsql as $$
begin
  execute p_sql;
  raise exception 'FAIL %: no error raised', label;
exception when others then
  if sqlstate <> p_state then
    raise exception 'FAIL %: sqlstate % (%), want %', label, sqlstate, sqlerrm, p_state;
  end if;
  raise notice 'ok  % (% %)', label, sqlstate, sqlerrm;
end $$;

create function pg_temp.as_user(p_sub uuid, p_aal text) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims',
    jsonb_build_object('sub', p_sub, 'aal', p_aal, 'role', 'authenticated')::text, false);
  perform set_config('request.jwt.claim.sub', p_sub::text, false);
end $$;
grant execute on all functions in schema pg_temp to public;

-- ---------- fixture ----------
insert into auth.users values ('00000000-0000-0000-0000-00000000000a'), ('00000000-0000-0000-0000-00000000000b');
insert into public.user_roles values ('00000000-0000-0000-0000-00000000000a', 'admin'), ('00000000-0000-0000-0000-00000000000b', 'user');
insert into public.provider_tests values ('b69dea58-2539-4853-adff-8367c01e1218', 'lola-health', 'TruHealth Test');

-- current window: London 1 Oct 00:00 to 9 Oct 00:00 (BST, UTC+1)
insert into public.affiliate_clicks (click_id, clicked_at, provider_id, test_id, source_page, placement, destination_host) values
  (gen_random_uuid(), '2026-10-02 13:57:53Z', 'lola-health', 'b69dea58-2539-4853-adff-8367c01e1218', '/provider/lola-health', 'card', 'lolahealth.com');
-- the automated sweep: 180 clicks over ~135 s on one page
insert into public.affiliate_clicks (click_id, clicked_at, provider_id, test_id, source_page, placement, destination_host)
select gen_random_uuid(), '2026-10-04 02:02:45Z'::timestamptz + (i * interval '750 milliseconds'), 'lola-health',
  'b69dea58-2539-4853-adff-8367c01e1218', '/provider/lola-health', 'card', 'lolahealth.com'
from generate_series(0, 179) i;
-- ordinary clicks, minutes apart
insert into public.affiliate_clicks (click_id, clicked_at, provider_id, test_id, source_page, placement, destination_host) values
  ('11111111-1111-1111-1111-111111111111', '2026-10-05 10:00Z', 'medichecks', 'thyroid-check', '/compare', 'comparison', 'medichecks.com'),
  (gen_random_uuid(), '2026-10-05 10:30Z', 'medichecks', 'thyroid-check', '/compare', 'comparison', 'medichecks.com'),
  (gen_random_uuid(), '2026-10-05 11:00Z', 'medichecks', null, '/compare', 'comparison', 'medichecks.com'),
  -- 23:30 UTC on 5 Oct is 00:30 on 6 Oct in London
  (gen_random_uuid(), '2026-10-05 23:30Z', 'medichecks', null, '/tests/heart', 'card', 'medichecks.com');
-- flagged at ingest
insert into public.affiliate_clicks (click_id, clicked_at, provider_id, test_id, source_page, placement, destination_host, traffic_flag) values
  (gen_random_uuid(), '2026-10-06 12:00Z', 'randox', null, '/tests/heart', 'card', 'randoxhealth.com', 'headless');
-- 9 clicks in 60 s on one page: under the burst threshold, so all qualified
insert into public.affiliate_clicks (click_id, clicked_at, provider_id, test_id, source_page, placement, destination_host)
select gen_random_uuid(), '2026-10-07 09:00Z'::timestamptz + (i * interval '7 seconds'), 'goodbody-clinic', null, '/quiz', 'quiz', 'goodbodyclinic.com'
from generate_series(0, 8) i;
-- previous window
insert into public.affiliate_clicks (click_id, clicked_at, provider_id, test_id, source_page, placement, destination_host) values
  (gen_random_uuid(), '2026-09-25 09:00Z', 'medichecks', null, '/compare', 'comparison', 'medichecks.com'),
  (gen_random_uuid(), '2026-09-28 09:00Z', 'randox', null, '/compare', 'comparison', 'randoxhealth.com');

-- a CSV-imported row the network sync must overwrite, not duplicate
insert into public.affiliate_conversions (provider_id, network_reference, status, converted_at)
values ('medichecks', 'AW1', 'pending', '2026-10-05 11:00Z');

insert into public.os_plugin_snapshots (plugin_id, dataset, payload) values ('ga4', 'overview', '{"x":1}');

-- ---------- clicks summary ----------
set role authenticated;
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a', 'aal2');

create temp table s as
  select public.os_clicks_summary('2026-09-30 23:00Z', '2026-10-08 23:00Z') as j;

select pg_temp.eq('raw clicks', (j->'totals'->>'raw')::int, 195) from s;
select pg_temp.eq('qualified clicks', (j->'totals'->>'qualified')::int, 14) from s;
select pg_temp.eq('excluded clicks', (j->'totals'->>'excluded')::int, 181) from s;
select pg_temp.eq('excluded sweep', (j->'totals'->'excluded_by_reason'->>'sweep')::int, 180) from s;
select pg_temp.eq('excluded headless', (j->'totals'->'excluded_by_reason'->>'headless')::int, 1) from s;
select pg_temp.eq('previous raw', (j->'previous'->>'raw')::int, 2) from s;
select pg_temp.eq('previous qualified', (j->'previous'->>'qualified')::int, 2) from s;
select pg_temp.eq('daily length', jsonb_array_length(j->'daily'), 8) from s;
select pg_temp.eq('first day', j->'daily'->0->>'day', '2026-10-01') from s;
select pg_temp.eq('last day', j->'daily'->7->>'day', '2026-10-08') from s;
select pg_temp.eq('4 Oct excluded', (j->'daily'->3->>'excluded')::int, 180) from s;
select pg_temp.eq('4 Oct qualified', (j->'daily'->3->>'qualified')::int, 0) from s;
select pg_temp.eq('5 Oct qualified (London)', (j->'daily'->4->>'qualified')::int, 3) from s;
select pg_temp.eq('6 Oct qualified (late UTC click)', (j->'daily'->5->>'qualified')::int, 1) from s;
select pg_temp.eq('6 Oct excluded (headless)', (j->'daily'->5->>'excluded')::int, 1) from s;
select pg_temp.eq('7 Oct qualified (9 under threshold)', (j->'daily'->6->>'qualified')::int, 9) from s;
select pg_temp.eq('top provider', j->'by_provider'->0->>'provider_id', 'goodbody-clinic') from s;
select pg_temp.eq('top provider share', (j->'by_provider'->0->>'share')::numeric, 0.6429) from s;
select pg_temp.eq('provider count', jsonb_array_length(j->'by_provider'), 3) from s;
select pg_temp.eq('bursts listed', jsonb_array_length(j->'excluded_bursts'), 1) from s;
select pg_temp.eq('burst size', (j->'excluded_bursts'->0->>'clicks')::int, 180) from s;
select pg_temp.eq('burst page', j->'excluded_bursts'->0->>'source_page', '/provider/lola-health') from s;
select pg_temp.eq('lola test named', (select t->>'test_name' from jsonb_array_elements(j->'top_tests') t where t->>'provider_id' = 'lola-health'), 'TruHealth Test') from s;
select pg_temp.eq('non-uuid test id kept, unnamed', (select t->>'test_name' from jsonb_array_elements(j->'top_tests') t where t->>'test_id' = 'thyroid-check'), null::text) from s;
select pg_temp.eq('last click', (j->>'last_click_at')::timestamptz, '2026-10-07 09:00:56Z'::timestamptz) from s;
select pg_temp.eq('placement shares sum', (select sum((p->>'clicks')::int) from jsonb_array_elements(j->'by_placement') p), 14::bigint) from s;

select pg_temp.expect_error('range reversed', $q$select public.os_clicks_summary('2026-10-08Z', '2026-10-01Z')$q$, '22023');
select pg_temp.expect_error('range too long', $q$select public.os_clicks_summary('2024-01-01Z', '2026-10-01Z')$q$, '22023');

-- Sweep rule edges, ingest bursts, and the previous window across the
-- 29 March 2026 clock change. Dates sit well clear of the October data.
reset role;
insert into public.affiliate_clicks (click_id, clicked_at, provider_id, source_page, placement, destination_host)
select gen_random_uuid(), '2026-03-27 10:00Z'::timestamptz + (i * interval '24 seconds'), 'medichecks', '/spread', 'card', 'medichecks.com'
from generate_series(0, 9) i;
insert into public.affiliate_clicks (click_id, clicked_at, provider_id, source_page, placement, destination_host)
select gen_random_uuid(), '2026-03-27 11:00Z'::timestamptz + (i * interval '10 seconds'), 'randox', '/swept', 'card', 'randoxhealth.com'
from generate_series(0, 9) i;
insert into public.affiliate_clicks (click_id, clicked_at, provider_id, source_page, placement, destination_host, traffic_flag) values
  (gen_random_uuid(), '2026-03-27 12:00Z', 'medichecks', '/tests/a', 'card', 'medichecks.com', 'burst'),
  (gen_random_uuid(), '2026-03-27 12:05Z', 'medichecks', '/tests/b', 'card', 'medichecks.com', 'burst'),
  -- 00:30 GMT on 19 Mar: inside the previous 7 London days (19 to 25 Mar)
  (gen_random_uuid(), '2026-03-19 00:30Z', 'medichecks', '/compare', 'card', 'medichecks.com', null),
  -- 23:30 GMT on 18 Mar: before them
  (gen_random_uuid(), '2026-03-18 23:30Z', 'medichecks', '/compare', 'card', 'medichecks.com', null);
set role authenticated;
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a', 'aal2');
create temp table m as
  select public.os_clicks_summary('2026-03-26 00:00Z', '2026-04-01 23:00Z') as j;
select pg_temp.eq('march raw', (j->'totals'->>'raw')::int, 22) from m;
select pg_temp.eq('10 clicks over 216 s stay qualified', (j->'totals'->>'qualified')::int, 10) from m;
select pg_temp.eq('march sweep', (j->'totals'->'excluded_by_reason'->>'sweep')::int, 10) from m;
select pg_temp.eq('march ingest burst', (j->'totals'->'excluded_by_reason'->>'burst')::int, 2) from m;
select pg_temp.eq('only the page sweep is listed', jsonb_array_length(j->'excluded_bursts'), 1) from m;
select pg_temp.eq('listed sweep page', j->'excluded_bursts'->0->>'source_page', '/swept') from m;
select pg_temp.eq('listed sweep size', (j->'excluded_bursts'->0->>'clicks')::int, 10) from m;
select pg_temp.eq('previous starts at London midnight', (j->'previous'->>'from')::timestamptz, '2026-03-19 00:00Z'::timestamptz) from m;
select pg_temp.eq('previous ends at current start', (j->'previous'->>'to')::timestamptz, '2026-03-26 00:00Z'::timestamptz) from m;
select pg_temp.eq('previous counts London days only', (j->'previous'->>'raw')::int, 1) from m;
select pg_temp.eq('tracking since first click', (j->>'tracking_since')::timestamptz, '2026-03-18 23:30Z'::timestamptz) from m;
-- A window still running is compared with the same part of the previous one.
select pg_temp.eq('running window cut at the same time of day',
  (select w.prev_to = ((now() at time zone 'Europe/London') - interval '7 days') at time zone 'Europe/London'
      and w.prev_from = (d.today - 13)::timestamp at time zone 'Europe/London'
   from (select (now() at time zone 'Europe/London')::date as today) d,
        public.os_previous_window(
          (d.today - 6)::timestamp at time zone 'Europe/London',
          (d.today + 1)::timestamp at time zone 'Europe/London') w), true);

-- ---------- access control ----------
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a', 'aal1');
select pg_temp.expect_error('admin without MFA denied', $q$select public.os_clicks_summary('2026-10-01Z', '2026-10-08Z')$q$, '42501');
select pg_temp.expect_error('admin without MFA cannot set secret', $q$select public.os_set_plugin_secret('ga4', 'GA4_X', 'v')$q$, '42501');
select pg_temp.as_user('00000000-0000-0000-0000-00000000000b', 'aal2');
select pg_temp.expect_error('non-admin denied clicks', $q$select public.os_clicks_summary('2026-10-01Z', '2026-10-08Z')$q$, '42501');
select pg_temp.expect_error('non-admin denied revenue', $q$select public.os_revenue_summary('2026-10-01Z', '2026-10-08Z')$q$, '42501');
select pg_temp.eq('non-admin sees no snapshots', (select count(*) from public.os_plugin_snapshots), 0::bigint);
select pg_temp.expect_error('authenticated cannot read secrets', $q$select public.os_get_plugin_secrets('ga4')$q$, '42501');
select pg_temp.expect_error('authenticated cannot upsert conversions', $q$select public.os_upsert_network_conversions('awin', '[]')$q$, '42501');
reset role;
set role anon;
select pg_temp.expect_error('anon cannot write settings', $q$insert into public.os_plugin_settings (plugin_id) values ('ga4')$q$, '42501');
select pg_temp.expect_error('anon cannot read snapshots', $q$select * from public.os_plugin_snapshots$q$, '42501');
reset role;

-- ---------- settings ----------
set role authenticated;
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a', 'aal2');
select pg_temp.eq('admin sees snapshots', (select count(*) from public.os_plugin_snapshots), 1::bigint);
insert into public.os_plugin_settings (plugin_id, config) values ('ga4', '{"property_id":"123"}');
select pg_temp.eq('settings stamped', (select updated_by from public.os_plugin_settings where plugin_id = 'ga4'), '00000000-0000-0000-0000-00000000000a'::uuid);
update public.os_plugin_settings set enabled = false where plugin_id = 'ga4';
select pg_temp.eq('settings updated', (select enabled from public.os_plugin_settings where plugin_id = 'ga4'), false);
select pg_temp.expect_error('config must be an object', $q$insert into public.os_plugin_settings (plugin_id, config) values ('stripe', '[]')$q$, '23514');

-- ---------- secrets ----------
select public.os_set_plugin_secret('metricool', 'METRICOOL_USER_TOKEN', '  tok123  ');
select public.os_set_plugin_secret('metricool', 'METRICOOL_USER_TOKEN', 'tok456');
select pg_temp.eq('status lists secret', (select count(*) from public.os_plugin_secret_status() where plugin_id = 'metricool' and secret_key = 'METRICOOL_USER_TOKEN'), 1::bigint);
select pg_temp.expect_error('bad key name', $q$select public.os_set_plugin_secret('metricool', 'lower_case', 'x')$q$, '22023');
select pg_temp.expect_error('bad plugin name', $q$select public.os_set_plugin_secret('Metri cool', 'KEY', 'x')$q$, '22023');
reset role;
set role service_role;
select pg_temp.eq('service role reads secret', public.os_get_plugin_secrets('metricool')->>'METRICOOL_USER_TOKEN', 'tok456');
select pg_temp.eq('other plugin isolated', public.os_get_plugin_secrets('metricoo'), '{}'::jsonb);
reset role;
select pg_temp.eq('value stored trimmed then replaced', (select count(*) from vault.secrets where name = 'os_plugin:metricool:METRICOOL_USER_TOKEN' and secret = 'tok456'), 1::bigint);
set role authenticated;
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a', 'aal2');
select public.os_set_plugin_secret('metricool', 'METRICOOL_USER_TOKEN', '   ');
select pg_temp.eq('empty value removes', (select count(*) from public.os_plugin_secret_status()), 0::bigint);
select public.os_set_plugin_secret('metricool', 'METRICOOL_USER_TOKEN', '');
reset role;
select pg_temp.eq('audit rows without values', (select count(*) from public.audit_logs where table_name = 'vault.secrets' and not (new_data::text like '%tok%')), 3::bigint);

-- ---------- network conversions ----------
set role service_role;
select pg_temp.eq('upsert summary', public.os_upsert_network_conversions('awin', $j$[
  {"provider_id":"medichecks","network_reference":"AW1","status":"confirmed","order_value_gbp":"100","commission_gbp":"8.50","converted_at":"2026-10-05T12:00:00Z","click_ref":"11111111-1111-1111-1111-111111111111"},
  {"provider_id":"medichecks","network_reference":"AW1","status":"pending","order_value_gbp":"100","commission_gbp":"8.50","converted_at":"2026-10-05T11:00:00Z","click_ref":null},
  {"provider_id":"medichecks","network_reference":"AW2","status":"pending","order_value_gbp":"50","commission_gbp":"4","converted_at":"2026-10-06T12:00:00Z","click_ref":"not-a-uuid"},
  {"provider_id":"randox","network_reference":"AW3","status":"reversed","order_value_gbp":"80","commission_gbp":"6","converted_at":"2026-10-07T12:00:00Z"},
  {"provider_id":"randox","network_reference":"AW4","status":"weird","converted_at":"2026-10-07T12:00:00Z"}
]$j$), '{"received": 5, "upserted": 3, "matched": 1, "rejected": 2}'::jsonb);
reset role;
select pg_temp.eq('no duplicate AW1', (select count(*) from public.affiliate_conversions where network_reference = 'AW1'), 1::bigint);
select pg_temp.eq('AW1 now from awin', (select source || '/' || status from public.affiliate_conversions where network_reference = 'AW1'), 'awin/confirmed');

set role authenticated;
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a', 'aal2');
create temp table r as select public.os_revenue_summary('2026-09-30 23:00Z', '2026-10-08 23:00Z') as j;
select pg_temp.eq('conversions', (j->'totals'->>'conversions')::int, 2) from r;
select pg_temp.eq('reversed', (j->'totals'->>'reversed')::int, 1) from r;
select pg_temp.eq('commission', (j->'totals'->>'commission_gbp')::numeric, 12.50) from r;
select pg_temp.eq('confirmed commission', (j->'totals'->>'commission_confirmed_gbp')::numeric, 8.50) from r;
select pg_temp.eq('pending commission', (j->'totals'->>'commission_pending_gbp')::numeric, 4.00) from r;
select pg_temp.eq('reversed commission', (j->'totals'->>'commission_reversed_gbp')::numeric, 6.00) from r;
select pg_temp.eq('order value', (j->'totals'->>'order_value_gbp')::numeric, 150.00) from r;
select pg_temp.eq('attributed', (j->'totals'->>'attributed')::int, 1) from r;
select pg_temp.eq('unattributed', (j->'totals'->>'unattributed')::int, 1) from r;
select pg_temp.eq('revenue daily length', jsonb_array_length(j->'daily'), 8) from r;
select pg_temp.eq('5 Oct commission', (j->'daily'->4->>'commission_gbp')::numeric, 8.50) from r;
select pg_temp.eq('by source', j->'by_source'->0->>'source', 'awin') from r;
select pg_temp.eq('top revenue provider', j->'by_provider'->0->>'provider_id', 'medichecks') from r;
reset role;

-- An advertiser mapped after its first sync moves to the mapped provider
-- instead of being counted twice. A CSV copy of the same sale (same
-- reference, within two days) goes too; a CSV row that only shares the
-- reference stays.
insert into public.affiliate_conversions (provider_id, network_reference, status, commission_gbp, converted_at, source)
values ('lola-health', 'AW9', 'pending', 3, '2026-10-06T10:00:00Z', 'csv'),
       ('randox', 'AW9', 'confirmed', 5, '2026-06-01T10:00:00Z', 'csv');
set role service_role;
select public.os_upsert_network_conversions('awin', $j$[
  {"provider_id":"awin-999","network_reference":"AW9","status":"pending","commission_gbp":"3","converted_at":"2026-10-06T09:00:00Z"}
]$j$);
select pg_temp.eq('remap summary', public.os_upsert_network_conversions('awin', $j$[
  {"provider_id":"goodbody-clinic","network_reference":"AW9","status":"confirmed","commission_gbp":"3","converted_at":"2026-10-06T09:00:00Z"},
  {"provider_id":"awin-999","network_reference":"AW9","status":"pending","commission_gbp":"3","converted_at":"2026-10-06T08:00:00Z"}
]$j$), '{"received": 2, "upserted": 1, "matched": 0, "rejected": 1}'::jsonb);
reset role;
select pg_temp.eq('placeholder row removed', (select count(*) from public.affiliate_conversions where provider_id = 'awin-999'), 0::bigint);
select pg_temp.eq('remapped row kept once', (select string_agg(provider_id || '/' || source || '/' || status, ',' order by source) from public.affiliate_conversions where network_reference = 'AW9'), 'goodbody-clinic/awin/confirmed,randox/csv/confirmed');

-- ---------- click carried from a moved copy (20261011150000) ----------
-- A stale copy removed by the upsert hands its click to the replacement row
-- when that row has no click of its own. Precedence: the incoming row's own
-- click_ref, then a click already stored on the row, then the carried click.
-- A carried click counts as matched. Incoming rows below are filed under
-- goodbody-clinic at 2026-10-06 12:00Z unless stated.
insert into public.affiliate_clicks (click_id, clicked_at, provider_id, source_page, placement, destination_host) values
  ('0a000000-0000-4000-8000-000000000001', '2026-10-06 08:00Z', 'lola-health', '/compare', 'comparison', 'lolahealth.com'),
  ('0b000000-0000-4000-8000-000000000001', '2026-10-06 08:00Z', 'goodbody-clinic', '/compare', 'comparison', 'goodbodyclinic.com'),
  ('0b000000-0000-4000-8000-000000000002', '2026-10-06 08:00Z', 'lola-health', '/compare', 'comparison', 'lolahealth.com'),
  ('0c000000-0000-4000-8000-000000000001', '2026-10-07 08:00Z', 'randox', '/compare', 'comparison', 'randoxhealth.com'),
  ('0e000000-0000-4000-8000-000000000001', '2026-10-04 08:00Z', 'lola-health', '/compare', 'comparison', 'lolahealth.com'),
  ('0e000000-0000-4000-8000-000000000002', '2026-10-04 08:00Z', 'lola-health', '/compare', 'comparison', 'lolahealth.com'),
  ('0f000000-0000-4000-8000-000000000001', '2026-10-06 08:00Z', 'goodbody-clinic', '/compare', 'comparison', 'goodbodyclinic.com'),
  ('0f000000-0000-4000-8000-000000000002', '2026-10-06 08:00Z', 'lola-health', '/compare', 'comparison', 'lolahealth.com'),
  ('0f000000-0000-4000-8000-000000000003', '2026-10-06 08:00Z', 'randox', '/compare', 'comparison', 'randoxhealth.com'),
  ('0f000000-0000-4000-8000-000000000004', '2026-10-06 08:00Z', 'lola-health', '/compare', 'comparison', 'lolahealth.com'),
  ('1a000000-0000-4000-8000-000000000001', '2026-10-06 08:00Z', 'goodbody-clinic', '/compare', 'comparison', 'goodbodyclinic.com'),
  ('1a000000-0000-4000-8000-000000000002', '2026-10-06 08:00Z', 'lola-health', '/compare', 'comparison', 'lolahealth.com'),
  ('1a000000-0000-4000-8000-000000000003', '2026-10-06 08:00Z', 'lola-health', '/compare', 'comparison', 'lolahealth.com'),
  ('1b000000-0000-4000-8000-000000000001', '2026-10-06 08:00Z', 'goodbody-clinic', '/compare', 'comparison', 'goodbodyclinic.com'),
  ('1b000000-0000-4000-8000-000000000002', '2026-10-06 08:00Z', 'goodbody-clinic', '/compare', 'comparison', 'goodbodyclinic.com'),
  ('1c000000-0000-4000-8000-000000000001', '2026-10-06 08:00Z', 'randox', '/compare', 'comparison', 'randoxhealth.com');

-- Stale copies already on file. Rows are filed under other providers, so each
-- is a candidate for removal when the network row for its reference arrives.
insert into public.affiliate_conversions (provider_id, network_reference, status, converted_at, source, click_id) values
  -- (a) CSV copy with a click, two hours before the network row
  ('lola-health', 'CARRY-A', 'pending', '2026-10-06 10:00Z', 'csv', '0a000000-0000-4000-8000-000000000001'),
  -- (b) CSV copies whose click loses to the incoming row's own click_ref (B1)
  -- or wins because the incoming click_ref is not one of ours (B2)
  ('lola-health', 'CARRY-B1', 'pending', '2026-10-06 10:00Z', 'csv', '0b000000-0000-4000-8000-000000000002'),
  ('lola-health', 'CARRY-B2', 'pending', '2026-10-06 10:00Z', 'csv', '0b000000-0000-4000-8000-000000000002'),
  -- (d) CSV copy without a click
  ('lola-health', 'CARRY-D', 'pending', '2026-10-06 10:00Z', 'csv', null),
  -- (e) E1 is one second outside the two-day window and stays; E2 sits
  -- exactly on the boundary and moves
  ('lola-health', 'CARRY-E1', 'pending', '2026-10-04 11:59:59Z', 'csv', '0e000000-0000-4000-8000-000000000001'),
  ('lola-health', 'CARRY-E2', 'pending', '2026-10-04 12:00:00Z', 'csv', '0e000000-0000-4000-8000-000000000002'),
  -- (f) F1: an unmapped-advertiser copy three hours early holding the lower
  -- click id, and a CSV copy one hour late; the closer copy wins.
  ('awin-555', 'CARRY-F1', 'pending', '2026-10-06 09:00Z', 'awin', '0f000000-0000-4000-8000-000000000001'),
  ('lola-health', 'CARRY-F1', 'pending', '2026-10-06 13:00Z', 'csv', '0f000000-0000-4000-8000-000000000002'),
  -- F2: two copies an hour either side; the tie goes to the lower click id,
  -- which is inserted second so physical order cannot decide it.
  ('lola-health', 'CARRY-F2', 'pending', '2026-10-06 11:00Z', 'csv', '0f000000-0000-4000-8000-000000000004'),
  ('randox', 'CARRY-F2', 'pending', '2026-10-06 13:00Z', 'csv', '0f000000-0000-4000-8000-000000000003'),
  -- (j) the closest copy has no click; the farther copy's click is carried
  ('lola-health', 'CARRY-J', 'pending', '2026-10-06 12:00Z', 'csv', null),
  ('randox', 'CARRY-J', 'pending', '2026-10-07 12:00Z', 'csv', '1c000000-0000-4000-8000-000000000001');

-- Each batch, and the summary it must return on the first run and on every
-- rerun. Kept in a table so the idempotency check replays the exact input.
create temp table carry_batch (name text primary key, rows jsonb not null, want jsonb not null);
grant select on carry_batch to service_role;
insert into carry_batch values
  ('a', $j$[{"provider_id":"goodbody-clinic","network_reference":"CARRY-A","status":"confirmed","converted_at":"2026-10-06T12:00:00Z"}]$j$,
   '{"received": 1, "upserted": 1, "matched": 1, "rejected": 0}'),
  ('b', $j$[
     {"provider_id":"goodbody-clinic","network_reference":"CARRY-B1","status":"pending","converted_at":"2026-10-06T12:00:00Z","click_ref":" 0B000000-0000-4000-8000-000000000001 "},
     {"provider_id":"goodbody-clinic","network_reference":"CARRY-B2","status":"pending","converted_at":"2026-10-06T12:00:00Z","click_ref":"ffffffff-ffff-4fff-8fff-ffffffffffff"}
   ]$j$, '{"received": 2, "upserted": 2, "matched": 2, "rejected": 0}'),
  ('c', $j$[{"provider_id":"randox","network_reference":"CARRY-C","status":"confirmed","converted_at":"2026-10-07T09:00:00Z"}]$j$,
   '{"received": 1, "upserted": 1, "matched": 1, "rejected": 0}'),
  ('d', $j$[{"provider_id":"goodbody-clinic","network_reference":"CARRY-D","status":"pending","converted_at":"2026-10-06T12:00:00Z"}]$j$,
   '{"received": 1, "upserted": 1, "matched": 0, "rejected": 0}'),
  ('e', $j$[
     {"provider_id":"goodbody-clinic","network_reference":"CARRY-E1","status":"pending","converted_at":"2026-10-06T12:00:00Z"},
     {"provider_id":"goodbody-clinic","network_reference":"CARRY-E2","status":"pending","converted_at":"2026-10-06T12:00:00Z"}
   ]$j$, '{"received": 2, "upserted": 2, "matched": 1, "rejected": 0}'),
  ('f', $j$[
     {"provider_id":"goodbody-clinic","network_reference":"CARRY-F1","status":"pending","converted_at":"2026-10-06T12:00:00Z"},
     {"provider_id":"goodbody-clinic","network_reference":"CARRY-F2","status":"pending","converted_at":"2026-10-06T12:00:00Z"}
   ]$j$, '{"received": 2, "upserted": 2, "matched": 2, "rejected": 0}'),
  ('h', $j$[
     {"provider_id":"goodbody-clinic","network_reference":"CARRY-H1","status":"confirmed","converted_at":"2026-10-06T12:00:00Z"},
     {"provider_id":"goodbody-clinic","network_reference":"CARRY-H2","status":"confirmed","converted_at":"2026-10-06T12:00:00Z"}
   ]$j$, '{"received": 2, "upserted": 2, "matched": 2, "rejected": 0}'),
  ('i', $j$[{"provider_id":"goodbody-clinic","network_reference":"CARRY-I","status":"confirmed","converted_at":"2026-10-06T12:00:00Z","click_ref":"1b000000-0000-4000-8000-000000000002"}]$j$,
   '{"received": 1, "upserted": 1, "matched": 1, "rejected": 0}'),
  ('j', $j$[{"provider_id":"goodbody-clinic","network_reference":"CARRY-J","status":"pending","converted_at":"2026-10-06T12:00:00Z"}]$j$,
   '{"received": 1, "upserted": 1, "matched": 1, "rejected": 0}');

-- One row per reference, as provider/source/click (- for none).
create function pg_temp.carry_rows(p_ref text) returns text language sql as $$
  select string_agg(provider_id || '/' || source || '/' || coalesce(click_id::text, '-'), ',' order by provider_id)
  from public.affiliate_conversions where network_reference = p_ref
$$;

set role service_role;
-- (c) setup: the first sync files the sale under the unmapped advertiser with
-- its click; the advertiser is then mapped to randox (batch c).
select pg_temp.eq('carry: unmapped advertiser stored with its click', public.os_upsert_network_conversions('awin', $j$[
  {"provider_id":"awin-12345","network_reference":"CARRY-C","status":"pending","converted_at":"2026-10-07T09:00:00Z","click_ref":"0c000000-0000-4000-8000-000000000001"}
]$j$), '{"received": 1, "upserted": 1, "matched": 1, "rejected": 0}'::jsonb);
-- (h) setup: H1 is already synced with its own click, H2 without one.
select pg_temp.eq('carry: rows to update stored', public.os_upsert_network_conversions('awin', $j$[
  {"provider_id":"goodbody-clinic","network_reference":"CARRY-H1","status":"pending","converted_at":"2026-10-06T12:00:00Z","click_ref":"1a000000-0000-4000-8000-000000000001"},
  {"provider_id":"goodbody-clinic","network_reference":"CARRY-H2","status":"pending","converted_at":"2026-10-06T12:00:00Z"}
]$j$), '{"received": 2, "upserted": 2, "matched": 1, "rejected": 0}'::jsonb);
-- (i) setup: already synced with one of our clicks; the next sync reports another.
select pg_temp.eq('carry: (i) row stored with a click', public.os_upsert_network_conversions('awin', $j$[
  {"provider_id":"goodbody-clinic","network_reference":"CARRY-I","status":"pending","converted_at":"2026-10-06T12:00:00Z","click_ref":"1b000000-0000-4000-8000-000000000001"}
]$j$), '{"received": 1, "upserted": 1, "matched": 1, "rejected": 0}'::jsonb);
reset role;
-- (h) a later CSV import files each sale again under another provider, with a
-- different click.
insert into public.affiliate_conversions (provider_id, network_reference, status, converted_at, source, click_id) values
  ('lola-health', 'CARRY-H1', 'pending', '2026-10-06 10:00Z', 'csv', '1a000000-0000-4000-8000-000000000002'),
  ('lola-health', 'CARRY-H2', 'pending', '2026-10-06 10:00Z', 'csv', '1a000000-0000-4000-8000-000000000003');

set role service_role;
select pg_temp.eq('carry: first run summary ' || name, public.os_upsert_network_conversions('awin', rows), want)
from carry_batch order by name;
reset role;

-- (a) the CSV copy's click moves onto the Awin row and counts as matched
select pg_temp.eq('carry: (a) CSV click carried, CSV copy removed', pg_temp.carry_rows('CARRY-A'),
  'goodbody-clinic/awin/0a000000-0000-4000-8000-000000000001');
-- (b) the incoming row's own click wins; a click_ref that is not one of our
-- clicks is no click at all, so the copy's click is carried
select pg_temp.eq('carry: (b) own click_ref beats the carried click', pg_temp.carry_rows('CARRY-B1'),
  'goodbody-clinic/awin/0b000000-0000-4000-8000-000000000001');
select pg_temp.eq('carry: (b) unknown click_ref falls back to the carried click', pg_temp.carry_rows('CARRY-B2'),
  'goodbody-clinic/awin/0b000000-0000-4000-8000-000000000002');
-- (c) remapped advertiser keeps its click under the mapped provider
select pg_temp.eq('carry: (c) remap keeps the click', pg_temp.carry_rows('CARRY-C'),
  'randox/awin/0c000000-0000-4000-8000-000000000001');
-- (d) nothing to carry
select pg_temp.eq('carry: (d) copy without a click leaves none', pg_temp.carry_rows('CARRY-D'),
  'goodbody-clinic/awin/-');
-- (e) one second outside the window: not moved, keeps its own click, gives
-- none away; exactly on the boundary: moved, click carried
select pg_temp.eq('carry: (e) copy outside two days stays with its click', pg_temp.carry_rows('CARRY-E1'),
  'goodbody-clinic/awin/-,lola-health/csv/0e000000-0000-4000-8000-000000000001');
select pg_temp.eq('carry: (e) copy at exactly two days moves its click', pg_temp.carry_rows('CARRY-E2'),
  'goodbody-clinic/awin/0e000000-0000-4000-8000-000000000002');
-- (f) closest copy in time wins; on a tie, the lower click id
select pg_temp.eq('carry: (f) closest copy wins', pg_temp.carry_rows('CARRY-F1'),
  'goodbody-clinic/awin/0f000000-0000-4000-8000-000000000002');
select pg_temp.eq('carry: (f) tie goes to the lower click id', pg_temp.carry_rows('CARRY-F2'),
  'goodbody-clinic/awin/0f000000-0000-4000-8000-000000000003');
-- (h) a click already stored on the row is never replaced by a carried one;
-- an empty one is filled
select pg_temp.eq('carry: (h) stored click beats the carried click', pg_temp.carry_rows('CARRY-H1'),
  'goodbody-clinic/awin/1a000000-0000-4000-8000-000000000001');
select pg_temp.eq('carry: (h) empty stored click is filled', pg_temp.carry_rows('CARRY-H2'),
  'goodbody-clinic/awin/1a000000-0000-4000-8000-000000000003');
-- (i) the incoming row's own click replaces a click already stored on the row
select pg_temp.eq('carry: (i) own click_ref beats a stored click', pg_temp.carry_rows('CARRY-I'),
  'goodbody-clinic/awin/1b000000-0000-4000-8000-000000000002');
-- (j) copies without a click are skipped when choosing the closest copy
select pg_temp.eq('carry: (j) closest copy with a click wins', pg_temp.carry_rows('CARRY-J'),
  'goodbody-clinic/awin/1c000000-0000-4000-8000-000000000001');

-- (g) rerunning every batch returns the same summary and changes no row
create temp table carry_before as
  select network_reference, provider_id, source, status, click_id, converted_at
  from public.affiliate_conversions where network_reference like 'CARRY-%';
set role service_role;
select pg_temp.eq('carry: (g) rerun summary ' || name, public.os_upsert_network_conversions('awin', rows), want)
from carry_batch order by name;
reset role;
select pg_temp.eq('carry: (g) rerun changes no row', (
  select count(*) from (
    (select network_reference, provider_id, source, status, click_id, converted_at
       from public.affiliate_conversions where network_reference like 'CARRY-%'
     except all select * from carry_before)
    union all
    (select * from carry_before
     except all select network_reference, provider_id, source, status, click_id, converted_at
       from public.affiliate_conversions where network_reference like 'CARRY-%')
  ) diff), 0::bigint);
select pg_temp.eq('carry: (g) one row per reference except E1', (select count(*) from carry_before), 14::bigint);

-- The re-created function keeps its security and grants.
select pg_temp.eq('carry: still security invoker with fixed search_path',
  (select not prosecdef and proconfig = array['search_path=public']
   from pg_proc where oid = 'public.os_upsert_network_conversions(text, jsonb)'::regprocedure), true);
select pg_temp.eq('carry: executable by service_role only',
  (select string_agg(r || '=' || has_function_privilege(r, 'public.os_upsert_network_conversions(text, jsonb)', 'execute'), ',' order by r)
   from unnest(array['anon', 'authenticated', 'service_role']) r),
  'anon=false,authenticated=false,service_role=true');
select pg_temp.eq('carry: no execute for PUBLIC',
  (select count(*) from pg_proc p, aclexplode(p.proacl) a
   where p.oid = 'public.os_upsert_network_conversions(text, jsonb)'::regprocedure
     and a.grantee = 0 and a.privilege_type = 'EXECUTE'), 0::bigint);

-- ---------- schedules ----------
select pg_temp.eq('sync job scheduled', (select schedule from cron.job where jobname = 'os-plugins-sync'), '23 * * * *');
select pg_temp.eq('retention job scheduled', (select count(*) from cron.job where jobname = 'os-plugin-sync-log-retention'), 1::bigint);
select pg_temp.eq('affiliate retention kept', (select count(*) from cron.job where jobname = 'affiliate-clicks-retention'), 1::bigint);

\echo ALL TESTS PASSED

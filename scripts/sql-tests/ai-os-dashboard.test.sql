-- Assertions for supabase/migrations/20261009160000_ai_os_dashboard.sql.
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
select pg_temp.eq('excluded burst', (j->'totals'->'excluded_by_reason'->>'burst')::int, 180) from s;
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

-- ---------- schedules ----------
select pg_temp.eq('sync job scheduled', (select schedule from cron.job where jobname = 'os-plugins-sync'), '23 * * * *');
select pg_temp.eq('retention job scheduled', (select count(*) from cron.job where jobname = 'os-plugin-sync-log-retention'), 1::bigint);
select pg_temp.eq('affiliate retention kept', (select count(*) from cron.job where jobname = 'affiliate-clicks-retention'), 1::bigint);

\echo ALL TESTS PASSED

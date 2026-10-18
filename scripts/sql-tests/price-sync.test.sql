\set ON_ERROR_STOP 1
-- Scenario checks for the manual price sync (20261018130000). Run by
-- run-price-sync.sh on a throwaway database.

create function pg_temp.check(cond boolean, what text) returns void language plpgsql as $$
begin
  if cond is distinct from true then raise exception 'FAIL: %', what; end if;
  raise notice 'ok: %', what;
end $$;

create function pg_temp.raises(stmt text, state text) returns boolean language plpgsql as $$
begin
  execute stmt;
  return false;
exception when others then
  return sqlstate = state;
end $$;

-- Jobs a request queued for one provider, in order.
create function pg_temp.jobs(p text) returns setof public.mhc_manual_runs language sql as $$
  select * from public.mhc_manual_runs where provider_id = p order by run_after, id
$$;

select set_config('test.uid', '00000000-0000-4000-8000-000000000001', false);

-- Access.
select set_config('test.admin', 'off', false);
select pg_temp.check(pg_temp.raises($$select public.admin_request_price_sync('randox')$$, '42501'), 'non-admin cannot request a sync');
select pg_temp.check(pg_temp.raises($$select public.admin_price_sync_status()$$, '42501'), 'non-admin cannot read sync status');
select set_config('test.admin', 'on', false);
select pg_temp.check(pg_temp.raises($$select public.admin_request_price_sync('tuli-health')$$, '22023'), 'unknown provider is refused');
select pg_temp.check(not has_function_privilege('anon', 'public.admin_request_price_sync(text)', 'execute'), 'anon cannot call the request RPC');
select pg_temp.check(has_function_privilege('authenticated', 'public.admin_request_price_sync(text)', 'execute'), 'signed-in users reach the RPC (it checks admin itself)');
select pg_temp.check(not has_function_privilege('authenticated', 'public.mhc_process_manual_runs()', 'execute'), 'browsers cannot run the queue processor');
select pg_temp.check(not has_table_privilege('authenticated', 'public.mhc_manual_runs', 'select'), 'browsers cannot read the queue table');

-- Randox: one job, no Shopify feed, sent straight away with the cron command.
select public.admin_request_price_sync('randox') as r1 \gset
select pg_temp.check((:'r1'::jsonb -> 'queued' -> 0 ->> 'provider_id') = 'randox', 'randox queued');
select pg_temp.check((:'r1'::jsonb ->> 'feeds_refreshing')::boolean = false, 'randox does not refresh Shopify feeds');
select pg_temp.check((select count(*) = 1 and bool_and(sent_at is not null and request_id is not null and error is null) from pg_temp.jobs('randox')), 'randox job sent at once');
select pg_temp.check((select url from net.requests order by id desc limit 1)
  = 'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-randox-scrape?secret=test-secret&limit=40', 'randox request is the scheduled one, secret read in the database');
select pg_temp.check((select requested_by from pg_temp.jobs('randox')) = '00000000-0000-4000-8000-000000000001', 'request records who asked');

-- Asking again within 15 minutes is refused with the time to retry.
select public.admin_request_price_sync('randox') as r2 \gset
select pg_temp.check(jsonb_array_length(:'r2'::jsonb -> 'queued') = 0, 'second randox request queues nothing');
select pg_temp.check((:'r2'::jsonb -> 'skipped' -> 0 ->> 'reason') like 'A manual sync was requested at %. Try again after %.', 'second request says when to retry');

-- Medical Diagnosis: five batches three minutes apart, first one now.
select public.admin_request_price_sync('medical-diagnosis') as r3 \gset
select pg_temp.check((select count(*) from pg_temp.jobs('medical-diagnosis')) = 5, 'medical diagnosis queues five batches');
select pg_temp.check((select array_agg(round(extract(epoch from run_after - requested_at) / 60)::int order by run_after) from pg_temp.jobs('medical-diagnosis')) = array[0, 3, 6, 9, 12], 'batches keep the schedule''s three-minute spacing');
select pg_temp.check((select count(*) filter (where sent_at is not null) from pg_temp.jobs('medical-diagnosis')) = 1, 'only the first batch goes out now');
select public.admin_request_price_sync('medical-diagnosis') as r4 \gset
select pg_temp.check((:'r4'::jsonb -> 'skipped' -> 0 ->> 'reason') = 'A manual sync is already queued.', 'a provider with queued batches cannot be queued again');

-- The processor sends batches once they are due, and nothing early.
select pg_temp.check(public.mhc_process_manual_runs() = 0, 'processor sends nothing early');
update public.mhc_manual_runs set run_after = now() - interval '1 second'
  where provider_id = 'medical-diagnosis' and sent_at is null;
select pg_temp.check(public.mhc_process_manual_runs() = 4, 'processor sends the four due batches');
select pg_temp.check((select count(*) from net.requests where url like '%mhc-page-scrape?secret=test-secret&provider=medical-diagnosis&offset=%') = 5, 'all five medical diagnosis batch requests sent');

-- Medichecks with no feed copy: feeds fetched first, pages two minutes apart after that.
select public.admin_request_price_sync('medichecks') as r5 \gset
select pg_temp.check((:'r5'::jsonb ->> 'feeds_refreshing')::boolean, 'medichecks refreshes the Shopify feeds');
select pg_temp.check((select count(*) from net.requests where url like 'https://%/products.json?limit=250&page=%') = 9, 'all nine feed pages requested');
select pg_temp.check((select array_agg(round(extract(epoch from run_after - requested_at) / 60)::int order by run_after) from pg_temp.jobs('medichecks')) = array[2, 4, 6], 'medichecks pages wait for the feeds, two minutes apart');
select pg_temp.check((select count(*) filter (where sent_at is null) from pg_temp.jobs('medichecks')) = 3, 'no medichecks page goes out before the feeds');

-- Clinilabs with a fresh feed copy: sent at once, no second feed fetch.
select count(*) as feeds_before from net.requests where url like '%products.json%' \gset
select public.admin_request_price_sync('clinilabs') as r6 \gset
select pg_temp.check((:'r6'::jsonb ->> 'feeds_refreshing')::boolean = false, 'a fresh feed copy is reused');
select pg_temp.check((select count(*) from net.requests where url like '%products.json%') = :feeds_before, 'no extra feed requests');
select pg_temp.check((select bool_and(sent_at is not null) from pg_temp.jobs('clinilabs')), 'clinilabs sent at once');

-- A provider synced by the schedule in the last 15 minutes is skipped.
insert into public.scrape_runs (provider_id, scraper_function, status, started_at, finished_at, tests_seen, tests_updated)
values ('lola-health', 'mhc-shopify-sync', 'success', now() - interval '5 minutes', now() - interval '4 minutes', 30, 2);
select public.admin_request_price_sync('lola-health') as r7 \gset
select pg_temp.check((:'r7'::jsonb -> 'skipped' -> 0 ->> 'reason') like 'Prices were synced at %. Try again after %.', 'recently synced provider is skipped');

-- A job whose cron command has changed shape is never replayed.
update cron.job set command = 'select 1' where jobname = 'mhc-lml';
select count(*) as reqs_before from net.requests \gset
select public.admin_request_price_sync('london-medical-laboratory') as r8 \gset
select pg_temp.check((select error from pg_temp.jobs('london-medical-laboratory')) = 'The scheduled job is missing or is not a price sync request.', 'tampered job is refused');
select pg_temp.check((select count(*) from net.requests) = :reqs_before, 'tampered job sends nothing');

-- A provider whose cron job is gone is reported, not queued.
select cron.unschedule('mhc-goodbody');
select public.admin_request_price_sync('goodbody-clinic') as r9 \gset
select pg_temp.check((:'r9'::jsonb -> 'skipped' -> 0 ->> 'reason') = 'Its scheduled sync job was not found.', 'missing job is reported');

-- Sync all: only providers not already queued, synced or cooling down.
select public.admin_request_price_sync(null) as r10 \gset
select pg_temp.check((select array_agg(x ->> 'provider_id' order by x ->> 'provider_id') from jsonb_array_elements(:'r10'::jsonb -> 'queued') x) = array['london-health-company'], 'sync all queues only the eligible provider');
select pg_temp.check(jsonb_array_length(:'r10'::jsonb -> 'skipped') = 7, 'sync all lists the seven skipped providers');

-- Status.
insert into public.scrape_runs (provider_id, scraper_function, status, started_at, finished_at, tests_seen, tests_updated, tests_new, errors) values
  ('medichecks', 'mhc-medichecks-sync', 'partial', now() - interval '3 hours', now() - interval '3 hours', 250, 3, 1, '["one"]'),
  ('medichecks', 'mhc-medichecks-sync', 'success', now() - interval '2 hours 56 minutes', now() - interval '2 hours 55 minutes', 250, 1, 0, '[]'),
  ('medichecks', 'mhc-medichecks-sync', 'success', now() - interval '9 hours', now() - interval '9 hours', 999, 999, 0, '[]');
insert into net._http_response (id, status_code)
  select request_id, 500 from pg_temp.jobs('clinilabs');
select public.admin_price_sync_status() as s \gset
select pg_temp.check(jsonb_array_length(:'s'::jsonb) = 8, 'status lists all eight providers');
select pg_temp.check((select x -> 'last_cycle' ->> 'status' from jsonb_array_elements(:'s'::jsonb) x where x ->> 'provider_id' = 'medichecks') = 'partial', 'latest cycle status is the worst of its runs');
select pg_temp.check((select (x -> 'last_cycle' ->> 'tests_seen')::int from jsonb_array_elements(:'s'::jsonb) x where x ->> 'provider_id' = 'medichecks') = 500, 'latest cycle sums only its own runs');
select pg_temp.check((select (x ->> 'queued_jobs')::int from jsonb_array_elements(:'s'::jsonb) x where x ->> 'provider_id' = 'medichecks') = 3, 'status shows queued medichecks pages');
select pg_temp.check((select (x ->> 'active_tests')::int from jsonb_array_elements(:'s'::jsonb) x where x ->> 'provider_id' = 'randox') = 3, 'status counts active tests only');
select pg_temp.check((select x ->> 'last_request_failure' from jsonb_array_elements(:'s'::jsonb) x where x ->> 'provider_id' = 'clinilabs') = 'The sync answered 500.', 'status reports a failed manual request');
select pg_temp.check((select (x ->> 'next_scheduled_at')::timestamptz > now() and (x ->> 'next_scheduled_at')::timestamptz <= now() + interval '6 hours'
  from jsonb_array_elements(:'s'::jsonb) x where x ->> 'provider_id' = 'randox'), 'next scheduled run is within six hours');
select pg_temp.check((select extract(minute from (x ->> 'next_scheduled_at')::timestamptz) = 14 and extract(hour from (x ->> 'next_scheduled_at')::timestamptz at time zone 'UTC')::int % 6 = 0
  from jsonb_array_elements(:'s'::jsonb) x where x ->> 'provider_id' = 'randox'), 'randox next run lands on its cron slot (:14 of a six-hour hour)');

select pg_temp.check((select count(*) from cron.job where jobname = 'mhc-manual-runs' and schedule = '* * * * *') = 1, 'queue processor scheduled every minute');
\echo ALL PASSED

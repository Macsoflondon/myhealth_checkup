-- Scenario checks for system_health_check() (migration 20261016190000).
-- Run with scripts/sql-tests/run-system-health.sh.
\set ON_ERROR_STOP 1
-- Fresh healthy state.
insert into public.scrape_runs
select p, 'success', now() - interval '1 hour'
from unnest(array['medichecks','clinilabs','lola-health','goodbody-clinic','london-health-company','randox','medical-diagnosis','london-medical-laboratory']) p;
insert into cron.job (jobname, schedule, command) values ('mhc-lola', '8 */6 * * *', 'select 1');
insert into cron.job_run_details select jobid, 'succeeded', now() - interval '2 hours', '1 row' from cron.job where jobname = 'mhc-lola';
insert into public.os_plugin_settings values ('search_console', true), ('site_status', true);
insert into public.os_plugin_sync_log values
  ('search_console', 'ok', now() - interval '30 minutes', null),
  ('site_status', 'error', now() - interval '30 minutes', 'down'),
  ('site_status', 'error', now() - interval '90 minutes', 'down');

create function pg_temp.check(cond boolean, what text) returns void language plpgsql as $$
begin
  if not cond then raise exception 'FAIL: %', what; end if;
  raise notice 'ok: %', what;
end $$;

-- Run 1: nothing to evaluate from probes yet; everything else healthy.
select public.system_health_check() as run1 \gset
select pg_temp.check((select count(*) from public.sent_alerts) = 0, 'run 1 sends nothing');
select pg_temp.check((select count(*) from public.system_health_probes) = 3, 'run 1 requests three probes');
select pg_temp.check((select count(*) from public.system_health_state where status = 'down') = 0, 'run 1 nothing down');
select pg_temp.check(not exists (select 1 from public.system_health_state where check_id like 'plugin:site_status'), 'site_status plugin left to probes');
select pg_temp.check((select (:'run1'::jsonb->>'checked')::int) = 11, 'run 1 checks 8 providers, 1 cron job, os sync, 1 plugin');

-- Run 2: site 200, AI engine 500 (first failure, threshold 2): no email.
select public.fake_answer(200, '<html><title>Compare private blood tests</title></html>', 500);
select public.system_health_check();
select pg_temp.check((select count(*) from public.sent_alerts) = 0, 'run 2 one AI failure sends nothing');
select pg_temp.check((select consecutive_failures from public.system_health_state where check_id = 'ai_engine') = 1, 'run 2 counts one AI failure');
select pg_temp.check((select status from public.system_health_state where check_id = 'site:https://myhealthcheckup.co.uk/') = 'ok', 'run 2 apex ok');

-- Run 3: www shows the Lovable placeholder, AI still 500: AI goes down.
select public.fake_answer(200, '<html>real</html>', 500, 404, '<html><title>No published build</title></html>');
select public.system_health_check();
select pg_temp.check((select count(*) from public.sent_alerts) = 1, 'run 3 sends one email');
select pg_temp.check((select body->>'alert_type' from public.sent_alerts order by id desc limit 1) = 'system_down', 'run 3 email is system_down');
select pg_temp.check((select body->>'subject' from public.sent_alerts order by id desc limit 1) = '[MHC] Down: AI test finder (ai-human-context)', 'run 3 subject names the AI engine');
select pg_temp.check((select body->'lines'->>0 from public.sent_alerts order by id desc limit 1) like '%answered 500%', 'run 3 line carries the 500');
select pg_temp.check((select status from public.system_health_state where check_id = 'site:https://www.myhealthcheckup.co.uk/') = 'ok', 'run 3 www one failure not yet down');

-- Run 4: www placeholder again: www goes down; AI already alerted, no reminder.
select public.fake_answer(200, '<html>real</html>', 500, 404, '<html><title>No published build</title></html>');
select public.system_health_check();
select pg_temp.check((select count(*) from public.sent_alerts) = 2, 'run 4 sends a second email');
select pg_temp.check((select body->>'subject' from public.sent_alerts order by id desc limit 1) = '[MHC] Down: Public site https://www.myhealthcheckup.co.uk/', 'run 4 subject names www');
select pg_temp.check((select body->'lines'->>0 from public.sent_alerts order by id desc limit 1) like '%no published build. Republish%', 'run 4 says republish');
select pg_temp.check(jsonb_array_length((select body->'lines' from public.sent_alerts order by id desc limit 1)) = 1, 'run 4 does not repeat the AI engine');

-- Run 5: Medichecks stale for 14 hours: price sync down at once.
update public.scrape_runs set started_at = now() - interval '14 hours' where provider_id = 'medichecks';
select public.fake_answer(200, '<html>real</html>', 500, 404, '<html>no published build</html>');
select public.system_health_check();
select pg_temp.check((select body->>'subject' from public.sent_alerts order by id desc limit 1) = '[MHC] Down: Price sync: medichecks', 'run 5 alerts the stale provider');

-- Run 6: www recovers, Medichecks syncs: one recovery email naming both.
insert into public.scrape_runs values ('medichecks', 'partial', now());
select public.fake_answer(200, '<html>real</html>', 500);
select public.system_health_check();
select pg_temp.check((select body->>'alert_type' from public.sent_alerts order by id desc limit 1) = 'system_recovered', 'run 6 sends a recovery');
select pg_temp.check(jsonb_array_length((select body->'lines' from public.sent_alerts order by id desc limit 1)) = 2, 'run 6 recovery lists both');
select pg_temp.check((select status from public.system_health_state where check_id = 'site:https://www.myhealthcheckup.co.uk/') = 'ok', 'run 6 www ok');

-- Run 7: the AI engine last alerted 25 hours ago: one reminder.
update public.system_health_state set last_alerted_at = now() - interval '25 hours' where check_id = 'ai_engine';
select public.fake_answer(200, '<html>real</html>', 500);
select count(*) as before7 from public.sent_alerts \gset
select public.system_health_check();
select pg_temp.check((select count(*) from public.sent_alerts) = :before7 + 1, 'run 7 sends a reminder');
select pg_temp.check((select body->>'subject' from public.sent_alerts order by id desc limit 1) like '[MHC] Still down: AI test finder%', 'run 7 subject says still down');

-- Run 8: a cron job fails and search_console fails twice; probes left pending.
insert into cron.job_run_details select jobid, 'failed', now() - interval '1 minute', 'ERROR: boom' from cron.job where jobname = 'mhc-lola';
insert into public.os_plugin_sync_log values
  ('search_console', 'error', now() - interval '5 minutes', '403 forbidden'),
  ('search_console', 'error', now() - interval '4 minutes', '403 forbidden');
select count(*) as before8 from public.sent_alerts \gset
select consecutive_failures as ai_before8 from public.system_health_state where check_id = 'ai_engine' \gset
select public.system_health_check();
select pg_temp.check((select count(*) from public.sent_alerts) = :before8 + 1, 'run 8 sends one email for both');
select pg_temp.check((select body->>'subject' from public.sent_alerts order by id desc limit 1) like '[MHC] Down: %Scheduled job mhc-lola%', 'run 8 names the cron job');
select pg_temp.check((select body->>'subject' from public.sent_alerts order by id desc limit 1) like '%AI OS plugin search_console%', 'run 8 names the plugin');
select pg_temp.check((select consecutive_failures from public.system_health_state where check_id = 'ai_engine') = :ai_before8, 'run 8 pending probe gives no verdict');

-- Run 9: a probe nobody answered for over five minutes counts as a failure.
update public.system_health_probes set requested_at = now() - interval '6 minutes' where probe_id = 'site:https://myhealthcheckup.co.uk/';
select public.system_health_check();
select pg_temp.check((select detail from public.system_health_state where check_id = 'site:https://myhealthcheckup.co.uk/') = 'No response within five minutes.', 'run 9 unanswered probe fails');

select pg_temp.check((select count(*) from cron.job where jobname = 'system-health-check' and schedule = '*/10 * * * *') = 1, 'cron job scheduled every ten minutes');
\echo ALL PASSED

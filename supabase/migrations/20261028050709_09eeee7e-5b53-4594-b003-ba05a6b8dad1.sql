-- Automatically hide tests a provider has removed from its own catalogue.
-- Every mhc-* sync stamps last_validated_at on each test it still finds on the
-- provider site. A test unseen for 72 hours (12 missed six-hourly runs) has been
-- delisted. Guards stop a broken or rate-limited scraper hiding live tests:
--  * the provider must have a successful scrape_runs row in the last 12 hours;
--  * at least 80% of its active tests must have been confirmed in the last 24 hours;
--  * no more than 20% of a provider's active tests are hidden in one run.
-- Rows are set is_active = false, never deleted, and each change is logged.
create or replace function public.reconcile_delisted_provider_tests()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  r record;
  v_result jsonb := '[]'::jsonb;
  v_hidden int;
begin
  for r in
    select pt.provider_id,
           count(*) as active_rows,
           count(*) filter (where coalesce(pt.last_validated_at, pt.scraped_at) > now() - interval '24 hours') as fresh_rows
    from provider_tests pt
    where pt.is_active
    group by pt.provider_id
  loop
    if not exists (
      select 1 from scrape_runs sr
      where sr.provider_id = r.provider_id
        and sr.status = 'success'
        and sr.started_at > now() - interval '12 hours'
    ) then
      v_result := v_result || jsonb_build_object('provider', r.provider_id, 'skipped', 'no_recent_successful_run');
      continue;
    end if;

    if r.fresh_rows::numeric / greatest(r.active_rows, 1) < 0.8 then
      v_result := v_result || jsonb_build_object('provider', r.provider_id, 'skipped', 'coverage_below_80_percent',
        'fresh', r.fresh_rows, 'active', r.active_rows);
      continue;
    end if;

    with stale as (
      select id, test_name, price, url
      from provider_tests
      where provider_id = r.provider_id
        and is_active
        and coalesce(last_validated_at, scraped_at) < now() - interval '72 hours'
      order by coalesce(last_validated_at, scraped_at)
      limit greatest(floor(r.active_rows * 0.2)::int, 1)
    ), upd as (
      update provider_tests pt
      set is_active = false, data_status = 'stale', updated_at = now()
      from stale
      where pt.id = stale.id
      returning pt.id, stale.test_name, stale.price, stale.url
    ), logged as (
      insert into product_change_log (provider_test_id, provider_id, change_type, old_value, new_value, changed_by)
      select upd.id::text, r.provider_id, 'delisted_auto',
             jsonb_build_object('is_active', true, 'test_name', upd.test_name, 'price', upd.price, 'url', upd.url),
             jsonb_build_object('is_active', false, 'reason', 'not found on provider site for 72 hours'),
             'reconcile_delisted_provider_tests'
      from upd
      returning 1
    )
    select count(*) into v_hidden from logged;

    v_result := v_result || jsonb_build_object('provider', r.provider_id, 'hidden', v_hidden);
  end loop;
  return jsonb_build_object('ran_at', now(), 'providers', v_result);
end;
$$;

revoke execute on function public.reconcile_delisted_provider_tests() from public, anon, authenticated;

select cron.schedule(
  'mhc-reconcile-delisted-6h',
  '41 */6 * * *',
  $cron$select public.reconcile_delisted_provider_tests();$cron$
);

-- Rollback:
-- select cron.unschedule('mhc-reconcile-delisted-6h');
-- drop function if exists public.reconcile_delisted_provider_tests();
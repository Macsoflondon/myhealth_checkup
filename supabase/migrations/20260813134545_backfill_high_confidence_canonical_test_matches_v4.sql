-- Restored verbatim from supabase_migrations.schema_migrations (version 20260813134545, name backfill_high_confidence_canonical_test_matches_v4).
-- md5 of the recorded statements: 146838775e4ad91dd032481a9c2a7d18
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


with candidates as (
  select distinct on (tm.id, pt.provider_id)
    pt.id as provider_test_uuid,
    pt.provider_id,
    coalesce(pt.provider_test_id, pt.provider_id || '-' || pt.id::text) as provider_test_id,
    pt.test_name as provider_test_name,
    pt.price as current_price,
    pt.sample_type as sample_collection_method,
    pt.turnaround_days as turnaround_time_days,
    tm.id as test_master_id
  from provider_tests pt
  join tests_master tm
    on tm.is_active = true
   and lower(tm.test_name) = lower(pt.test_name)
  where pt.is_active = true
    and coalesce(pt.is_addon, false) = false
    and not (
      (pt.test_name ~* '\ywom(a|e)n\y' and tm.test_name !~* '\ywom(a|e)n\y')
      or (tm.test_name ~* '\ywom(a|e)n\y' and pt.test_name !~* '\ywom(a|e)n\y')
      or (pt.test_name ~* '\ymen\y|\ymale\y' and tm.test_name !~* '\ymen\y|\ymale\y')
      or (tm.test_name ~* '\ymen\y|\ymale\y' and pt.test_name !~* '\ymen\y|\ymale\y')
    )
    and not exists (
      select 1 from provider_test_mapping ptm2 where ptm2.provider_test_uuid = pt.id
    )
    and not exists (
      select 1 from provider_test_mapping ptm3
      where ptm3.test_master_id = tm.id and ptm3.provider_id = pt.provider_id
    )
  order by tm.id, pt.provider_id, pt.id
)
insert into provider_test_mapping (
  provider_test_uuid, provider_id, provider_test_id, provider_test_name,
  current_price, sample_collection_method, turnaround_time_days, test_master_id,
  availability_status, last_scraped_at
)
select
  provider_test_uuid, provider_id, provider_test_id, provider_test_name,
  current_price, sample_collection_method, turnaround_time_days, test_master_id,
  'available', now()
from candidates;

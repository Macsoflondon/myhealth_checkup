-- Restored verbatim from supabase_migrations.schema_migrations (version 20260813134653, name relink_stale_mapping_rows_to_live_provider_tests).
-- md5 of the recorded statements: 7f7609958885d2cd78dea1dcf727f110
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


-- 9 of the original 70 mapping rows already asserted a (test_master_id,
-- provider_id) pairing that matches a live provider_tests row exactly on
-- test name, but were never linked to it (provider_test_uuid null, and
-- provider_test_id using a slug the scraper no longer writes). Repair the
-- link rather than insert a duplicate, since the unique constraint on
-- (test_master_id, provider_id) means only one row can exist per pair.
with live_match as (
  select distinct on (ptm.id)
    ptm.id as mapping_id,
    pt.id as provider_test_uuid,
    pt.provider_test_id,
    pt.price as current_price,
    pt.sample_type as sample_collection_method,
    pt.turnaround_days as turnaround_time_days
  from provider_test_mapping ptm
  join provider_tests pt
    on pt.provider_id = ptm.provider_id
   and lower(pt.test_name) = lower(ptm.provider_test_name)
   and pt.is_active = true
   and coalesce(pt.is_addon, false) = false
  where ptm.provider_test_uuid is null
  order by ptm.id, pt.id
)
update provider_test_mapping ptm
set provider_test_uuid = lm.provider_test_uuid,
    provider_test_id = coalesce(lm.provider_test_id, ptm.provider_test_id),
    current_price = coalesce(lm.current_price, ptm.current_price),
    sample_collection_method = coalesce(lm.sample_collection_method, ptm.sample_collection_method),
    turnaround_time_days = coalesce(lm.turnaround_time_days, ptm.turnaround_time_days),
    updated_at = now()
from live_match lm
where ptm.id = lm.mapping_id;

-- Restored verbatim from supabase_migrations.schema_migrations (version 20260706112805, name deactivate_stool_test_pending_price_refresh).
-- md5 of the recorded statements: 5003525f4de35058692cd481f31ecf49
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


update public.provider_tests
set is_active = false, url_verified = false
where provider_id = 'medical-diagnosis'
  and test_name = 'Stool Bacteria and Parasites PCR'
  and price = 1;

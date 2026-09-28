-- Restored verbatim from supabase_migrations.schema_migrations (version 20260706121413, name randox_dedupe_everyman).
-- md5 of the recorded statements: d62854360a6f869090b96652a9a0e015
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


delete from public.provider_tests
where provider_id = 'randox' and is_active = true
  and test_name = 'Everyman' and price = 416
  and url = 'https://randoxhealth.com/en-GB/product/clinic/everyman-test';

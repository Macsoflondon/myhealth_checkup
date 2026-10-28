-- Restored verbatim from supabase_migrations.schema_migrations (version 20261026141546, name randox_collection_method_casing).
-- md5 of the recorded statements: 28e35f6c1a7abf6e416ba20459950f99
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

update provider_tests set collection_method = 'Home kit: ' || sample_type, updated_at = now()
where provider_id = 'randox' and public.provider_test_product_path(url) like 'home/%' and sample_type is not null;

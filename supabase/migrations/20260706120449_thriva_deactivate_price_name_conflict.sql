-- Restored verbatim from supabase_migrations.schema_migrations (version 20260706120449, name thriva_deactivate_price_name_conflict).
-- md5 of the recorded statements: 256cb8471f3949aad58827c35b540c5d
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


update public.provider_tests
set is_active = false, url_verified = false
where provider_id = 'thriva'
  and test_name = 'Omega-3 & 6 Home Blood Test £98'
  and price = 133;

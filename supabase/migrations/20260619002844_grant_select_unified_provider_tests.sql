-- Restored verbatim from supabase_migrations.schema_migrations (version 20260619002844, name grant_select_unified_provider_tests).
-- md5 of the recorded statements: 0069f11041f4a7d5f633fe3a6b98b998
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

grant select on public.unified_provider_tests to anon, authenticated;

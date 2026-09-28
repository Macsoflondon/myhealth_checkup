-- Restored verbatim from supabase_migrations.schema_migrations (version 20260813134816, name restrict_comparison_test_groups_to_read_only).
-- md5 of the recorded statements: 762ee53397aa7f17f8977f243f642ae1
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

revoke insert, update, delete, truncate on comparison_test_groups from anon, authenticated;

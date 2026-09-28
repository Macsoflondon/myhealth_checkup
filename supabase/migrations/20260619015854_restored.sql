-- Restored verbatim from supabase_migrations.schema_migrations (version 20260619015854).
-- md5 of the recorded statements: 4dad8ff4bc6fc539a07030e26d226f2d
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

ALTER VIEW public.unified_provider_tests SET (security_invoker = true);

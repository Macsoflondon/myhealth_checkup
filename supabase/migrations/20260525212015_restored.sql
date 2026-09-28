-- Restored verbatim from supabase_migrations.schema_migrations (version 20260525212015).
-- md5 of the recorded statements: b9123308200f5b916262eeebcd0c730c
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

UPDATE public.provider_tests 
SET price = 175 
WHERE id IN ('43aaf7fe-8786-4ad5-89ac-a300c00e9de5', 'bdf88d6f-5e7d-497d-9a94-54b253a96af4');

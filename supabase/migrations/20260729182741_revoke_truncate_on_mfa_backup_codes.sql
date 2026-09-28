-- Restored verbatim from supabase_migrations.schema_migrations (version 20260729182741, name revoke_truncate_on_mfa_backup_codes).
-- md5 of the recorded statements: ae2daf52e8aafca39c3eadb443ccf098
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- TRUNCATE is not subject to RLS, so leaving it granted would let any
-- authenticated role wipe every user's backup codes in one statement.
revoke truncate, trigger, references on public.mfa_backup_codes from authenticated, anon;

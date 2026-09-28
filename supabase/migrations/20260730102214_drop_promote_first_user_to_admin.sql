-- Restored verbatim from supabase_migrations.schema_migrations (version 20260730102214, name drop_promote_first_user_to_admin).
-- md5 of the recorded statements: 6c16fbb793420582b690ea9d84b8315a
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- This trigger granted admin to any signup that happened to be the only user in
-- auth.users. Admin is already established, so it has no remaining purpose and
-- leaves a privilege-escalation path open if the users table ever reached zero.
-- Profile creation is handled separately by handle_new_user_profile().
drop trigger if exists on_auth_user_created_engine on auth.users;
drop function if exists public.promote_first_user_to_admin();

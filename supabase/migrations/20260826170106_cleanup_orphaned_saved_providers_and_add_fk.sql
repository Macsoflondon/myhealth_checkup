-- Restored verbatim from supabase_migrations.schema_migrations (version 20260826170106, name cleanup_orphaned_saved_providers_and_add_fk).
-- md5 of the recorded statements: c9651bfcefd05b328996efd940aa3d01
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- All 11 rows in saved_providers reference auth.users rows that no longer
-- exist (deleted accounts) — confirmed via left join, 11/11 orphaned, 0 live.
-- Purge them, then add the FK so this can never silently reaccumulate again.
delete from public.saved_providers sp
where not exists (select 1 from auth.users u where u.id = sp.user_id);

alter table public.saved_providers
  add constraint saved_providers_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

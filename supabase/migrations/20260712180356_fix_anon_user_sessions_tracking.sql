-- Restored verbatim from supabase_migrations.schema_migrations (version 20260712180356, name fix_anon_user_sessions_tracking).
-- md5 of the recorded statements: 80213000f3b3d1c25ce9c60779289f42
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


-- FIX: anonymous visitors were getting 401 on every user_sessions write,
-- silently breaking session/analytics tracking sitewide. Restore intended
-- anonymous session tracking (non-sensitive analytics only). Health data
-- tables remain locked. Upsert (on_conflict=session_id) needs INSERT + UPDATE.
create policy "anon_insert_user_sessions"
  on public.user_sessions for insert
  to anon, authenticated
  with check (true);

create policy "anon_update_user_sessions"
  on public.user_sessions for update
  to anon, authenticated
  using (true)
  with check (true);

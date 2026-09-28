-- Restored verbatim from supabase_migrations.schema_migrations (version 20260712230546, name harden_user_sessions_policies).
-- md5 of the recorded statements: e1a8c809c55dc3067b94b9d81008f419
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


-- Replace the always-true anon policies with scoped ones:
-- anon (auth.uid() null) may only write anonymous rows; authenticated may only write their own.
-- Clears the rls_policy_always_true warning while keeping anonymous session tracking working.
drop policy if exists "anon_insert_user_sessions" on public.user_sessions;
drop policy if exists "anon_update_user_sessions" on public.user_sessions;

create policy "anon_insert_user_sessions" on public.user_sessions
  for insert to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));

create policy "anon_update_user_sessions" on public.user_sessions
  for update to anon, authenticated
  using (user_id is null or user_id = (select auth.uid()))
  with check (user_id is null or user_id = (select auth.uid()));

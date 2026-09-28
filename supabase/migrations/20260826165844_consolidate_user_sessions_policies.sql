-- Restored verbatim from supabase_migrations.schema_migrations (version 20260826165844, name consolidate_user_sessions_policies).
-- md5 of the recorded statements: 89a1f7ab8a65b37494a3da445474d052
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- Performance advisor: multiple_permissive_policies on user_sessions for
-- (anon, INSERT), (authenticated, INSERT), (authenticated, UPDATE).
-- Cause: "admin_user_sessions" is a single ALL/public policy that overlaps with
-- "anon_insert_user_sessions" (INSERT) and "users_update_own_user_sessions" (UPDATE)
-- on every matching command, so both permissive policies re-run per row.
-- Fix: split the admin ALL policy into per-command policies and OR the admin
-- condition directly into the INSERT/UPDATE policies it overlapped with.
-- Net authorization is identical (permissive policies already OR together) —
-- this only removes the duplicate evaluation.

DROP POLICY IF EXISTS "admin_user_sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "anon_insert_user_sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "users_update_own_user_sessions" ON public.user_sessions;

CREATE POLICY "admin_select_user_sessions" ON public.user_sessions
  FOR SELECT
  TO public
  USING (has_role((select auth.uid()), 'admin'::app_role));

CREATE POLICY "admin_delete_user_sessions" ON public.user_sessions
  FOR DELETE
  TO public
  USING (has_role((select auth.uid()), 'admin'::app_role));

CREATE POLICY "insert_user_sessions" ON public.user_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (user_id IS NULL)
    OR (user_id = (select auth.uid()))
    OR has_role((select auth.uid()), 'admin'::app_role)
  );

CREATE POLICY "update_user_sessions" ON public.user_sessions
  FOR UPDATE
  TO authenticated
  USING (
    (user_id = (select auth.uid()))
    OR has_role((select auth.uid()), 'admin'::app_role)
  )
  WITH CHECK (
    (user_id = (select auth.uid()))
    OR has_role((select auth.uid()), 'admin'::app_role)
  );

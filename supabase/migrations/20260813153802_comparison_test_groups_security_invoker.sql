-- Restored verbatim from supabase_migrations.schema_migrations (version 20260813153802, name comparison_test_groups_security_invoker).
-- md5 of the recorded statements: c6b38ef7da1f6095eccc76d9935160f6
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- comparison_test_groups was flagged by the Supabase security linter as
-- SECURITY DEFINER (it runs with the view creator's privileges rather than
-- the querying user's, so it can silently bypass RLS on the underlying
-- table). In practice provider_tests already has a fully public SELECT
-- policy ("Provider tests are viewable by everyone", qual: true), so this
-- was not an active data exposure -- but it is still bad practice, since a
-- future tightening of that policy would not automatically apply to this
-- view. Switch it to security_invoker so it always respects the querying
-- user's own RLS, with no behavioural change today.
ALTER VIEW public.comparison_test_groups SET (security_invoker = true);

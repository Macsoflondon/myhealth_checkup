-- Restored from supabase_migrations.schema_migrations (version 20260313101001).
-- md5 of the recorded statements: aae9ec2973d17c55f75fa442a6a94b22
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.
--
-- Replay adaptation: the recorded statement inserted the rows unconditionally. That
-- user exists only in production, so a fresh database failed the foreign key to
-- auth.users. The rows are now inserted only when the user exists. Result in
-- production is identical.


INSERT INTO public.user_roles (user_id, role)
SELECT u.id, r.role::public.app_role
FROM auth.users u
CROSS JOIN (VALUES ('admin'), ('user')) AS r(role)
WHERE u.id = 'd9f18008-53f2-4bc5-a034-a12954445370'
ON CONFLICT (user_id, role) DO NOTHING;

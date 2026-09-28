-- Restored verbatim from supabase_migrations.schema_migrations (version 20260829113925, name biomarker_canonical_security_hardening).
-- md5 of the recorded statements: 914f3e4b606c8186dcaac74efc31721a
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- The view must enforce the querying user's RLS, not the creator's.
ALTER VIEW public.biomarkers_canonical SET (security_invoker = on);

-- The terminology sync function is a trigger helper and must not be
-- callable over the REST API.
REVOKE EXECUTE ON FUNCTION public.sync_primary_terminology_code() FROM PUBLIC, anon, authenticated;

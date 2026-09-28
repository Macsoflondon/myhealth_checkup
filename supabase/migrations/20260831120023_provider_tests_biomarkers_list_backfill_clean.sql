-- Restored verbatim from supabase_migrations.schema_migrations (version 20260831120023, name provider_tests_biomarkers_list_backfill_clean).
-- md5 of the recorded statements: bd6b946e50c07811fc26302a2dc2fc97
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- Re-apply the same trigger logic retroactively. A no-op UPDATE on
-- biomarkers_list fires trg_strip_biomarker_junk on every existing row,
-- so the cleanup logic lives in exactly one place.

UPDATE public.provider_tests
SET biomarkers_list = biomarkers_list
WHERE biomarkers_list @> '["Most popular tests"]'::jsonb
   OR biomarkers_list @> '["Dr Natasha Fernando Medical Director"]'::jsonb;

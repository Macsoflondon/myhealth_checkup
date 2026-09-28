-- Restored verbatim from supabase_migrations.schema_migrations (version 20260706121942, name randox_confidante_biomarker_count).
-- md5 of the recorded statements: f9a21a823e2b62b0277ef70efc592065
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


update public.provider_tests set biomarker_count = 10
where provider_id = 'randox' and test_name = 'Confidante Home STI Test';

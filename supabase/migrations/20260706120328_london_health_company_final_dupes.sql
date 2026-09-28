-- Restored verbatim from supabase_migrations.schema_migrations (version 20260706120328, name london_health_company_final_dupes).
-- md5 of the recorded statements: 0f6230ac5b9f83d535b93e4f0b52e9ad
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


delete from public.provider_tests
where provider_id = 'london-health-company' and is_active = true
  and test_name in (
    'Early Pregnancy Blood Test | Accurate Beta HCG Blood Testing',
    'Ultimate Comprehensive Male Hormone Panel (8 Biomarkers)'
  );

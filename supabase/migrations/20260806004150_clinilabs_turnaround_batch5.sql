-- Restored verbatim from supabase_migrations.schema_migrations (version 20260806004150, name clinilabs_turnaround_batch5).
-- md5 of the recorded statements: f26f8a822c5cffaf2a2cbfc905401dea
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


update provider_tests set turnaround_days = 1, turnaround_raw = 'Same Day', turnaround_unit = 'days', turnaround_not_stated = false, last_validated_at = now()
where id in (
  'e261e4c9-af82-4ad1-a62d-25759605894a', -- Apolipoprotein A1 (APO A1)
  '1d4c110d-7a74-4cfc-a88e-10b603607a2e', -- Apolipoprotein B (APO B)
  '36e4e356-8b2c-4bfb-8a1e-4663842ad332'  -- BhCG (Quantitative)
);

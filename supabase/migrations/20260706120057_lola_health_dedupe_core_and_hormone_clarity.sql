-- Restored verbatim from supabase_migrations.schema_migrations (version 20260706120057, name lola_health_dedupe_core_and_hormone_clarity).
-- md5 of the recorded statements: 2010c9de1d556f238a21b5001fd62e32
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


-- Remove stale wrong-category duplicate (Core Health is a multi-system panel, not liver-specific)
delete from public.provider_tests
where provider_id = 'lola-health'
  and test_name = 'Core Health Blood Test'
  and url = 'https://lolahealth.com/products/core-health';

-- Remove stale duplicate (URL slug matches "Female Hormones Clarity" directly)
delete from public.provider_tests
where provider_id = 'lola-health'
  and test_name = 'Menopause Clarity 31'
  and url = 'https://lolahealth.com/products/female-hormones-clarity';

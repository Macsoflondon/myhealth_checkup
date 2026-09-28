-- Restored verbatim from supabase_migrations.schema_migrations (version 20260706120524, name lml_fix_categories).
-- md5 of the recorded statements: d95e2baaf53f0cd9f5a3cea60cacf2b7
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


update public.provider_tests set category = 'Women''s Health'
where provider_id = 'london-medical-laboratory' and is_active = true
  and test_name in ('Female Hair Loss Advanced', 'Female Sexual Health - Advanced Screen');

update public.provider_tests set category = 'General Health'
where provider_id = 'london-medical-laboratory' and is_active = true
  and test_name = 'Weight-loss management';

update public.provider_tests set category = 'Men''s Health'
where provider_id = 'london-medical-laboratory' and is_active = true
  and category = 'Mens Health';

update public.provider_tests set category = 'Fatigue & Energy'
where provider_id = 'london-medical-laboratory' and is_active = true
  and category = 'Fatigue';

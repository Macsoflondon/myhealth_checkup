-- Restored verbatim from supabase_migrations.schema_migrations (version 20260706120555, name platform_wide_category_naming_normalisation).
-- md5 of the recorded statements: 7c8bbc13b234630057bdc76434df0445
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


update public.provider_tests set category = 'Allergy'
where is_active = true and category = 'Allergy & Sensitivity';

update public.provider_tests set category = 'Liver Function'
where is_active = true and category = 'Liver Health';

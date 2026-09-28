-- Restored verbatim from supabase_migrations.schema_migrations (version 20260706114012, name medichecks_cleanup_junk_dupes_categories).
-- md5 of the recorded statements: eab279e285ee65702513fe6f570c8cda
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


-- Remove scraper error row
delete from public.provider_tests
where provider_id = 'medichecks' and test_name = '404 Not Found';

-- Remove stale inactive duplicate rows (same URL, same price as the live active row)
delete from public.provider_tests
where provider_id = 'medichecks'
  and is_active = false
  and url in (
    'https://www.medichecks.com/products/well-man-advanced-blood-test',
    'https://www.medichecks.com/products/male-hormone-check-blood-test',
    'https://www.medichecks.com/products/essential-blood-ultravit'
  );

-- Re-categorise
update public.provider_tests set category = 'Hormones'
where provider_id = 'medichecks' and is_active = true
  and test_name = 'Prolactin Blood Test - At Home Prolactin Blood Testing';

update public.provider_tests set category = 'Cancer Screening'
where provider_id = 'medichecks' and is_active = true
  and test_name = 'PSA Blood Test for Prostate Cancer Investigations';

update public.provider_tests set category = 'General Health'
where provider_id = 'medichecks' and is_active = true
  and test_name = 'Uric Acid Blood Test for Gout Risk Check';

-- Restored verbatim from supabase_migrations.schema_migrations (version 20260706113033, name cleanup_clinilabs_categories_and_nontest).
-- md5 of the recorded statements: d008c117eb27f6bf6e24bc71f85a9cc6
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


-- Remove non-test service fee scraped in as a product
delete from public.provider_tests
where provider_id = 'clinilabs'
  and test_name = 'Phlebotomy (Venous draw) at clinic';

-- Kidney Function
update public.provider_tests set category = 'Kidney Function'
where provider_id = 'clinilabs' and is_active = true
  and test_name in ('Advanced Kidney (Renal) Function blood test', 'Phosphate Blood Test', 'BUN (Blood Urea Nitrogen) Blood Test');

-- Hormones
update public.provider_tests set category = 'Hormones'
where provider_id = 'clinilabs' and is_active = true
  and test_name in ('Cortisol Blood Test', 'Dehydroepiandrosterone Sulphate (DHEA-S) Blood Test');

-- General Health
update public.provider_tests set category = 'General Health'
where provider_id = 'clinilabs' and is_active = true
  and test_name in ('ABO Type (Blood Grouping) Blood Test', 'Lipase Blood Test', 'Calcium Blood Test', 'Tired All the Time Blood Test');

-- Liver Function
update public.provider_tests set category = 'Liver Function'
where provider_id = 'clinilabs' and is_active = true
  and test_name in ('Alanine Aminotransferase (ALT) Blood Test', 'Alkaline Phosphatase (ALP) Blood Test', 'Albumin Blood Test');

-- Allergy
update public.provider_tests set category = 'Allergy'
where provider_id = 'clinilabs' and is_active = true
  and test_name = 'ALEX³ Allergy Test (300 Allergens)';

-- Diabetes
update public.provider_tests set category = 'Diabetes'
where provider_id = 'clinilabs' and is_active = true
  and test_name = 'Insulin Blood Test';

-- Women's Health
update public.provider_tests set category = 'Women''s Health'
where provider_id = 'clinilabs' and is_active = true
  and test_name in ('Essentials Female Hormone blood test', 'Female Hormone Blood Test', 'Female Hair Loss Blood Test');

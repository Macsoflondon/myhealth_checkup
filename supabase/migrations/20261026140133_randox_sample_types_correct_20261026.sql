-- Restored verbatim from supabase_migrations.schema_migrations (version 20261026140133, name randox_sample_types_correct_20261026).
-- md5 of the recorded statements: ab02c651e92c0a76fb742ed55bf7eda1
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

with m(path, sample) as (values
 ('home/amh-home-test','Capillary blood (QuickDraw upper-arm device)'),
 ('home/female-hormone-quickdraw','Capillary blood (QuickDraw upper-arm device)'),
 ('home/general-health-test','Capillary blood (QuickDraw upper-arm device)'),
 ('home/heart-health-test','Capillary blood (QuickDraw upper-arm device)'),
 ('home/male-hormone-quickdraw','Capillary blood (QuickDraw upper-arm device)'),
 ('home/psa-home-test','Capillary blood (QuickDraw upper-arm device)'),
 ('home/thyroid-function-home-test','Capillary blood (QuickDraw upper-arm device)'),
 ('home/type-1-diabetes-home-test','Capillary blood (QuickDraw upper-arm device)'),
 ('home/vitamin-b12-test','Capillary blood (QuickDraw upper-arm device)'),
 ('home/vitamin-d-test','Capillary blood (QuickDraw upper-arm device)'),
 ('home/amh-home-test-finger','Finger-prick'),
 ('home/heart-health-test-finger','Finger-prick'),
 ('home/coeliac-disease-home-test-kit','Saliva'),
 ('home/haemochromatosis-home-test-kit','Saliva'),
 ('home/lactose-intolerance-home-test-kit','Saliva'),
 ('home/nutrition-lifestyle-dna-home-test-kit','Saliva'),
 ('home/gut-microbiome-test','Stool'),
 ('home/fracture-risk-assessment-test-kit','Nail clipping'),
 ('home/home-sti-test','Urine or swab'),
 ('clinic/sti-test','Urine or swab'),
 ('clinic/simplyhealth-sti-urine-next-day','Urine or swab'),
 ('clinic/complete-sti-test','Venous blood and urine or swab'),
 ('clinic/simplyhealth-complete-sti-test','Venous blood and urine or swab'))
update provider_tests pt set sample_type = m.sample, updated_at = now()
from m where pt.provider_id='randox' and public.provider_test_product_path(pt.url)=m.path and pt.sample_type is distinct from m.sample;

update provider_tests set sample_type='Venous', updated_at=now()
where provider_id='randox' and public.provider_test_product_path(url) like 'clinic/%'
  and public.provider_test_product_path(url) not in ('clinic/sti-test','clinic/simplyhealth-sti-urine-next-day','clinic/complete-sti-test','clinic/simplyhealth-complete-sti-test')
  and public.provider_test_product_path(url) not in (select product_path from provider_test_exclusions where provider_id='randox')
  and sample_type is distinct from 'Venous';

update provider_tests set home_kit_available = (public.provider_test_product_path(url) like 'home/%'),
  clinic_visit_available = (public.provider_test_product_path(url) like 'clinic/%')
where provider_id='randox';

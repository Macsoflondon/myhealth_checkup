
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

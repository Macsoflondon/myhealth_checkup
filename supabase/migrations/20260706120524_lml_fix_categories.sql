
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

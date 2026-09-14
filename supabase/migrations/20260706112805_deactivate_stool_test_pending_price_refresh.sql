
update public.provider_tests
set is_active = false, url_verified = false
where provider_id = 'medical-diagnosis'
  and test_name = 'Stool Bacteria and Parasites PCR'
  and price = 1;

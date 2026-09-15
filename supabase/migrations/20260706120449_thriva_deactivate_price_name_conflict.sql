
update public.provider_tests
set is_active = false, url_verified = false
where provider_id = 'thriva'
  and test_name = 'Omega-3 & 6 Home Blood Test £98'
  and price = 133;

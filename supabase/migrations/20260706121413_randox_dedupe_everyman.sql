
delete from public.provider_tests
where provider_id = 'randox' and is_active = true
  and test_name = 'Everyman' and price = 416
  and url = 'https://randoxhealth.com/en-GB/product/clinic/everyman-test';

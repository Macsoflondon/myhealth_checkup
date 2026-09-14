
-- Remove stale wrong-category duplicate (Core Health is a multi-system panel, not liver-specific)
delete from public.provider_tests
where provider_id = 'lola-health'
  and test_name = 'Core Health Blood Test'
  and url = 'https://lolahealth.com/products/core-health';

-- Remove stale duplicate (URL slug matches "Female Hormones Clarity" directly)
delete from public.provider_tests
where provider_id = 'lola-health'
  and test_name = 'Menopause Clarity 31'
  and url = 'https://lolahealth.com/products/female-hormones-clarity';

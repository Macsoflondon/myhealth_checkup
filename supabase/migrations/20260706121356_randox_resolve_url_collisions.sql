
-- Fix genuinely mismapped URL: Everyman Complete belongs on its own confirmed URL
update public.provider_tests
set url = 'https://randoxhealth.com/en-GB/product/clinic/everyman-test', url_verified = true
where provider_id = 'randox' and test_name = 'Everyman Complete';

-- "Signature" (non-Platinum) is wrongly sharing the confirmed Signature Platinum URL; deactivate pending correct URL
update public.provider_tests
set is_active = false, url_verified = false
where provider_id = 'randox' and test_name = 'Signature' and price = 2112;

-- Clean same-price dedupes (verified identical price = same product, safe to merge)
delete from public.provider_tests
where provider_id = 'randox' and is_active = true
  and (
    (test_name = 'Thyroid Health' and price = 60) or
    (test_name = 'Everywoman' and price = 416) or
    (test_name = 'General Health Test' and price = 84) or
    (test_name = 'Express PCR UTI Test' and price = 149)
  );

-- Thyroid home test: keep Quickdraw variant + one standard-price row, drop the extra duplicate
delete from public.provider_tests
where provider_id = 'randox' and is_active = true
  and test_name = 'Thyroid Blood Test' and price = 37
  and url = 'https://randoxhealth.com/en-GB/product/home/thyroid-function-home-test';

-- PSA home test: keep confirmed Quickdraw variant, deactivate the two conflicting "standard" prices pending verification
update public.provider_tests
set is_active = false, url_verified = false
where provider_id = 'randox' and is_active = true
  and url = 'https://randoxhealth.com/en-GB/product/home/psa-home-test'
  and test_name in ('Home PSA Test Kit (Prostate Specific Antigen)', 'Home PSA Test (Prostate Specific Antigen)');

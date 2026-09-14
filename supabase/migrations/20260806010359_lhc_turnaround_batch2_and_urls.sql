
update provider_tests set turnaround_days=2, turnaround_raw='24-48 hours', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id in (
 '1f9819c7-d426-44ab-99cd-2eeb4c6a15f8', -- A1c
 '4886c186-aa09-425a-874c-4353c998321d'  -- Female Hormone Panel
);
update provider_tests set turnaround_days=3, turnaround_raw='2-3 working days', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = '331d69d5-f6c3-4284-a7dc-174cb0b8225e'; -- Magnesium & Calcium

update provider_tests set url='https://londonhealthcompany.co.uk/products/advanced-prostate-health-screening-psa-blood-test', turnaround_days=2, turnaround_raw='24-48 hours', turnaround_unit='days', turnaround_not_stated=false, url_verified=true, url_verified_at=now(), last_validated_at=now()
where id = 'd3596a6d-9208-48aa-a750-0c2531266858'; -- Advanced Prostate Screening

update provider_tests set url='https://londonhealthcompany.co.uk/products/iron-test-add-on', turnaround_days=2, turnaround_raw='24-48 hours', turnaround_unit='days', turnaround_not_stated=false, url_verified=true, url_verified_at=now(), last_validated_at=now()
where id = 'c599bc1e-c4ce-4306-ad93-5c03dd92a371'; -- Iron Test Add-on

update provider_tests set url='https://londonhealthcompany.co.uk/products/tsh-blood-test-kit', turnaround_days=3, turnaround_raw='1-3 days', turnaround_unit='days', turnaround_not_stated=false, url_verified=true, url_verified_at=now(), last_validated_at=now()
where id = '99da417e-718a-4150-aca6-c7c86e76c630'; -- TSH Blood Test Kit

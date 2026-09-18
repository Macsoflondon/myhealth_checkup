
update provider_tests set turnaround_days=12, turnaround_raw='2-3 weeks (12 working days)', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = '3bb60288-c3d3-4d9e-b0fa-c7166701130a'; -- TruCheck

update provider_tests set turnaround_days=10, turnaround_raw='10 working days', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = 'a7017243-b3f8-4434-88f5-df31904fbb50'; -- Female Hormone and Fertility

update provider_tests set url='https://goodbodyclinic.com/products/pcos-polycystic-ovary-syndrome-blood-test', url_verified=true, url_verified_at=now(), last_validated_at=now()
where id = '193e931b-3ce8-4070-bc57-529aab2f28f0'; -- PCOS URL fix (turnaround still pending)

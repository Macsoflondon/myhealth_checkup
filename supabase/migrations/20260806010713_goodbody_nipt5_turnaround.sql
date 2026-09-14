
update provider_tests set turnaround_days=7, turnaround_raw='within a week', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = '31859aa9-1fd6-4d1f-a44f-e8a912b94567'; -- PrenatalSAFE 5 NIPT

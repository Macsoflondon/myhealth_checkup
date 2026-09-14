
update provider_tests set turnaround_days=3, turnaround_not_stated=false, last_validated_at=now()
where id = '4ba80f5b-2a02-4573-85d6-15c228eed94c'; -- Diabetes (HbA1c) Blood Test To Take At Home, matches sibling medichecks SKU

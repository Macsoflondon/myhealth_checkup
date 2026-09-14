
update provider_tests set turnaround_days = 1, turnaround_raw = 'Same Day', turnaround_unit = 'days', turnaround_not_stated = false, last_validated_at = now()
where id = 'cb0bc4dc-9421-4e32-b9fe-887ceaae1853'; -- Albumin Blood Test, confirmed "Same Day" on page


update provider_tests set turnaround_days = 1, turnaround_raw = 'Same Day', turnaround_unit = 'days', turnaround_not_stated = false, last_validated_at = now()
where id in (
  'e261e4c9-af82-4ad1-a62d-25759605894a', -- Apolipoprotein A1 (APO A1)
  '1d4c110d-7a74-4cfc-a88e-10b603607a2e', -- Apolipoprotein B (APO B)
  '36e4e356-8b2c-4bfb-8a1e-4663842ad332'  -- BhCG (Quantitative)
);

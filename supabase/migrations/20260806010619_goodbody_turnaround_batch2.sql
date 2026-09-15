
update provider_tests set turnaround_days=5, turnaround_raw='3-5 working days', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id in (
 'c129e8ee-f0c2-4205-bf97-350ef768685b', -- Advanced Well Man
 'e4a0f3c5-23c9-4739-acb1-c70ea1855c98', -- Advanced Well Woman
 '21e66cbd-22e6-4efc-81c5-51b765ea651b', -- Vitamins Blood Test
 '3ee1e171-4834-4393-af37-3978beb7879e', -- General Health Blood Test
 'e4d0ee31-e86c-4550-9116-f0b97211275b', -- Testosterone Blood Test
 '36c8e57b-4769-48c6-ab94-7a9f9e0497ae', -- Thyroid Function with Antibodies
 'edf883c9-c688-4a29-af91-83514dc06dd4', -- Tiredness and Fatigue
 '7cfb1912-1927-420e-8f9a-0e554130a6e0', -- Sports and Fitness
 'dd4ad1db-4093-4321-85fa-f2278767c40e'  -- Prostate PSA (confirmed 3-5 via search too)
);
-- Correction: live page shows Cardiac Risk as 3-5 working days, not 10 (recrawl correction)
update provider_tests set turnaround_days=5, turnaround_raw='3-5 working days', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = '48634a9a-af70-4169-af68-d8991817599e'; -- Cardiac Risk

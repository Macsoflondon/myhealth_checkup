
-- Fill turnaround for confirmed "Same Day" Clinilabs listings (verified live on each product page)
update provider_tests
set turnaround_days = 1,
    turnaround_raw = 'Same Day',
    turnaround_unit = 'days',
    turnaround_not_stated = false,
    last_validated_at = now()
where id in (
  'd9349932-443c-4d1e-a797-504fb6aa6828', -- Anti-Mullerian Hormone (AMH) Blood Test
  '20aebc36-fd9f-4817-ba59-1a431575412b', -- Aspartate Aminotransferase (AST) Blood Test
  '5c0e2fb4-5a78-42c4-9e3c-dcf1c98ea3fb', -- Female Hormone Blood Test
  '2d081ef7-a1a1-40a7-b9de-cd88738fa514', -- Essentials Female Hormone blood test
  '8343ffdb-d393-47b6-bbac-6438fef6ab85'  -- Alphafetoprotein (AFP) Blood Test
);

-- Deactivate broken homepage-URL duplicates now that the real product page sibling is confirmed & filled
update provider_tests
set is_active = false,
    updated_at = now()
where id in (
  '7992ac8a-6ecc-42aa-b623-61d37d6097a7', -- dup of AMH, url = homepage
  'e92e3e4c-8883-4d9e-a28f-50d0a5b1e035'  -- dup of AST/SGOT, url = homepage
);

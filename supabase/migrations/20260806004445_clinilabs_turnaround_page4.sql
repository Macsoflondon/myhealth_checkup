
update provider_tests set turnaround_days=1, turnaround_raw='Same Day', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id in (
 '9c37bcad-8012-4eba-9fbf-509c5fb402b7', -- Liver Function Tests
 '4b1cddf5-5187-4da7-8118-99be0bfbc1ca', -- LH
 '442f46de-c040-4058-97c1-c115b4860a92', -- Magnesium
 '3151addb-eb45-474d-942e-f9f7c1d490d9', -- Male hormone
 '2f3548f3-8df2-4268-b240-f894680c80f9', -- Menopause Blood Test
 '0acfc543-e836-4793-9d4a-203b94af97a7', -- Menopause Profile
 'ca3b4197-81f1-4de6-9120-106612aee482', -- Oestradiol
 '8d3469a8-5d00-4132-9a3f-fd3ccd92e396', -- OV Monitor CA 125
 '2ed8f1d0-a8b5-49b0-9469-ba74dddcc0fc', -- Ozempic/Wegovy/Mounjaro
 'ab3d27c4-93f2-4c57-b61b-fdc60760e760', -- Phosphate
 'e5db02aa-3e51-4cfb-8692-db78f0ff4da4', -- Potassium
 'cb5cb70a-10f0-441f-9a9d-7c03bd26968a', -- Pregnancy (HCG)
 '25159c74-2d3d-4a8c-956c-97d92300fec0', -- Progesterone
 'b5769bb6-1095-40f8-9575-706b6aec4ba3', -- Prolactin
 '3a358eac-20a4-4aa1-bf13-7cd4f6638021', -- PSA
 '98d08b2f-036c-4154-9f18-66bfe2d28e9c', -- PTH
 '45046e7f-cfbe-49c0-9af3-ffc3bf1ef608'  -- Rubella IgG
);
update provider_tests set turnaround_days=2, turnaround_raw='2 Days', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id in (
 '67bdbe02-5c65-4c5d-940a-40c92433e4bd', -- Measles IgG
 'c081efff-b11f-43b7-bf14-4b006bceb0fc', -- MMR
 '2aa4e701-8381-4868-851d-692d9e4e82b8', -- Mumps IgG
 '60a56ada-54cb-4b02-ac11-1d89f6646171'  -- qFIT
);
update provider_tests set turnaround_days=6, turnaround_raw='6 Days', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = 'ca952858-16bf-4509-822b-7cc38bf6f43d'; -- Mineral Screen
update provider_tests set turnaround_days=10, turnaround_raw='10 Days', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = '34d86fd9-ba45-4aac-a12f-4bfeea6960d7'; -- Mineral Screen and Industrial Heavy Metal Screen

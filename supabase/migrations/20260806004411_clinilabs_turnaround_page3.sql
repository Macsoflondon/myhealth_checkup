
update provider_tests set turnaround_days=1, turnaround_raw='Same Day', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id in (
 '936b967f-ae2d-4e12-a9d3-b19e454d9372', -- Free T3
 'a6e3d52c-f64f-41b8-b900-e156c6cd43fb', -- Free T4
 '21042ef4-3872-4903-8dc5-75709f65cb6d', -- Full Blood Count
 '357b50ec-e599-4f30-9e24-81a30a185c71', -- GI Monitor CA 19-9
 'aaeb88a8-92a0-49dd-9cb6-5ab402869fc6', -- Globulin
 '78ce3cfc-3f74-47d1-8e70-47ca9f64fd6f', -- Glucose
 '9c3a7c1a-d297-4a4a-b4d3-89bda205222c', -- Glucose Tolerance Test
 '838dab49-cfaf-46df-bbe6-b8167669af50', -- HbA1c
 'd9cef768-be11-4b20-82be-c7a1cea6e118', -- HDL Cholesterol
 'e3341705-78a5-418f-9e96-7aeb5fdd82e5', -- Hep B Core Antibody IgM
 '66955963-074f-4500-beb0-7b02c42c747f', -- Hep B Immunity
 '63291fa3-9190-4cd9-b74e-1b55d2aacc0f', -- Hep B Profile
 'ac6587fd-f7a5-4788-8f26-92b34c39fc71', -- Hep B Surface Antigen
 '27cc3732-5bd0-433c-8c60-51a41422a416', -- HIV 1&2
 '407c5365-43eb-4d01-8e77-becd31b5ff53', -- Insulin
 'c4dc5593-85f1-4a73-97b5-d7857db86893', -- Insulin Resistance
 'ead00c2e-52ca-4d85-840d-76249445e877', -- Iron
 '3dd83412-c508-496c-8fd9-58af71eab7fa', -- Iron Status
 '03f60428-a286-484f-bc63-e7bd92efccfa', -- LDH
 '5e2449a1-8fbd-4b3d-a113-59ab606d6eef', -- LDL Cholesterol
 '76b8fd17-c139-402e-b631-537a2b396ee9'  -- Lipoprotein (a)
);
update provider_tests set turnaround_days=1, turnaround_raw='1 Day', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = 'cf24110d-aa9f-4c68-864e-e4f95508fd09'; -- IVF and STI Pre-Screening
update provider_tests set turnaround_days=2, turnaround_raw='2 Days', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = 'e6c596bd-67da-4d44-820c-a9c8d3b6f699'; -- Lipase

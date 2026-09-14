
update provider_tests set turnaround_days = 2, turnaround_raw = '2 Days', turnaround_unit = 'days', turnaround_not_stated = false, last_validated_at = now()
where id = '341b2367-2ece-4cb6-87dd-38201de6c3d3'; -- ABO Type (Blood Grouping), confirmed "2 Days" on page

update provider_tests set turnaround_days = 1, turnaround_raw = 'Same Day', turnaround_unit = 'days', turnaround_not_stated = false, last_validated_at = now()
where id in (
  '1128babf-c1ea-4a50-9052-7c3a5912c358', -- Accutane (Isotretinoin) Treatment Blood Test
  'd484b596-656e-406a-8af8-af1cfd9f1cc5', -- Advanced Cholesterol Test (lipid-test)
  '42c8284c-ae5c-4813-850c-d674b34b0239', -- Advanced Diabetes Test
  '24240399-0436-46d4-9bf4-6dacf55a4c8e', -- Advanced Kidney (Renal) Function blood test
  '05c3c67d-ee82-4910-b0a8-57ba92b48ec5', -- Advanced Liver Function blood test
  '1dd5a601-78ec-4cc6-b1f9-b6aa3698728b', -- Advanced Thyroid Function blood test
  'c9f935ac-339b-4c02-b3e3-31bf21d9febe'  -- Alanine Aminotransferase (ALT) Blood Test
);

update provider_tests set turnaround_days = 2, turnaround_raw = '2 days', turnaround_unit = 'days', turnaround_not_stated = false, last_validated_at = now()
where id = 'bbf9025b-f5bf-4032-8102-843734718a0f'; -- Advanced Female Fertility Check, confirmed "2 days" on page

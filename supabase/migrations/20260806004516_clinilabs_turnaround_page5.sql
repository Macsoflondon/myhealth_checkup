
update provider_tests set turnaround_days=1, turnaround_raw='Same Day', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id in (
 '7b9fbe31-c572-4ef8-ae58-8b2dbf3c47c7', -- SHBG
 'eb23b76c-720c-47a2-b646-6fa1cff00e93', -- Sodium
 '0879f148-a7fe-4a35-b4c8-9f1e6f14f705', -- Syphilis TP Latex
 'a9f7d051-53ad-4fe3-890e-d50a2e24a64b', -- T3
 '63ca2a76-4d5c-4ac1-ae31-dbee0f029f8e', -- T4
 '6e6ff9c1-6700-4408-987d-da4a7b30f57c', -- Testosterone
 '15bc8f37-2312-4157-80bd-b8ac5a93d3a0', -- TRT
 '4511d7c1-88b1-4a51-ae8e-ab1ff49f044b', -- Thyroglobulin Antibody
 '45657754-5e81-40d7-8488-b59198c02180', -- Thyroglobulin
 '2aeb629a-5f2a-40b6-ad49-100ab8b02b5d', -- Thyroid function blood test
 '316b213b-0b08-4739-a9da-2b79a4f58df2', -- TPO Antibody
 'a0898d1f-6576-4d1e-b99e-9f1c45a24044', -- Tired All the Time
 'd746e476-231a-4bd6-ac6c-d490e695d13c', -- Total Protein
 '90db81af-9a7e-4e01-9b0d-2a45772b8f9a', -- TSH
 '8f1c6291-00d3-408b-a8ac-d4104bc03363', -- Tumour Markers Female
 'e4bd2a78-166d-4c39-aa9c-5a6b7aeac981', -- Tumour Markers Male
 '5acd5bbc-497d-443e-9bda-c48f6a09684f', -- Ultimate Male Fertility
 'd5105811-c197-4c9b-be39-70bdb9f5da9f', -- Ultimate Performance
 'e84dfe1a-d6e4-4e66-bceb-e9afc8d41768', -- Ultimate Prostate Check
 '80b96126-a607-4985-bfab-5a40bab3fd71'  -- Ultimate Testosterone
);
update provider_tests set turnaround_days=1, turnaround_raw='1 Day', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = '51528910-2af8-4dd3-a219-acb2983c39d6'; -- Ultimate Diabetes Test
update provider_tests set turnaround_days=2, turnaround_raw='2 Days', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id in (
 '48d96f94-5438-4806-87e8-e7a55cebc884', -- Ultimate Female Fertility
 '6dd5936a-21ea-4bc5-8ed1-12f513c806c0'  -- Ultimate Longevity Check
);
update provider_tests set turnaround_days=5, turnaround_raw='5 Days', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = 'ef85a4c6-1257-4ff5-9791-a0baaf796960'; -- TB Quantiferon

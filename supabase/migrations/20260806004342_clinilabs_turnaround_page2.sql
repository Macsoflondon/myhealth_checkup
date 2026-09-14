
update provider_tests set turnaround_days=1, turnaround_raw='Same Day', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id in (
 'c10db932-2e1d-4cf6-af53-3c5eeb17dfa7', -- BUN
 'a09f47ab-b149-4ee6-8178-b949918613f3', -- CA 15-3
 '8870b686-9894-4153-a858-3c756ddf8fb9', -- Calcium
 '3ec76087-d9a4-47c7-a939-1000ad1dc22e', -- CEA
 '08a7f499-81dc-4533-a4c6-5db8a3e42e42', -- Chloride
 '87af9bcf-a179-4f9d-ae38-09bb3c0d3668', -- Cholesterol Test
 '12e21714-e519-4c21-904a-b56aea753b12', -- Cortisol
 '17c31514-5c30-4d44-aba9-b1ed481a4c79', -- Creatinine (eGFR)
 '3239de84-b225-4cd6-8efa-d90aaf2bbfe6', -- Creatinine
 '24da4ac5-3e58-415c-a4dc-1aa2f4041af1', -- CMV IgG
 '80c40f6d-ea07-49bf-9099-124b5f102eff', -- CMV IgM
 '1b435acc-3674-47bd-b5ca-f806e72743f5', -- Day 3 Fertility
 '1b400419-cb56-4184-bba3-f53befc4602a', -- DHEA-S
 '793e229f-8728-4191-a0cf-22a5194668dd', -- Essentials Male fertility test
 'dedb1ca5-e56f-4c89-8ba9-8c131ac5bf0f', -- Essentials Vitamins
 '0674c651-3f6c-4703-9dae-65951cb2fe60', -- Female Hair Loss
 'e755bf9d-2800-44f5-80ab-cb296bdedaae', -- Ferritin
 '64fa153d-43d2-44e1-852e-92d2617712b7', -- Folate (RBC)
 '55d46922-f46d-4428-ae65-a281035c22ce', -- Folate
 'bf12fa46-01b5-4945-a9e2-ddc6f3f43289'  -- FSH
);
update provider_tests set turnaround_days=1, turnaround_raw='1 Day', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = '9ef32533-eea0-4fc6-848e-8b18a94ba4f9'; -- Essentials Female Fertility, "11 Biomarkers 1 Day"

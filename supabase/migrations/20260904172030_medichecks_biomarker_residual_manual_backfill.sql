-- Manual backfill for 8 Medichecks tests where the Firecrawl-based
-- mhc-biomarker-extract pipeline touched the row (updated_at bumped) but
-- failed to populate biomarkers_list, mirroring the same Firecrawl-layer
-- unreliability already diagnosed and worked around for Clinilabs on
-- 2026-09-04. Every value below was read verbatim from the live product
-- page via a direct fetch (not Firecrawl) on 2026-09-04.

update provider_tests set
  biomarkers_list = '["Platelet count","MPV","hs-CRP","Iron","TIBC","Transferrin saturation","Ferritin","UIBC","Urea","Creatinine","eGFR","Sodium","Bilirubin","ALP","ALT","Gamma GT","Total protein","Albumin","Globulin","Haemoglobin","Haematocrit","Red cell count","MCV","MCH","MCHC","RDW","TSH","Free T3","Free thyroxine","Folate - serum","Vitamin B12 - active","White cell count","Neutrophils","Lymphocytes","Monocytes","Eosinophils","Basophils"]'::jsonb,
  biomarker_count = 37,
  biomarkers_not_stated = false
where provider_id = 'medichecks' and provider_test_id = 'advanced-iron-status-blood-test';

update provider_tests set
  biomarkers_list = '["TSH","Vitamin B12 - active","Vitamin D"]'::jsonb,
  biomarker_count = 3,
  biomarkers_not_stated = false
where provider_id = 'medichecks' and provider_test_id = 'energy-essentials-blood-test';

update provider_tests set
  biomarkers_list = '["Platelet count","MPV","Iron","TIBC","Transferrin saturation","Ferritin","UIBC","Haemoglobin","Haematocrit","Red cell count","MCV","MCH","MCHC","RDW","White cell count","Neutrophils","Lymphocytes","Monocytes","Eosinophils","Basophils"]'::jsonb,
  biomarker_count = 20,
  biomarkers_not_stated = false
where provider_id = 'medichecks' and provider_test_id = 'iron-and-fbc-blood-test';

update provider_tests set
  biomarkers_list = '["Thyroglobulin antibodies","Thyroid peroxidase antibodies","Total cholesterol","LDL cholesterol","Non-HDL cholesterol","HDL cholesterol","Total cholesterol : HDL","Triglycerides","Apolipoprotein A1","Apolipoprotein B","Apo B : apo A ratio","Lipoprotein (a)","Triglycerides : HDL ratio","Platelet count","MPV","HbA1c","Uric acid","FSH","LH","Oestradiol","Testosterone","Free testosterone - calc","Free androgen index","hs-CRP","Iron","TIBC","Transferrin saturation","Ferritin","UIBC","Urea","Creatinine","eGFR","Bilirubin","ALP","ALT","Gamma GT","Total protein","Albumin","Globulin","SHBG","Haemoglobin","Haematocrit","Red cell count","MCV","MCH","MCHC","RDW","TSH","Free T3","Free thyroxine","Folate - serum","Vitamin B12 - active","Vitamin D","White cell count","Neutrophils","Lymphocytes","Monocytes","Eosinophils","Basophils"]'::jsonb,
  biomarker_count = 59,
  biomarkers_not_stated = false
where provider_id = 'medichecks' and provider_test_id = 'optimal-health-blood-test';

update provider_tests set
  biomarkers_list = '["qFIT (quantitative faecal immunochemical test)"]'::jsonb,
  biomarker_count = 1,
  biomarkers_not_stated = false
where provider_id = 'medichecks' and provider_test_id = 'qfit-bowel-cancer-test';

update provider_tests set
  biomarkers_list = '["Platelet count","MPV","Ceruloplasmin","Ferritin","Iron","TIBC","Transferrin saturation","UIBC","Copper","Magnesium - serum","Magnesium - red cell","Zinc - serum","Haemoglobin","Haematocrit","MCV","MCH","MCHC","Red cell count","RDW","Vitamin A","Vitamin D","Basophils","Eosinophils","Lymphocytes","Monocytes","Neutrophils","White cell count"]'::jsonb,
  biomarker_count = 27,
  biomarkers_not_stated = false
where provider_id = 'medichecks' and provider_test_id = 'root-cause-profile-blood-test';

update provider_tests set
  biomarkers_list = '["Cortisol","MPV","Platelet count","HbA1c","Free androgen index","Free testosterone - calc","FSH","LH","Oestradiol","Testosterone","hs-CRP","Ferritin","Iron","TIBC","Transferrin saturation","UIBC","Creatinine","eGFR","Urea","ALP","ALT","Bilirubin","Gamma GT","Magnesium - serum","Zinc","ARA : EPA","Omega 3 index","Albumin","Globulin","SHBG","Total protein","Haemoglobin","Haematocrit","MCH","MCHC","MCV","RDW","Red cell count","Free T3","Free thyroxine","TSH","Folate - serum","Vitamin B12 - active","Vitamin D","Basophils","Eosinophils","Lymphocytes","Monocytes","Neutrophils","White cell count"]'::jsonb,
  biomarker_count = 50,
  biomarkers_not_stated = false
where provider_id = 'medichecks' and provider_test_id = 'skin-iq-blood-test';

update provider_tests set
  biomarkers_list = '["Testosterone"]'::jsonb,
  biomarker_count = 1,
  biomarkers_not_stated = false
where provider_id = 'medichecks' and provider_test_id = 'testosterone-blood-test';
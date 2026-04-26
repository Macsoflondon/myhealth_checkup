-- Update Essential Blood Test Plus Thyroid and Vitamins to Advanced Essential Blood Test
UPDATE provider_tests
SET 
  test_name = 'Advanced Essential Blood Test',
  price = 135,
  description = 'Are you looking for a well-rounded health check that assesses fundamental markers for your wellbeing? Our Advanced Essential Blood Test allows you to analyse your health status on a variety of markers covering a full blood count (FBC), liver and kidney function, iron status, diabetes, cholesterol, inflammation, thyroid function, and nutritional status.',
  biomarker_count = 43,
  biomarkers_list = '["Total cholesterol", "LDL cholesterol", "Non-HDL cholesterol", "HDL cholesterol", "Total cholesterol : HDL", "Triglycerides", "Platelet count", "MPV", "HbA1c", "Uric acid", "hs-CRP", "Iron", "TIBC", "Transferrin saturation", "Ferritin", "Urea", "Creatinine", "eGFR", "Bilirubin", "ALP", "ALT", "Gamma GT", "Total protein", "Albumin", "Globulin", "Haemoglobin", "Haematocrit", "Red cell count", "MCV", "MCH", "MCHC", "RDW", "White cell count", "Neutrophils", "Lymphocytes", "Monocytes", "Eosinophils", "Basophils", "TSH", "Free T4", "Vitamin D", "Vitamin B12 - active", "Folate - serum"]'::jsonb,
  url = 'https://www.medichecks.com/products/essential-blood-ultravit',
  provider_test_id = 'advanced-essential-blood-test',
  category = 'General Health',
  home_kit_available = false,
  clinic_visit_available = true,
  phlebotomy_included = false,
  phlebotomy_cost = 35,
  gp_consultation_included = true,
  who_should_test = 'This comprehensive test is ideal for anyone looking for a well-rounded health check that covers fundamental markers. Perfect for general health monitoring with added thyroid function and nutritional status.',
  symptoms = '["General fatigue", "Tiredness", "Routine health monitoring", "Weight changes", "Thyroid concerns", "Nutritional deficiencies"]'::jsonb,
  conditions = '["High cholesterol", "Diabetes risk", "Kidney function issues", "Liver health problems", "Iron deficiency", "Thyroid dysfunction", "Vitamin deficiency"]'::jsonb,
  sample_type = 'Blood (venous)',
  updated_at = NOW()
WHERE provider_id = 'medichecks' 
  AND provider_test_id = 'essential-blood-test-thyroid-vitamins';

-- Update Essential Blood Test Plus Thyroid to Advanced Thyroid Function Blood Test
UPDATE provider_tests
SET 
  test_name = 'Advanced Thyroid Function Blood Test',
  price = 89,
  description = 'Get detailed insights into your thyroid function, including antibodies and nutrients essential for optimal thyroid health. Whether you''re managing a thyroid condition or looking to investigate symptoms, this test provides the clarity you need to take action.',
  biomarker_count = 10,
  biomarkers_list = '["TSH", "Free T3", "Free thyroxine", "Thyroglobulin antibodies", "Thyroid peroxidase antibodies", "hs-CRP", "Ferritin", "Folate - serum", "Vitamin B12 - active", "Vitamin D"]'::jsonb,
  url = 'https://www.medichecks.com/products/advanced-thyroid-function-blood-test',
  provider_test_id = 'advanced-thyroid-function-blood-test',
  category = 'Thyroid',
  home_kit_available = true,
  clinic_visit_available = true,
  phlebotomy_included = false,
  phlebotomy_cost = 35,
  gp_consultation_included = true,
  who_should_test = 'This test helps you understand whether any symptoms you are experiencing could be caused by an overactive or underactive thyroid. It includes thyroid hormones, antibodies, and relevant vitamins and minerals which support your thyroid function.',
  symptoms = '["Fatigue", "Weight changes", "Mood changes", "Hair loss", "Dry skin", "Sensitivity to cold or heat", "Brain fog"]'::jsonb,
  conditions = '["Hypothyroidism", "Hyperthyroidism", "Hashimoto''s thyroiditis", "Graves'' disease", "Autoimmune thyroid conditions", "Vitamin deficiency"]'::jsonb,
  sample_type = 'Blood (finger-prick or venous)',
  updated_at = NOW()
WHERE provider_id = 'medichecks' 
  AND provider_test_id = 'essential-blood-test-thyroid';

-- Update Essential Blood Test Plus Hormones to Optimal Health Blood Test
UPDATE provider_tests
SET 
  test_name = 'Optimal Health Blood Test',
  price = 249,
  description = 'Unlock a deeper understanding of your health with our most comprehensive panel covering 59 biomarkers. From advanced heart disease markers, diabetes risk factors, and longevity markers, this test is designed for those dedicated to living better for longer. Gain actionable insights to optimise your long-term health.',
  biomarker_count = 59,
  biomarkers_list = '["Total cholesterol", "LDL cholesterol", "Non-HDL cholesterol", "HDL cholesterol", "Total cholesterol : HDL", "Triglycerides", "Lp(a)", "ApoB", "ApoA1", "Platelet count", "MPV", "HbA1c", "Uric acid", "hs-CRP", "Iron", "TIBC", "Transferrin saturation", "Ferritin", "Urea", "Creatinine", "eGFR", "Bilirubin", "ALP", "ALT", "Gamma GT", "Total protein", "Albumin", "Globulin", "Haemoglobin", "Haematocrit", "Red cell count", "MCV", "MCH", "MCHC", "RDW", "White cell count", "Neutrophils", "Lymphocytes", "Monocytes", "Eosinophils", "Basophils", "TSH", "Free T3", "Free T4", "Thyroglobulin antibodies", "Thyroid peroxidase antibodies", "Vitamin D", "Vitamin B12 - active", "Folate - serum", "Testosterone", "SHBG", "Free Testosterone", "Oestradiol", "DHEA-S", "Cortisol", "IGF-1", "Insulin", "Homocysteine", "Magnesium"]'::jsonb,
  url = 'https://www.medichecks.com/products/optimal-health-blood-test',
  provider_test_id = 'optimal-health-blood-test',
  category = 'General Health',
  home_kit_available = false,
  clinic_visit_available = true,
  phlebotomy_included = false,
  phlebotomy_cost = 35,
  gp_consultation_included = true,
  who_should_test = 'Designed for those dedicated to living better for longer. This comprehensive test features advanced heart health markers (Lp(a) and apolipoproteins), plus hormones, thyroid function and antibodies, iron status, inflammatory markers, vitamins, and kidney and liver function.',
  symptoms = '["General fatigue", "Optimising health", "Longevity goals", "Hormone concerns", "Heart health monitoring", "Weight management"]'::jsonb,
  conditions = '["Heart disease risk", "Diabetes risk", "Hormonal imbalance", "Thyroid dysfunction", "Vitamin deficiency", "Metabolic health", "Inflammation"]'::jsonb,
  sample_type = 'Blood (venous)',
  updated_at = NOW()
WHERE provider_id = 'medichecks' 
  AND provider_test_id = 'essential-blood-test-hormones';
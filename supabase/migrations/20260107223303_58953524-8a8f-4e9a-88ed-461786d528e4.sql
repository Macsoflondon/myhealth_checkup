-- Update the Essential Blood Test with complete data from Medichecks website
UPDATE provider_tests
SET 
  price = 89,
  original_price = NULL,
  description = 'This routine health check provides a comprehensive look at your overall well-being, making it ideal for general health monitoring. It covers a wide range of biomarkers to assess organ function, nutritional balance, and potential health risks. Whether you''re looking for peace of mind or early detection of issues, this test offers valuable insights.',
  biomarker_count = 38,
  biomarkers_list = '["Total cholesterol", "LDL cholesterol", "Non-HDL cholesterol", "HDL cholesterol", "Total cholesterol : HDL", "Triglycerides", "Platelet count", "MPV", "HbA1c", "Uric acid", "hs-CRP", "Iron", "TIBC", "Transferrin saturation", "Ferritin", "Urea", "Creatinine", "eGFR", "Bilirubin", "ALP", "ALT", "Gamma GT", "Total protein", "Albumin", "Globulin", "Haemoglobin", "Haematocrit", "Red cell count", "MCV", "MCH", "MCHC", "RDW", "White cell count", "Neutrophils", "Lymphocytes", "Monocytes", "Eosinophils", "Basophils"]'::jsonb,
  url = 'https://www.medichecks.com/products/essential-blood-test',
  home_kit_available = false,
  clinic_visit_available = true,
  phlebotomy_included = false,
  phlebotomy_cost = 35,
  gp_consultation_included = true,
  gp_consultation_cost = 0,
  who_should_test = 'With your results, this test allows you to optimise health factors that you can change through diet and lifestyle, meaning that you can be proactive about your health. It''s also helpful if you''re experiencing general symptoms and would like a routine blood test to investigate them.',
  symptoms = '["General fatigue", "Unexplained tiredness", "Routine health monitoring", "Weight changes", "Diet and lifestyle assessment"]'::jsonb,
  conditions = '["High cholesterol", "Diabetes risk", "Kidney function issues", "Liver health problems", "Iron deficiency", "Anaemia", "Inflammation", "Gout risk"]'::jsonb,
  sample_type = 'Blood (venous)',
  updated_at = NOW()
WHERE provider_id = 'medichecks' 
  AND provider_test_id = 'essential-blood-test';
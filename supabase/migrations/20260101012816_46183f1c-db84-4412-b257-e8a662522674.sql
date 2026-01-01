-- Insert 7 missing Goodbody Clinic tests
INSERT INTO provider_tests (
  provider_id,
  test_name,
  description,
  category,
  price,
  url,
  biomarker_count,
  biomarkers_list,
  sample_type,
  home_kit_available,
  clinic_visit_available,
  phlebotomy_included,
  is_active
) VALUES
-- H. Pylori Test
(
  'goodbody-clinic',
  'H. Pylori',
  'A blood test to detect H. pylori infection, a common cause of stomach ulcers and gastritis.',
  'Digestive Health',
  79,
  'https://health.goodbodyclinic.com/product/helicobacter-pylori-blood-test/',
  1,
  '["H. pylori IgG Antibodies"]'::jsonb,
  'Venous blood sample',
  false,
  true,
  true,
  true
),
-- Sports & Fitness Test
(
  'goodbody-clinic',
  'Sports & Fitness',
  'A comprehensive test for athletes and fitness enthusiasts, measuring markers that affect performance, recovery, and overall health.',
  'Sports Performance',
  199,
  'https://health.goodbodyclinic.com/product/sports-fitness-blood-test/',
  12,
  '["Full Blood Count", "Iron Studies", "Vitamin D", "Vitamin B12", "Magnesium", "Testosterone", "Cortisol", "CRP", "CK (Creatine Kinase)", "Thyroid Function", "HbA1c", "Lipid Profile"]'::jsonb,
  'Venous blood sample',
  false,
  true,
  true,
  true
),
-- Thyroid Function Test
(
  'goodbody-clinic',
  'Thyroid Function',
  'A thyroid function test measuring TSH, T4, and T3 to assess thyroid gland function.',
  'Thyroid',
  79,
  'https://health.goodbodyclinic.com/product/thyroid-function-blood-test/',
  3,
  '["TSH (Thyroid Stimulating Hormone)", "Free T4 (Thyroxine)", "Free T3 (Triiodothyronine)"]'::jsonb,
  'Venous blood sample',
  false,
  true,
  true,
  true
),
-- Thyroid With Antibodies Test
(
  'goodbody-clinic',
  'Thyroid With Antibodies',
  'A comprehensive thyroid test including thyroid hormones and antibodies to detect autoimmune thyroid conditions.',
  'Thyroid',
  119,
  'https://health.goodbodyclinic.com/product/thyroid-with-antibodies-blood-test/',
  5,
  '["TSH", "Free T4", "Free T3", "TPO Antibodies (Thyroid Peroxidase)", "TgAb (Thyroglobulin Antibodies)"]'::jsonb,
  'Venous blood sample',
  false,
  true,
  true,
  true
),
-- Tiredness & Fatigue Test
(
  'goodbody-clinic',
  'Tiredness & Fatigue',
  'A comprehensive test investigating the common causes of tiredness and fatigue, including thyroid, iron, vitamins, and diabetes markers.',
  'General Health',
  149,
  'https://health.goodbodyclinic.com/product/tiredness-fatigue-blood-test/',
  11,
  '["Full Blood Count", "Ferritin", "Iron", "Vitamin B12", "Folate", "Vitamin D", "Thyroid Function", "HbA1c", "Liver Function", "Kidney Function", "CRP"]'::jsonb,
  'Venous blood sample',
  false,
  true,
  true,
  true
),
-- Trace Metal Test
(
  'goodbody-clinic',
  'Trace Metal',
  'A test measuring essential trace elements and heavy metals to assess nutritional status and detect toxic metal exposure.',
  'Vitamins & Nutrition',
  199,
  'https://health.goodbodyclinic.com/product/trace-metal-blood-test/',
  9,
  '["Zinc", "Copper", "Selenium", "Manganese", "Chromium", "Lead", "Mercury", "Arsenic", "Cadmium"]'::jsonb,
  'Venous blood sample',
  false,
  true,
  true,
  true
),
-- Vitamins Test
(
  'goodbody-clinic',
  'Vitamins',
  'A core vitamins test measuring the most important vitamins including D, B12, and folate.',
  'Vitamins & Nutrition',
  99,
  'https://health.goodbodyclinic.com/product/vitamins-blood-test/',
  4,
  '["Vitamin D", "Vitamin B12", "Folate", "Ferritin"]'::jsonb,
  'Venous blood sample',
  false,
  true,
  true,
  true
);
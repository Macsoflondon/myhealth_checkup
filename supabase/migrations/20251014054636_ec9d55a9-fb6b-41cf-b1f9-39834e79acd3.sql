-- Insert Medichecks comprehensive test catalogue into provider_tests table

-- Allergy Tests
INSERT INTO provider_tests (provider_id, test_name, category, description, url, is_active, provider_test_id)
VALUES
  ('medichecks', 'Allergy Profile (UK)', 'Allergy Testing', 'Comprehensive UK allergy testing panel', 'https://www.medichecks.com/allergy-tests', true, 'allergy-profile-uk'),
  ('medichecks', 'Total IgE', 'Allergy Testing', 'Total immunoglobulin E blood test', 'https://www.medichecks.com/allergy-tests/total-ige', true, 'total-ige')
ON CONFLICT (provider_id, provider_test_id) 
DO UPDATE SET 
  test_name = EXCLUDED.test_name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Biochemistry Tests
INSERT INTO provider_tests (provider_id, test_name, category, description, url, is_active, provider_test_id)
VALUES
  ('medichecks', 'CRP - hs', 'Inflammation', 'High-sensitivity C-reactive protein test', 'https://www.medichecks.com/biochemistry-tests/crp-hs', true, 'crp-hs'),
  ('medichecks', 'Diabetes Profile', 'Diabetes Testing', 'Comprehensive diabetes screening', 'https://www.medichecks.com/diabetes-tests/diabetes-profile', true, 'diabetes-profile'),
  ('medichecks', 'HbA1c', 'Diabetes Testing', 'Glycated haemoglobin test for diabetes monitoring', 'https://www.medichecks.com/diabetes-tests/hba1c', true, 'hba1c'),
  ('medichecks', 'Iron Profile', 'Iron Status', 'Complete iron status assessment', 'https://www.medichecks.com/iron-tests/iron-profile', true, 'iron-profile'),
  ('medichecks', 'Kidney Function Tests', 'Kidney Health', 'Renal function blood tests', 'https://www.medichecks.com/kidney-tests', true, 'kidney-function-tests'),
  ('medichecks', 'Lipid Profile', 'Heart Health', 'Cholesterol and lipids blood test', 'https://www.medichecks.com/cholesterol-tests/lipid-profile', true, 'lipid-profile'),
  ('medichecks', 'Lipoprotein a', 'Heart Health', 'Lp(a) cardiovascular risk marker', 'https://www.medichecks.com/cholesterol-tests/lipoprotein-a', true, 'lipoprotein-a'),
  ('medichecks', 'Liver Function Tests', 'Liver Health', 'Comprehensive liver health panel - 7 biomarkers', 'https://www.medichecks.com/liver-tests', true, 'liver-function-tests')
ON CONFLICT (provider_id, provider_test_id) 
DO UPDATE SET 
  test_name = EXCLUDED.test_name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Diet & Nutrition Tests
INSERT INTO provider_tests (provider_id, test_name, category, description, url, is_active, provider_test_id)
VALUES
  ('medichecks', 'Active B12', 'Vitamin & Mineral Tests', 'Active vitamin B12 blood test', 'https://www.medichecks.com/vitamin-tests/active-b12', true, 'active-b12'),
  ('medichecks', 'Active B12, Folate and Ferritin', 'Vitamin & Mineral Tests', 'Combined vitamin B12, folate and iron storage test', 'https://www.medichecks.com/vitamin-tests/b12-folate-ferritin', true, 'b12-folate-ferritin'),
  ('medichecks', 'Ferritin', 'Iron Status', 'Iron storage blood test', 'https://www.medichecks.com/iron-tests/ferritin', true, 'ferritin'),
  ('medichecks', 'Folate (Serum)', 'Vitamin & Mineral Tests', 'Serum folate blood test', 'https://www.medichecks.com/vitamin-tests/folate', true, 'folate-serum'),
  ('medichecks', 'Magnesium (Serum)', 'Vitamin & Mineral Tests', 'Serum magnesium blood test', 'https://www.medichecks.com/mineral-tests/magnesium', true, 'magnesium-serum'),
  ('medichecks', 'Vitamin D', 'Vitamin & Mineral Tests', 'Vitamin D blood test', 'https://www.medichecks.com/vitamin-tests/vitamin-d', true, 'vitamin-d'),
  ('medichecks', 'Diet and Lifestyle Profile', 'General Health', 'Comprehensive 27 biomarker health panel', 'https://www.medichecks.com/health-tests/diet-lifestyle-profile', true, 'diet-lifestyle-profile'),
  ('medichecks', 'Nutrition Profile 1', 'Vitamin & Mineral Tests', '12 biomarker nutrition panel', 'https://www.medichecks.com/nutrition-tests/nutrition-profile-1', true, 'nutrition-profile-1'),
  ('medichecks', 'Nutrition Profile 2', 'Vitamin & Mineral Tests', '11 biomarker nutrition panel', 'https://www.medichecks.com/nutrition-tests/nutrition-profile-2', true, 'nutrition-profile-2')
ON CONFLICT (provider_id, provider_test_id) 
DO UPDATE SET 
  test_name = EXCLUDED.test_name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Fatigue Tests
INSERT INTO provider_tests (provider_id, test_name, category, description, url, is_active, provider_test_id)
VALUES
  ('medichecks', 'Fatigue Profile 1', 'Fatigue', '8 biomarker fatigue screening test', 'https://www.medichecks.com/fatigue-tests/fatigue-profile-1', true, 'fatigue-profile-1'),
  ('medichecks', 'Fatigue Profile 2', 'Fatigue', '26 biomarker comprehensive fatigue panel', 'https://www.medichecks.com/fatigue-tests/fatigue-profile-2', true, 'fatigue-profile-2'),
  ('medichecks', 'Weight Loss Profile', 'Weight Management', '23 biomarker weight loss blood test', 'https://www.medichecks.com/weight-tests/weight-loss-profile', true, 'weight-loss-profile')
ON CONFLICT (provider_id, provider_test_id) 
DO UPDATE SET 
  test_name = EXCLUDED.test_name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Female Fertility & Hormone Tests
INSERT INTO provider_tests (provider_id, test_name, category, description, url, is_active, provider_test_id)
VALUES
  ('medichecks', 'AMH', 'Fertility Testing', 'Anti-Müllerian hormone ovarian reserve test', 'https://www.medichecks.com/fertility-tests/amh', true, 'amh'),
  ('medichecks', 'Antenatal Health Profile', 'Fertility Testing', '6 biomarker antenatal screening panel', 'https://www.medichecks.com/fertility-tests/antenatal-health', true, 'antenatal-health-profile'),
  ('medichecks', 'FSH, LH, Oestradiol: Day 3', 'Fertility Testing', 'Day 3 fertility hormone panel', 'https://www.medichecks.com/fertility-tests/day-3-hormones', true, 'fsh-lh-oestradiol-day3'),
  ('medichecks', 'Progesterone: Day 21', 'Fertility Testing', 'Day 21 progesterone ovulation test', 'https://www.medichecks.com/fertility-tests/progesterone-day21', true, 'progesterone-day21'),
  ('medichecks', 'Female Hormone Profile 1', 'Hormone Tests', '3 biomarker female hormone panel', 'https://www.medichecks.com/hormone-tests/female-hormone-profile-1', true, 'female-hormone-profile-1'),
  ('medichecks', 'Female Hormone Profile 2', 'Hormone Tests', '10 biomarker comprehensive female hormone panel', 'https://www.medichecks.com/hormone-tests/female-hormone-profile-2', true, 'female-hormone-profile-2'),
  ('medichecks', 'Female Hormone Profile 3', 'Hormone Tests', '13 biomarker advanced female hormone panel with thyroid', 'https://www.medichecks.com/hormone-tests/female-hormone-profile-3', true, 'female-hormone-profile-3'),
  ('medichecks', 'HRT Profile', 'Hormone Tests', 'Hormone replacement therapy monitoring panel', 'https://www.medichecks.com/hormone-tests/hrt-profile', true, 'hrt-profile'),
  ('medichecks', 'Menopause Profile', 'Hormone Tests', '6 biomarker menopause hormone panel', 'https://www.medichecks.com/hormone-tests/menopause-profile', true, 'menopause-profile'),
  ('medichecks', 'Polycystic Ovary Profile 1', 'Hormone Tests', '6 biomarker PCOS screening test', 'https://www.medichecks.com/hormone-tests/pcos-profile-1', true, 'pcos-profile-1'),
  ('medichecks', 'Polycystic Ovary Profile 2', 'Hormone Tests', '18 biomarker comprehensive PCOS panel', 'https://www.medichecks.com/hormone-tests/pcos-profile-2', true, 'pcos-profile-2')
ON CONFLICT (provider_id, provider_test_id) 
DO UPDATE SET 
  test_name = EXCLUDED.test_name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- General Health Tests
INSERT INTO provider_tests (provider_id, test_name, category, description, url, is_active, provider_test_id)
VALUES
  ('medichecks', 'Advanced General Health Profile', 'General Health', 'Comprehensive 216 biomarker health check', 'https://www.medichecks.com/health-tests/advanced-general-health', true, 'advanced-general-health'),
  ('medichecks', 'Essential Blood Test', 'General Health', '38 biomarker essential health screening', 'https://www.medichecks.com/health-tests/essential-blood-test', true, 'essential-blood-test'),
  ('medichecks', 'Essential Blood Test Plus Hormones', 'General Health', '50 biomarker health panel with hormones', 'https://www.medichecks.com/health-tests/essential-blood-test-hormones', true, 'essential-blood-test-hormones'),
  ('medichecks', 'Essential Blood Test Plus Thyroid', 'General Health', '47 biomarker health panel with thyroid', 'https://www.medichecks.com/health-tests/essential-blood-test-thyroid', true, 'essential-blood-test-thyroid'),
  ('medichecks', 'Essential Blood Test Plus Thyroid and Vitamins', 'General Health', '43 biomarker comprehensive health check', 'https://www.medichecks.com/health-tests/essential-blood-test-thyroid-vitamins', true, 'essential-blood-test-thyroid-vitamins'),
  ('medichecks', 'General Health Profile', 'General Health', '19 biomarker general health screening', 'https://www.medichecks.com/health-tests/general-health-profile', true, 'general-health-profile')
ON CONFLICT (provider_id, provider_test_id) 
DO UPDATE SET 
  test_name = EXCLUDED.test_name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- General Hormone Tests
INSERT INTO provider_tests (provider_id, test_name, category, description, url, is_active, provider_test_id)
VALUES
  ('medichecks', 'Cortisol: 9am', 'Hormone Tests', 'Morning cortisol stress hormone test', 'https://www.medichecks.com/hormone-tests/cortisol-9am', true, 'cortisol-9am'),
  ('medichecks', 'DHEA-Sulphate', 'Hormone Tests', 'DHEA-S adrenal hormone blood test', 'https://www.medichecks.com/hormone-tests/dhea-sulphate', true, 'dhea-sulphate'),
  ('medichecks', 'Dihydrotestosterone', 'Hormone Tests', 'DHT androgen hormone blood test', 'https://www.medichecks.com/hormone-tests/dht', true, 'dht'),
  ('medichecks', 'Prolactin', 'Hormone Tests', 'Prolactin hormone blood test', 'https://www.medichecks.com/hormone-tests/prolactin', true, 'prolactin'),
  ('medichecks', 'Sex Hormone Binding Globulin', 'Hormone Tests', 'SHBG blood test', 'https://www.medichecks.com/hormone-tests/shbg', true, 'shbg')
ON CONFLICT (provider_id, provider_test_id) 
DO UPDATE SET 
  test_name = EXCLUDED.test_name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Haematology Tests
INSERT INTO provider_tests (provider_id, test_name, category, description, url, is_active, provider_test_id)
VALUES
  ('medichecks', 'Blood Group', 'Haematology', 'ABO blood group typing test', 'https://www.medichecks.com/blood-tests/blood-group', true, 'blood-group'),
  ('medichecks', 'Full Blood Count', 'Haematology', '15 biomarker complete blood count', 'https://www.medichecks.com/blood-tests/full-blood-count', true, 'full-blood-count')
ON CONFLICT (provider_id, provider_test_id) 
DO UPDATE SET 
  test_name = EXCLUDED.test_name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Hair Loss Tests
INSERT INTO provider_tests (provider_id, test_name, category, description, url, is_active, provider_test_id)
VALUES
  ('medichecks', 'Hair Loss Profile 1', 'Hair Loss', '7 biomarker hair loss screening', 'https://www.medichecks.com/hair-loss-tests/hair-loss-profile-1', true, 'hair-loss-profile-1'),
  ('medichecks', 'Hair Loss Profile 2', 'Hair Loss', '40 biomarker comprehensive hair loss panel', 'https://www.medichecks.com/hair-loss-tests/hair-loss-profile-2', true, 'hair-loss-profile-2')
ON CONFLICT (provider_id, provider_test_id) 
DO UPDATE SET 
  test_name = EXCLUDED.test_name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Immunology Tests
INSERT INTO provider_tests (provider_id, test_name, category, description, url, is_active, provider_test_id)
VALUES
  ('medichecks', 'Antinuclear Antibodies', 'Immunology', 'ANA autoimmune screening test', 'https://www.medichecks.com/immunology-tests/ana', true, 'ana'),
  ('medichecks', 'Coronavirus Antibodies', 'Immunology', 'COVID-19 antibody blood test', 'https://www.medichecks.com/immunology-tests/coronavirus-antibodies', true, 'coronavirus-antibodies'),
  ('medichecks', 'Hepatitis B Immunity', 'Immunology', 'Hepatitis B immunity blood test', 'https://www.medichecks.com/immunology-tests/hepatitis-b-immunity', true, 'hepatitis-b-immunity')
ON CONFLICT (provider_id, provider_test_id) 
DO UPDATE SET 
  test_name = EXCLUDED.test_name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Men's Health Tests
INSERT INTO provider_tests (provider_id, test_name, category, description, url, is_active, provider_test_id)
VALUES
  ('medichecks', 'Erectile Dysfunction Profile', 'Mens Health', 'Comprehensive ED blood test panel', 'https://www.medichecks.com/mens-health-tests/erectile-dysfunction', true, 'erectile-dysfunction-profile'),
  ('medichecks', 'Men''s Health Profile 1', 'Mens Health', 'Essential men''s health screening', 'https://www.medichecks.com/mens-health-tests/mens-health-profile-1', true, 'mens-health-profile-1'),
  ('medichecks', 'Men''s Health Profile 2', 'Mens Health', 'Comprehensive men''s health panel', 'https://www.medichecks.com/mens-health-tests/mens-health-profile-2', true, 'mens-health-profile-2'),
  ('medichecks', 'TRT Profile 2', 'Mens Health', 'Testosterone replacement therapy monitoring', 'https://www.medichecks.com/mens-health-tests/trt-profile-2', true, 'trt-profile-2'),
  ('medichecks', 'TRT Profile 3', 'Mens Health', 'Advanced TRT monitoring panel', 'https://www.medichecks.com/mens-health-tests/trt-profile-3', true, 'trt-profile-3')
ON CONFLICT (provider_id, provider_test_id) 
DO UPDATE SET 
  test_name = EXCLUDED.test_name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Sports Performance Tests
INSERT INTO provider_tests (provider_id, test_name, category, description, url, is_active, provider_test_id)
VALUES
  ('medichecks', 'Sports Performance Profile 1', 'Sports Performance', 'Essential sports performance blood test', 'https://www.medichecks.com/sports-tests/sports-performance-profile-1', true, 'sports-performance-profile-1'),
  ('medichecks', 'Sports Performance Profile 2', 'Sports Performance', 'Comprehensive sports performance panel', 'https://www.medichecks.com/sports-tests/sports-performance-profile-2', true, 'sports-performance-profile-2')
ON CONFLICT (provider_id, provider_test_id) 
DO UPDATE SET 
  test_name = EXCLUDED.test_name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Thyroid Tests
INSERT INTO provider_tests (provider_id, test_name, category, description, url, is_active, provider_test_id)
VALUES
  ('medichecks', 'Thyroid Function Test', 'Thyroid Tests', 'TSH thyroid screening blood test', 'https://www.medichecks.com/thyroid-tests/thyroid-function-test', true, 'thyroid-function-test'),
  ('medichecks', 'Thyroid Function Plus Antibodies', 'Thyroid Tests', 'Thyroid panel with antibodies', 'https://www.medichecks.com/thyroid-tests/thyroid-antibodies', true, 'thyroid-antibodies'),
  ('medichecks', 'Advanced Thyroid Function Test', 'Thyroid Tests', 'Comprehensive thyroid panel with T3, T4, TSH', 'https://www.medichecks.com/thyroid-tests/advanced-thyroid', true, 'advanced-thyroid')
ON CONFLICT (provider_id, provider_test_id) 
DO UPDATE SET 
  test_name = EXCLUDED.test_name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Women's Health Tests
INSERT INTO provider_tests (provider_id, test_name, category, description, url, is_active, provider_test_id)
VALUES
  ('medichecks', 'Well Woman Blood Test', 'Womens Health', 'Comprehensive women''s health screening', 'https://www.medichecks.com/womens-health-tests/well-woman', true, 'well-woman'),
  ('medichecks', 'Advanced Well Woman Blood Test', 'Womens Health', 'Extended women''s health panel', 'https://www.medichecks.com/womens-health-tests/advanced-well-woman', true, 'advanced-well-woman')
ON CONFLICT (provider_id, provider_test_id) 
DO UPDATE SET 
  test_name = EXCLUDED.test_name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Create index for faster Medichecks queries
CREATE INDEX IF NOT EXISTS idx_provider_tests_medichecks ON provider_tests(provider_id, is_active) WHERE provider_id = 'medichecks';
-- Add unique constraint
ALTER TABLE test_categories DROP CONSTRAINT IF EXISTS test_categories_name_provider_id_key;
ALTER TABLE test_categories ADD CONSTRAINT test_categories_name_provider_id_key UNIQUE (name, provider_id);

-- Insert 48 biomarkers
INSERT INTO biomarkers_library (biomarker_code, biomarker_name, category, description, clinical_significance, normal_range_male, normal_range_female, unit_of_measurement, related_conditions, lifestyle_factors) VALUES
('FBC001', 'Haemoglobin', 'Full Blood Count', 'Oxygen-carrying protein', 'Indicates anaemia risk', '130-175', '115-165', 'g/L', ARRAY['Anaemia'], ARRAY['Iron intake']),
('FBC002', 'Red Blood Cell Count', 'Full Blood Count', 'Red blood cell count', 'Oxygen transport', '4.5-5.9', '4.0-5.2', '10^12/L', ARRAY['Anaemia'], ARRAY['Exercise']),
('FBC003', 'Haematocrit', 'Full Blood Count', 'Blood volume percentage', 'Red cell concentration', '40-52', '36-48', '%', ARRAY['Dehydration'], ARRAY['Hydration']),
('FBC004', 'Mean Cell Volume', 'Full Blood Count', 'Average cell size', 'Anaemia classification', '80-100', '80-100', 'fL', ARRAY['Iron deficiency'], ARRAY['Nutrition']),
('FBC006', 'White Blood Cell Count', 'Full Blood Count', 'Total white cells', 'Immune activity', '4.0-11.0', '4.0-11.0', '10^9/L', ARRAY['Infection'], ARRAY['Stress']),
('FBC007', 'Neutrophils', 'Full Blood Count', 'Bacterial fighters', 'First immune defence', '2.0-7.5', '2.0-7.5', '10^9/L', ARRAY['Bacterial infection'], ARRAY['Stress']),
('FBC008', 'Lymphocytes', 'Full Blood Count', 'Viral fighters', 'Immune response', '1.0-4.0', '1.0-4.0', '10^9/L', ARRAY['Viral infection'], ARRAY['Sleep']),
('FBC012', 'Platelet Count', 'Full Blood Count', 'Clotting cells', 'Blood clotting', '150-400', '150-400', '10^9/L', ARRAY['Bleeding disorders'], ARRAY['Nutrition']),
('LIP001', 'Total Cholesterol', 'Lipid Profile', 'Total cholesterol', 'CVD risk', '<5.2', '<5.2', 'mmol/L', ARRAY['Heart disease'], ARRAY['Diet']),
('LIP002', 'LDL Cholesterol', 'Lipid Profile', 'Bad cholesterol', 'Arterial plaque', '<3.0', '<3.0', 'mmol/L', ARRAY['Heart disease'], ARRAY['Diet']),
('LIP003', 'HDL Cholesterol', 'Lipid Profile', 'Good cholesterol', 'Removes cholesterol', '>1.0', '>1.2', 'mmol/L', ARRAY['Heart disease'], ARRAY['Exercise']),
('LIP004', 'Triglycerides', 'Lipid Profile', 'Blood fats', 'Heart risk', '<1.7', '<1.7', 'mmol/L', ARRAY['Heart disease'], ARRAY['Sugar', 'Alcohol']),
('LIV001', 'ALT', 'Liver Function', 'Liver enzyme', 'Liver damage marker', '10-50', '10-35', 'U/L', ARRAY['Liver disease'], ARRAY['Alcohol']),
('LIV002', 'AST', 'Liver Function', 'Liver enzyme', 'Liver/muscle damage', '10-50', '10-35', 'U/L', ARRAY['Liver disease'], ARRAY['Alcohol']),
('LIV003', 'ALP', 'Liver Function', 'Alkaline phosphatase', 'Liver/bone marker', '30-130', '30-130', 'U/L', ARRAY['Liver disease'], ARRAY['Vitamin D']),
('LIV004', 'GGT', 'Liver Function', 'Gamma-GT', 'Alcohol marker', '10-71', '10-39', 'U/L', ARRAY['Liver disease'], ARRAY['Alcohol']),
('LIV006', 'Albumin', 'Liver Function', 'Liver protein', 'Liver function', '35-50', '35-50', 'g/L', ARRAY['Liver disease'], ARRAY['Protein']),
('KID001', 'Creatinine', 'Kidney Function', 'Muscle waste', 'Kidney filtration', '59-104', '45-84', 'μmol/L', ARRAY['Kidney disease'], ARRAY['Hydration']),
('KID002', 'eGFR', 'Kidney Function', 'Filtration rate', 'Kidney function', '>90', '>90', 'mL/min', ARRAY['Kidney disease'], ARRAY['Hydration']),
('KID003', 'Urea', 'Kidney Function', 'Protein waste', 'Kidney function', '2.5-7.8', '2.5-7.8', 'mmol/L', ARRAY['Kidney disease'], ARRAY['Protein']),
('KID004', 'Sodium', 'Kidney Function', 'Main electrolyte', 'Fluid balance', '135-145', '135-145', 'mmol/L', ARRAY['Dehydration'], ARRAY['Salt']),
('KID005', 'Potassium', 'Kidney Function', 'Electrolyte', 'Heart/muscle function', '3.5-5.3', '3.5-5.3', 'mmol/L', ARRAY['Kidney disease'], ARRAY['Diet']),
('DIA001', 'Glucose', 'Diabetes', 'Blood sugar', 'Diabetes screening', '3.9-5.8', '3.9-5.8', 'mmol/L', ARRAY['Diabetes'], ARRAY['Diet']),
('DIA002', 'HbA1c', 'Diabetes', '3-month average sugar', 'Diabetes monitoring', '<42', '<42', 'mmol/mol', ARRAY['Diabetes'], ARRAY['Diet']),
('DIA003', 'Insulin', 'Diabetes', 'Sugar hormone', 'Insulin resistance', '2.6-24.9', '2.6-24.9', 'mU/L', ARRAY['Type 2 diabetes'], ARRAY['Weight']),
('THY001', 'TSH', 'Thyroid', 'Thyroid hormone', 'Thyroid screening', '0.27-4.2', '0.27-4.2', 'mU/L', ARRAY['Hypothyroidism'], ARRAY['Stress']),
('THY002', 'Free T4', 'Thyroid', 'Main thyroid hormone', 'Metabolism', '12-22', '12-22', 'pmol/L', ARRAY['Thyroid disorders'], ARRAY['Iodine']),
('THY003', 'Free T3', 'Thyroid', 'Active thyroid hormone', 'Active metabolism', '3.1-6.8', '3.1-6.8', 'pmol/L', ARRAY['Thyroid disorders'], ARRAY['Selenium']),
('THY004', 'Anti-TPO', 'Thyroid', 'Thyroid antibodies', 'Autoimmune marker', '<34', '<34', 'IU/mL', ARRAY['Hashimoto'], ARRAY['Stress']),
('VIT001', 'Vitamin D', 'Vitamins', 'Sunshine vitamin', 'Bone/immune health', '50-200', '50-200', 'nmol/L', ARRAY['Osteoporosis'], ARRAY['Sun exposure']),
('VIT002', 'Vitamin B12', 'Vitamins', 'B12', 'Nerve/blood health', '191-663', '191-663', 'pmol/L', ARRAY['Anaemia'], ARRAY['Diet']),
('VIT003', 'Folate', 'Vitamins', 'Folic acid', 'Cell division', '8.83-60.8', '8.83-60.8', 'nmol/L', ARRAY['Anaemia'], ARRAY['Diet']),
('VIT004', 'Ferritin', 'Vitamins', 'Iron storage', 'Iron stores', '30-400', '13-150', 'μg/L', ARRAY['Iron deficiency'], ARRAY['Diet']),
('VIT005', 'Iron', 'Vitamins', 'Serum iron', 'Circulating iron', '10.6-28.3', '6.6-26.0', 'μmol/L', ARRAY['Iron deficiency'], ARRAY['Diet']),
('HOR001', 'Testosterone', 'Hormones', 'Male hormone', 'Muscle/libido', '8.64-29.0', '0.29-1.67', 'nmol/L', ARRAY['Hypogonadism'], ARRAY['Exercise']),
('HOR002', 'Free Testosterone', 'Hormones', 'Active testosterone', 'Available testosterone', '0.2-0.62', '0.003-0.041', 'nmol/L', ARRAY['Hypogonadism'], ARRAY['Exercise']),
('HOR003', 'SHBG', 'Hormones', 'Hormone binding protein', 'Hormone availability', '18-54', '18-114', 'nmol/L', ARRAY['Hormone imbalance'], ARRAY['Weight']),
('HOR004', 'LH', 'Hormones', 'Luteinising hormone', 'Reproductive hormone', '1.7-8.6', '2.4-12.6', 'IU/L', ARRAY['Infertility'], ARRAY['Stress']),
('HOR005', 'FSH', 'Hormones', 'Follicle hormone', 'Reproductive hormone', '1.5-12.4', '3.5-12.5', 'IU/L', ARRAY['Infertility'], ARRAY['Age']),
('HOR006', 'Prolactin', 'Hormones', 'Milk hormone', 'Fertility marker', '86-324', '102-496', 'mU/L', ARRAY['Infertility'], ARRAY['Stress']),
('HOR007', 'Oestradiol', 'Hormones', 'Main oestrogen', 'Female cycle', '44-211', '44-1570', 'pmol/L', ARRAY['PCOS'], ARRAY['Weight']),
('HOR008', 'Progesterone', 'Hormones', 'Pregnancy hormone', 'Uterus preparation', '<3.0', '<3.0-64.0', 'nmol/L', ARRAY['Infertility'], ARRAY['Stress']),
('HOR009', 'AMH', 'Hormones', 'Ovarian reserve', 'Egg count', 'N/A', '0.9-9.5', 'μg/L', ARRAY['Infertility'], ARRAY['Age']),
('HOR010', 'Cortisol', 'Hormones', 'Stress hormone', 'Stress response', '138-690', '138-690', 'nmol/L', ARRAY['Cushing syndrome'], ARRAY['Stress']),
('INF001', 'CRP', 'Inflammation', 'Inflammatory marker', 'Inflammation level', '<5.0', '<5.0', 'mg/L', ARRAY['Inflammation'], ARRAY['Diet']),
('OTH001', 'PSA', 'Other', 'Prostate marker', 'Prostate health', '<3.0', 'N/A', 'μg/L', ARRAY['Prostate cancer'], ARRAY['Age']);

-- Insert Randox Tests (20)
INSERT INTO tests_master (test_code, test_name, category, subcategory, description, biomarkers, sample_type, fasting_required, typical_turnaround_days, popularity_score) VALUES
('RAN001', 'Essential Health Check', 'General Health', 'Basic', 'Baseline health', '["FBC001","FBC002","FBC006","FBC012","LIP001","LIP002","LIP003","LIP004","LIV001","LIV002","KID001","KID002","DIA001","THY001"]'::jsonb, 'blood', true, 2, 95),
('RAN002', 'Premium Health', 'General Health', 'Comprehensive', 'Extensive screening', '["FBC001","FBC002","FBC003","FBC004","FBC006","FBC007","FBC008","FBC012","LIP001","LIP002","LIP003","LIP004","LIV001","LIV002","LIV003","LIV004","LIV006","KID001","KID002","KID003","KID004","KID005","DIA001","DIA002","THY001","THY002","VIT001","INF001"]'::jsonb, 'blood', true, 2, 90),
('RAN003', 'Heart Health', 'Heart Health', 'Cardiovascular', 'Cardiovascular risk', '["LIP001","LIP002","LIP003","LIP004","DIA001","DIA002","INF001","KID001"]'::jsonb, 'blood', true, 2, 85),
('RAN004', 'Advanced Lipid', 'Heart Health', 'Lipids', 'Cholesterol analysis', '["LIP001","LIP002","LIP003","LIP004"]'::jsonb, 'blood', true, 2, 75),
('RAN005', 'Diabetes Screen', 'Diabetes', 'Glucose', 'Diabetes risk', '["DIA001","DIA002","DIA003","LIP001","LIP004"]'::jsonb, 'blood', true, 2, 88),
('RAN006', 'HbA1c', 'Diabetes', 'Glucose', 'Blood sugar average', '["DIA002"]'::jsonb, 'blood', false, 1, 92),
('RAN007', 'Thyroid', 'Thyroid', 'Thyroid', 'Thyroid assessment', '["THY001","THY002","THY003"]'::jsonb, 'blood', false, 2, 90),
('RAN008', 'Thyroid Advanced', 'Thyroid', 'Comprehensive', 'Thyroid with antibodies', '["THY001","THY002","THY003","THY004"]'::jsonb, 'blood', false, 2, 80),
('RAN009', 'Vitamin D', 'Vitamins', 'Vitamin D', 'Vitamin D level', '["VIT001"]'::jsonb, 'blood', false, 2, 93),
('RAN010', 'B12 & Folate', 'Vitamins', 'B Vitamins', 'B vitamins', '["VIT002","VIT003"]'::jsonb, 'blood', false, 2, 85),
('RAN011', 'Iron Status', 'Vitamins', 'Iron', 'Iron assessment', '["VIT004","VIT005","FBC001"]'::jsonb, 'blood', false, 2, 87),
('RAN012', 'Liver Function', 'Liver Health', 'Liver', 'Liver enzymes', '["LIV001","LIV002","LIV003","LIV004","LIV006"]'::jsonb, 'blood', false, 2, 85),
('RAN013', 'Kidney Function', 'Kidney Health', 'Kidney', 'Kidney health', '["KID001","KID002","KID003","KID004","KID005"]'::jsonb, 'blood', false, 2, 82),
('RAN014', 'Testosterone', 'Men''s Health', 'Hormones', 'Male hormones', '["HOR001","HOR002","HOR003","HOR004","HOR005","HOR006"]'::jsonb, 'blood', true, 2, 88),
('RAN015', 'Men''s Health', 'Men''s Health', 'Comprehensive', 'Complete male health', '["HOR001","HOR002","HOR003","OTH001","LIP001","LIP002","LIP003","LIP004","LIV001","LIV002","KID001","KID002","DIA001","DIA002","THY001","VIT001"]'::jsonb, 'blood', true, 2, 85),
('RAN016', 'Female Hormones', 'Women''s Health', 'Hormones', 'Female hormones', '["HOR007","HOR008","HOR004","HOR005","HOR001","HOR006","THY001"]'::jsonb, 'blood', true, 2, 87),
('RAN017', 'Fertility', 'Women''s Health', 'Fertility', 'Fertility check', '["HOR009","HOR005","HOR004","HOR007","HOR006"]'::jsonb, 'blood', true, 2, 84),
('RAN018', 'Well Woman', 'Women''s Health', 'Comprehensive', 'Complete female health', '["HOR007","HOR008","THY001","THY002","VIT001","VIT002","VIT004","LIP001","LIP002","LIP003","DIA001","FBC001","FBC006","INF001"]'::jsonb, 'blood', true, 2, 86),
('RAN019', 'Sports Performance', 'Sports Performance', 'Athletic', 'Athletic markers', '["HOR001","HOR010","VIT004","VIT001","THY001","THY002","DIA001","LIP001","KID001","INF001"]'::jsonb, 'blood', true, 2, 80),
('RAN020', 'Inflammation', 'Inflammation', 'Inflammatory', 'Inflammation check', '["INF001","FBC006","FBC007"]'::jsonb, 'blood', false, 2, 78);

-- Insert Plasma Tests (5)
INSERT INTO tests_master (test_code, test_name, category, subcategory, description, biomarkers, sample_type, fasting_required, typical_turnaround_days, popularity_score) VALUES
('PLA001', 'Wellness Essentials', 'Wellness', 'Basic', 'Core wellness', '["FBC001","FBC002","FBC006","VIT001","VIT002","THY001","DIA001","LIP001"]'::jsonb, 'blood', true, 2, 88),
('PLA002', 'Energy & Fatigue', 'Wellness', 'Energy', 'Fatigue investigation', '["THY001","THY002","VIT001","VIT002","VIT004","VIT005","DIA001","FBC001","HOR010"]'::jsonb, 'blood', true, 2, 92),
('PLA003', 'Ultimate Performance', 'Sports Performance', 'Elite', 'Elite athlete', '["HOR001","HOR002","HOR010","VIT001","VIT004","VIT005","VIT002","THY001","THY002","DIA001","DIA003","LIP001","INF001","KID001"]'::jsonb, 'blood', true, 3, 75),
('PLA004', 'Menopause', 'Women''s Health', 'Menopause', 'Menopause markers', '["HOR005","HOR004","HOR007","HOR001","THY001","THY002"]'::jsonb, 'blood', false, 2, 83),
('PLA005', 'PCOS', 'Women''s Health', 'PCOS', 'PCOS markers', '["HOR001","HOR002","HOR003","HOR004","HOR005","HOR006","DIA003","LIP001","LIP004","THY001"]'::jsonb, 'blood', true, 2, 81);

-- Provider Mappings
INSERT INTO provider_test_mapping (provider_id, provider_test_id, provider_test_name, test_master_id, provider_url, current_price, turnaround_time_days, availability_status, sample_collection_method, accreditations) 
SELECT 'randox-healthcare', test_code, test_name, id, 'https://www.randoxhealth.com/test/' || lower(replace(test_name, ' ', '-')),
  CASE test_code WHEN 'RAN001' THEN 79 WHEN 'RAN002' THEN 149 WHEN 'RAN003' THEN 89 WHEN 'RAN004' THEN 69 WHEN 'RAN005' THEN 79 WHEN 'RAN006' THEN 39 WHEN 'RAN007' THEN 59 WHEN 'RAN008' THEN 89 WHEN 'RAN009' THEN 49 WHEN 'RAN010' THEN 55 WHEN 'RAN011' THEN 69 WHEN 'RAN012' THEN 59 WHEN 'RAN013' THEN 59 WHEN 'RAN014' THEN 79 WHEN 'RAN015' THEN 139 WHEN 'RAN016' THEN 99 WHEN 'RAN017' THEN 119 WHEN 'RAN018' THEN 149 WHEN 'RAN019' THEN 129 WHEN 'RAN020' THEN 65 END,
  2, 'available', 'Clinic venous blood', ARRAY['UKAS','CQC','ISO 15189']
FROM tests_master WHERE test_code LIKE 'RAN%';

INSERT INTO provider_test_mapping (provider_id, provider_test_id, provider_test_name, test_master_id, provider_url, current_price, turnaround_time_days, availability_status, sample_collection_method, accreditations)
SELECT 'plasma-health', test_code, test_name, id, 'https://www.plasmahealth.co.uk/test/' || lower(replace(test_name, ' ', '-')),
  CASE test_code WHEN 'PLA001' THEN 69 WHEN 'PLA002' THEN 85 WHEN 'PLA003' THEN 169 WHEN 'PLA004' THEN 95 WHEN 'PLA005' THEN 99 END,
  2, 'available', 'Clinic or home finger prick', ARRAY['UKAS','CQC','ISO 15189']
FROM tests_master WHERE test_code LIKE 'PLA%';

-- Enable Realtime
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE price_updates;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE provider_test_mapping;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE test_categories;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Category tracking
ALTER TABLE test_categories ADD COLUMN IF NOT EXISTS last_price_update timestamp with time zone;
ALTER TABLE test_categories ADD COLUMN IF NOT EXISTS price_check_frequency_hours integer DEFAULT 24;
ALTER TABLE test_categories ADD COLUMN IF NOT EXISTS realtime_enabled boolean DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_test_categories_realtime ON test_categories(realtime_enabled, last_price_update);
CREATE INDEX IF NOT EXISTS idx_price_updates_test_provider ON price_updates(test_id, provider, updated_at DESC);

-- Price history
CREATE TABLE IF NOT EXISTS price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id text NOT NULL,
  provider text NOT NULL,
  old_price numeric,
  new_price numeric NOT NULL,
  change_percentage numeric,
  availability_changed boolean DEFAULT false,
  changed_at timestamp with time zone DEFAULT now()
);

ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Price history viewable by everyone" ON price_history FOR SELECT USING (true);
CREATE INDEX IF NOT EXISTS idx_price_history_lookup ON price_history(test_id, provider, changed_at DESC);

-- Populate categories
INSERT INTO test_categories (name, provider_id, display_order, realtime_enabled, last_price_update)
SELECT DISTINCT category, 'all',
  CASE category WHEN 'General Health' THEN 1 WHEN 'Heart Health' THEN 2 WHEN 'Diabetes' THEN 3 WHEN 'Thyroid' THEN 4 WHEN 'Vitamins' THEN 5 WHEN 'Liver Health' THEN 6 WHEN 'Kidney Health' THEN 7 WHEN 'Men''s Health' THEN 8 WHEN 'Women''s Health' THEN 9 WHEN 'Sports Performance' THEN 10 WHEN 'Inflammation' THEN 11 WHEN 'Wellness' THEN 12 ELSE 99 END,
  true, now()
FROM tests_master WHERE category IS NOT NULL
ON CONFLICT (name, provider_id) DO NOTHING;
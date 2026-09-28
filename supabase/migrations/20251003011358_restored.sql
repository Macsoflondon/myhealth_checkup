-- Restored verbatim from supabase_migrations.schema_migrations (version 20251003011358).
-- md5 of the recorded statements: 77c378a37f2422199f1a2c115d5c7ca1
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- Add Lola Health and GoodBody Clinic Tests

-- Insert Lola Health Tests (9 tests)
INSERT INTO tests_master (test_code, test_name, category, subcategory, description, biomarkers, sample_type, fasting_required, typical_turnaround_days, popularity_score) VALUES
('LOL001', 'Peak Insights 70', 'General Health', 'Comprehensive', 'Most comprehensive health assessment with 70 critical biomarkers', '["FBC001","FBC002","FBC003","FBC004","FBC006","FBC007","FBC008","FBC012","LIP001","LIP002","LIP003","LIP004","LIV001","LIV002","LIV003","LIV004","LIV006","KID001","KID002","KID003","KID004","KID005","DIA001","DIA002","DIA003","THY001","THY002","THY003","VIT001","VIT002","VIT003","VIT004","VIT005","HOR001","HOR002","HOR003","HOR004","HOR005","HOR006","HOR007","HOR008","HOR009","HOR010","INF001","OTH001"]'::jsonb, 'blood', true, 4, 95),
('LOL002', 'Vital Check 56', 'General Health', 'Comprehensive', 'Thorough assessment of 56 key biomarkers for blood health and organ function', '["FBC001","FBC002","FBC003","FBC004","FBC006","FBC007","FBC008","FBC012","LIP001","LIP002","LIP003","LIP004","LIV001","LIV002","LIV003","LIV004","LIV006","KID001","KID002","KID003","KID004","KID005","DIA001","DIA002","THY001","THY002","THY003","VIT001","VIT002","VIT004","INF001"]'::jsonb, 'blood', true, 2, 92),
('LOL003', 'Core Health 45', 'General Health', 'Basic', 'Essential 45 biomarkers covering cholesterol, diabetes, vitamins, anemia, hormones', '["FBC001","FBC002","FBC006","FBC012","LIP001","LIP002","LIP003","LIP004","LIV001","LIV002","KID001","KID002","DIA001","DIA002","THY001","VIT001","VIT002","VIT004","HOR001","INF001"]'::jsonb, 'blood', true, 2, 90),
('LOL004', 'Female Hormones Clarity 30', 'Women''s Health', 'Hormones', '30 crucial biomarkers for understanding female hormonal balance', '["HOR007","HOR008","HOR004","HOR005","HOR006","HOR001","HOR002","HOR003","THY001","THY002","VIT001","VIT002","VIT004","LIP001","FBC001","INF001"]'::jsonb, 'blood', true, 2, 88),
('LOL005', 'Menopause Clarity 31', 'Women''s Health', 'Menopause', '31 biomarkers to understand menopause response', '["HOR005","HOR004","HOR007","HOR008","HOR001","HOR006","THY001","THY002","VIT001","VIT002","VIT004","LIP001","LIP002","FBC001","INF001"]'::jsonb, 'blood', false, 2, 86),
('LOL006', 'Female Active Boost 39', 'Women''s Health', 'Sports', '39 biomarkers for female athletes to reach peak performance', '["HOR007","HOR008","HOR001","HOR002","HOR010","VIT001","VIT002","VIT004","VIT005","THY001","THY002","DIA001","DIA003","LIP001","LIP004","FBC001","FBC002","FBC006","INF001","KID001"]'::jsonb, 'blood', true, 2, 84),
('LOL007', 'PCOS Clarity 24', 'Women''s Health', 'PCOS', '24 biomarkers specifically for assessing PCOS', '["HOR001","HOR002","HOR003","HOR004","HOR005","HOR006","HOR007","DIA001","DIA003","LIP001","LIP004","THY001","VIT001","INF001"]'::jsonb, 'blood', true, 2, 85),
('LOL008', 'Male Active Boost 36', 'Men''s Health', 'Sports', '36 biomarkers for male athletes to reach peak performance', '["HOR001","HOR002","HOR003","HOR010","VIT001","VIT002","VIT004","VIT005","THY001","THY002","DIA001","DIA003","LIP001","LIP004","FBC001","FBC002","FBC006","INF001","KID001","OTH001"]'::jsonb, 'blood', true, 2, 83),
('LOL009', 'Male Hormones Clarity 14', 'Men''s Health', 'Hormones', '14 essential biomarkers including testosterone for male hormonal health', '["HOR001","HOR002","HOR003","HOR004","HOR005","HOR006","THY001","OTH001"]'::jsonb, 'blood', true, 2, 87);

-- Insert GoodBody Clinic Tests (25 tests)
INSERT INTO tests_master (test_code, test_name, category, subcategory, description, biomarkers, sample_type, fasting_required, typical_turnaround_days, popularity_score) VALUES
('GOO001', 'Premium Complete Blood Test', 'General Health', 'Comprehensive', 'Complete wellness blood test', '["FBC001","FBC002","FBC003","FBC004","FBC006","FBC007","FBC008","FBC012","LIP001","LIP002","LIP003","LIP004","LIV001","LIV002","LIV003","LIV004","LIV006","KID001","KID002","KID003","KID004","KID005","DIA001","DIA002","THY001","THY002","VIT001","VIT002","VIT004","INF001"]'::jsonb, 'blood', true, 3, 94),
('GOO002', 'Advanced Well Woman', 'Women''s Health', 'Comprehensive', 'Comprehensive female health check with 52 biomarkers', '["HOR007","HOR008","HOR004","HOR005","HOR006","THY001","THY002","VIT001","VIT002","VIT004","LIP001","LIP002","LIP003","LIP004","FBC001","FBC002","FBC006","LIV001","LIV002","KID001","KID002","DIA001","INF001","OTH002"]'::jsonb, 'blood', true, 3, 92),
('GOO003', 'Advanced Well Man', 'Men''s Health', 'Comprehensive', 'Comprehensive male health check with 49 biomarkers', '["HOR001","HOR002","HOR003","OTH001","THY001","THY002","VIT001","VIT002","VIT004","LIP001","LIP002","LIP003","LIP004","FBC001","FBC002","FBC006","LIV001","LIV002","KID001","KID002","DIA001","INF001"]'::jsonb, 'blood', true, 3, 91),
('GOO004', 'Female Hormones', 'Women''s Health', 'Hormones', 'Female hormone and fertility assessment', '["HOR007","HOR008","HOR004","HOR005","HOR006","HOR001","THY001"]'::jsonb, 'blood', true, 3, 89),
('GOO005', 'Menopause Test', 'Women''s Health', 'Menopause', 'Menopause assessment', '["HOR005","HOR004","HOR007","HOR008","HOR001","THY001"]'::jsonb, 'blood', false, 3, 87),
('GOO006', 'AMH Fertility', 'Women''s Health', 'Fertility', 'Ovarian reserve assessment', '["HOR009","HOR005","HOR004"]'::jsonb, 'blood', false, 3, 85),
('GOO007', 'PCOS Test', 'Women''s Health', 'PCOS', 'PCOS assessment', '["HOR001","HOR002","HOR003","HOR004","HOR005","HOR006","HOR007","DIA003","LIP004","THY001"]'::jsonb, 'blood', true, 3, 86),
('GOO008', 'Male Hormones', 'Men''s Health', 'Hormones', 'Male hormone and fertility', '["HOR001","HOR002","HOR003","HOR004","HOR005","HOR006"]'::jsonb, 'blood', true, 3, 88),
('GOO009', 'Testosterone Test', 'Men''s Health', 'Hormones', 'Testosterone levels', '["HOR001","HOR002","HOR003"]'::jsonb, 'blood', true, 3, 90),
('GOO010', 'Erectile Dysfunction', 'Men''s Health', 'Hormones', 'Erectile dysfunction assessment', '["HOR001","HOR002","HOR003","DIA001","LIP001","THY001"]'::jsonb, 'blood', true, 3, 82),
('GOO011', 'PSA Test', 'Men''s Health', 'Prostate', 'Prostate cancer screening', '["OTH001"]'::jsonb, 'blood', false, 3, 84),
('GOO012', 'Thyroid Function', 'Thyroid', 'Thyroid', 'Thyroid function assessment', '["THY001","THY002","THY003"]'::jsonb, 'blood', false, 3, 91),
('GOO013', 'Thyroid with Antibodies', 'Thyroid', 'Comprehensive', 'Thyroid with antibodies', '["THY001","THY002","THY003","THY004"]'::jsonb, 'blood', false, 3, 85),
('GOO014', 'Liver Function', 'Liver Health', 'Liver', 'Liver function test', '["LIV001","LIV002","LIV003","LIV004","LIV006"]'::jsonb, 'blood', false, 3, 86),
('GOO015', 'Kidney Function', 'Kidney Health', 'Kidney', 'Kidney function test', '["KID001","KID002","KID003","KID004","KID005"]'::jsonb, 'blood', false, 3, 85),
('GOO016', 'Iron Test', 'Vitamins', 'Iron', 'Iron deficiency assessment', '["VIT004","VIT005","FBC001"]'::jsonb, 'blood', false, 3, 88),
('GOO017', 'Cardiac Risk', 'Heart Health', 'Cardiovascular', 'Heart disease risk assessment', '["LIP001","LIP002","LIP003","LIP004","DIA001","INF001"]'::jsonb, 'blood', true, 3, 87),
('GOO018', 'Sports & Fitness', 'Sports Performance', 'Athletic', 'Sports performance markers', '["HOR001","HOR010","VIT001","VIT004","THY001","DIA001","LIP001","FBC001","INF001"]'::jsonb, 'blood', true, 3, 82),
('GOO019', 'Tiredness & Fatigue', 'Wellness', 'Energy', 'Fatigue causes investigation', '["THY001","THY002","VIT001","VIT002","VIT004","FBC001","DIA001","HOR010"]'::jsonb, 'blood', true, 3, 89),
('GOO020', 'Anaemia Test', 'Wellness', 'Blood Health', 'Anaemia assessment', '["FBC001","FBC002","FBC003","FBC004","VIT004","VIT005"]'::jsonb, 'blood', false, 3, 84),
('GOO021', 'HbA1c Diabetes', 'Diabetes', 'Glucose', 'Diabetes monitoring', '["DIA002"]'::jsonb, 'blood', false, 2, 93),
('GOO022', 'Cholesterol Test', 'Heart Health', 'Lipids', 'Cholesterol assessment', '["LIP001","LIP002","LIP003","LIP004"]'::jsonb, 'blood', true, 3, 86),
('GOO023', 'Vitamins Test', 'Vitamins', 'Vitamins', 'Vitamin deficiency check', '["VIT001","VIT002","VIT003","VIT004"]'::jsonb, 'blood', false, 3, 87),
('GOO024', 'Weight Loss Test', 'Wellness', 'Weight', 'Weight management markers', '["THY001","THY002","DIA001","DIA002","DIA003","LIP001","LIP004","HOR010"]'::jsonb, 'blood', true, 3, 85),
('GOO025', 'Cortisol Stress', 'Wellness', 'Stress', 'Stress hormone assessment', '["HOR010"]'::jsonb, 'blood', false, 3, 81);

-- Insert Lola Health Provider Mappings
INSERT INTO provider_test_mapping (provider_id, provider_test_id, provider_test_name, test_master_id, provider_url, current_price, original_price, discount_percentage, turnaround_time_days, availability_status, sample_collection_method, accreditations)
SELECT 'lola-health', test_code, test_name, id, 'https://lolahealth.com/products/' || lower(replace(test_name, ' ', '-')),
  CASE test_code
    WHEN 'LOL001' THEN 221.00
    WHEN 'LOL002' THEN 184.10
    WHEN 'LOL003' THEN 162.50
    WHEN 'LOL004' THEN 167.00
    WHEN 'LOL005' THEN 171.50
    WHEN 'LOL006' THEN 212.00
    WHEN 'LOL007' THEN 158.00
    WHEN 'LOL008' THEN 180.50
    WHEN 'LOL009' THEN 158.00
  END,
  CASE test_code
    WHEN 'LOL001' THEN 350.00
    WHEN 'LOL002' THEN 250.00
    WHEN 'LOL003' THEN 210.00
    WHEN 'LOL004' THEN 195.00
    WHEN 'LOL005' THEN 220.00
    WHEN 'LOL006' THEN 230.00
    WHEN 'LOL007' THEN 220.00
    WHEN 'LOL008' THEN 230.00
    WHEN 'LOL009' THEN 195.00
  END,
  CASE test_code
    WHEN 'LOL001' THEN 37
    WHEN 'LOL002' THEN 26
    WHEN 'LOL003' THEN 23
    WHEN 'LOL004' THEN 14
    WHEN 'LOL005' THEN 22
    WHEN 'LOL006' THEN 8
    WHEN 'LOL007' THEN 28
    WHEN 'LOL008' THEN 22
    WHEN 'LOL009' THEN 19
  END,
  CASE test_code WHEN 'LOL001' THEN 4 ELSE 2 END,
  'available',
  'At-home phlebotomy service',
  ARRAY['UKAS','CQC','ISO 15189']
FROM tests_master WHERE test_code LIKE 'LOL%';

-- Insert GoodBody Clinic Provider Mappings
INSERT INTO provider_test_mapping (provider_id, provider_test_id, provider_test_name, test_master_id, provider_url, current_price, turnaround_time_days, availability_status, sample_collection_method, accreditations)
SELECT 'goodbody-clinic', test_code, test_name, id,
  'https://health.goodbodyclinic.com/product/' || lower(replace(replace(test_name, ' ', '-'), '''', '')),
  CASE test_code
    WHEN 'GOO001' THEN 199.00
    WHEN 'GOO002' THEN 175.00
    WHEN 'GOO003' THEN 175.00
    WHEN 'GOO004' THEN 119.00
    WHEN 'GOO005' THEN 89.00
    WHEN 'GOO006' THEN 79.00
    WHEN 'GOO007' THEN 129.00
    WHEN 'GOO008' THEN 119.00
    WHEN 'GOO009' THEN 69.00
    WHEN 'GOO010' THEN 99.00
    WHEN 'GOO011' THEN 49.00
    WHEN 'GOO012' THEN 59.00
    WHEN 'GOO013' THEN 79.00
    WHEN 'GOO014' THEN 49.00
    WHEN 'GOO015' THEN 49.00
    WHEN 'GOO016' THEN 59.00
    WHEN 'GOO017' THEN 89.00
    WHEN 'GOO018' THEN 99.00
    WHEN 'GOO019' THEN 79.00
    WHEN 'GOO020' THEN 59.00
    WHEN 'GOO021' THEN 39.00
    WHEN 'GOO022' THEN 49.00
    WHEN 'GOO023' THEN 69.00
    WHEN 'GOO024' THEN 89.00
    WHEN 'GOO025' THEN 59.00
  END,
  3,
  'available',
  'Clinic or mobile phlebotomy',
  ARRAY['UKAS','CQC','ISO 15189']
FROM tests_master WHERE test_code LIKE 'GOO%';

-- Update test categories with new categories
INSERT INTO test_categories (name, provider_id, display_order, realtime_enabled, last_price_update)
VALUES 
  ('Blood Health', 'all', 13, true, now())
ON CONFLICT (name, provider_id) DO NOTHING;

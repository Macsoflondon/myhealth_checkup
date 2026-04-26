-- Import Lola Health Products from CSV
-- 33 products across various health testing categories

INSERT INTO public.lola_health_products (product_name, price_gbp, product_url, areas_covered) VALUES
('Advanced Women''s Health Screening', 199.00, 'https://lolahealth.co.uk/products/advanced-womens-health-screening', ARRAY['Hormones', 'Thyroid', 'Vitamins', 'General Health']),
('Comprehensive Male Health Panel', 189.00, 'https://lolahealth.co.uk/products/comprehensive-male-health-panel', ARRAY['Hormones', 'Prostate', 'Vitamins', 'Heart Health']),
('Executive Health Checkup', 299.00, 'https://lolahealth.co.uk/products/executive-health-checkup', ARRAY['Heart Health', 'Liver', 'Kidney', 'Diabetes', 'Vitamins']),
('Fertility Assessment - Female', 159.00, 'https://lolahealth.co.uk/products/fertility-assessment-female', ARRAY['Hormones', 'Fertility', 'Thyroid']),
('Fertility Assessment - Male', 149.00, 'https://lolahealth.co.uk/products/fertility-assessment-male', ARRAY['Hormones', 'Fertility']),
('Thyroid Function Complete', 89.00, 'https://lolahealth.co.uk/products/thyroid-function-complete', ARRAY['Thyroid', 'Hormones']),
('Vitamin D Test', 39.00, 'https://lolahealth.co.uk/products/vitamin-d-test', ARRAY['Vitamins']),
('Vitamin B12 & Folate', 49.00, 'https://lolahealth.co.uk/products/vitamin-b12-folate', ARRAY['Vitamins']),
('Iron Status Profile', 59.00, 'https://lolahealth.co.uk/products/iron-status-profile', ARRAY['Vitamins', 'General Health']),
('Cardiovascular Risk Assessment', 129.00, 'https://lolahealth.co.uk/products/cardiovascular-risk-assessment', ARRAY['Heart Health', 'Cholesterol']),
('Diabetes Screening Panel', 79.00, 'https://lolahealth.co.uk/products/diabetes-screening-panel', ARRAY['Diabetes', 'General Health']),
('Liver Function Test', 69.00, 'https://lolahealth.co.uk/products/liver-function-test', ARRAY['Liver', 'General Health']),
('Kidney Function Test', 69.00, 'https://lolahealth.co.uk/products/kidney-function-test', ARRAY['Kidney', 'General Health']),
('Testosterone Test - Men', 79.00, 'https://lolahealth.co.uk/products/testosterone-test-men', ARRAY['Hormones', 'Men''s Health']),
('PCOS Screening', 139.00, 'https://lolahealth.co.uk/products/pcos-screening', ARRAY['Hormones', 'Women''s Health', 'Fertility']),
('Menopause Health Check', 119.00, 'https://lolahealth.co.uk/products/menopause-health-check', ARRAY['Hormones', 'Women''s Health']),
('Sports Performance Panel', 179.00, 'https://lolahealth.co.uk/products/sports-performance-panel', ARRAY['Vitamins', 'Hormones', 'General Health']),
('General Wellness Check', 99.00, 'https://lolahealth.co.uk/products/general-wellness-check', ARRAY['General Health', 'Vitamins']),
('STI Screening - Comprehensive', 149.00, 'https://lolahealth.co.uk/products/sti-screening-comprehensive', ARRAY['Sexual Health']),
('Allergy Testing Panel', 199.00, 'https://lolahealth.co.uk/products/allergy-testing-panel', ARRAY['Allergy', 'Immunity']),
('Food Intolerance Test', 189.00, 'https://lolahealth.co.uk/products/food-intolerance-test', ARRAY['Allergy', 'Gut Health']),
('Gut Microbiome Analysis', 249.00, 'https://lolahealth.co.uk/products/gut-microbiome-analysis', ARRAY['Gut Health', 'Immunity']),
('Inflammation Markers', 99.00, 'https://lolahealth.co.uk/products/inflammation-markers', ARRAY['General Health', 'Immunity']),
('Prostate Health Check', 89.00, 'https://lolahealth.co.uk/products/prostate-health-check', ARRAY['Prostate', 'Men''s Health']),
('Bone Health Profile', 109.00, 'https://lolahealth.co.uk/products/bone-health-profile', ARRAY['Vitamins', 'General Health']),
('Cortisol Stress Test', 79.00, 'https://lolahealth.co.uk/products/cortisol-stress-test', ARRAY['Hormones', 'Mental Health']),
('Sleep Quality Assessment', 129.00, 'https://lolahealth.co.uk/products/sleep-quality-assessment', ARRAY['Hormones', 'Mental Health']),
('Energy & Fatigue Panel', 139.00, 'https://lolahealth.co.uk/products/energy-fatigue-panel', ARRAY['Vitamins', 'Hormones', 'Thyroid']),
('Weight Management Panel', 159.00, 'https://lolahealth.co.uk/products/weight-management-panel', ARRAY['Hormones', 'Diabetes', 'Thyroid']),
('Hair Loss Investigation', 149.00, 'https://lolahealth.co.uk/products/hair-loss-investigation', ARRAY['Hormones', 'Vitamins', 'Thyroid']),
('Skin Health Assessment', 119.00, 'https://lolahealth.co.uk/products/skin-health-assessment', ARRAY['Vitamins', 'Hormones']),
('Prenatal Health Check', 169.00, 'https://lolahealth.co.uk/products/prenatal-health-check', ARRAY['Vitamins', 'Hormones', 'General Health']),
('Postnatal Recovery Panel', 159.00, 'https://lolahealth.co.uk/products/postnatal-recovery-panel', ARRAY['Vitamins', 'Hormones', 'Thyroid']);

-- Verify the import
SELECT COUNT(*) as total_products FROM public.lola_health_products;

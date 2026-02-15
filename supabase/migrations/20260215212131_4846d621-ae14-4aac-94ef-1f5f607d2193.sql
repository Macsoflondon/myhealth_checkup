
-- Women's Health (major gap - no general women's health master tests)
INSERT INTO tests_master (test_name, category, subcategory, description, biomarkers, sample_type, is_active, popularity_score, fasting_required, typical_turnaround_days) VALUES
('Well Woman Health Check', 'Women''s Health', 'Comprehensive', 'A comprehensive health check designed for women, covering hormones, thyroid, vitamins, iron, cholesterol, liver and kidney function.', '["FBC","Ferritin","Iron","TIBC","Vitamin D","Vitamin B12","Folate","TSH","Free T4","Free T3","Cholesterol","HDL","LDL","Triglycerides","HbA1c","ALT","ALP","GGT","Albumin","Bilirubin","Creatinine","eGFR","Urea","CRP","Oestradiol","FSH","LH"]', 'blood', true, 85, true, 3),

('Advanced Well Woman', 'Women''s Health', 'Comprehensive', 'An advanced panel for women including a full hormone profile, thyroid antibodies, vitamins, minerals, cardiovascular risk markers and full metabolic screen.', '["FBC","Ferritin","Iron","TIBC","Vitamin D","Vitamin B12","Folate","Active B12","TSH","Free T4","Free T3","Anti-TPO","Anti-TG","Cholesterol","HDL","LDL","Triglycerides","ApoB","Lp(a)","HbA1c","ALT","ALP","GGT","Albumin","Bilirubin","Creatinine","eGFR","Urea","CRP","hs-CRP","Oestradiol","FSH","LH","Progesterone","Prolactin","Testosterone","SHBG","DHEA-S","Cortisol","Magnesium","Zinc","Selenium"]', 'blood', true, 80, true, 3),

('Menopause Test', 'Women''s Health', 'Menopause', 'A targeted hormone panel to assess menopausal status including FSH, LH, oestradiol and related markers.', '["FSH","LH","Oestradiol","Testosterone","SHBG","Prolactin","TSH","Free T4"]', 'blood', true, 75, false, 2),

('Perimenopause Check', 'Women''s Health', 'Perimenopause', 'A hormone and health panel designed to assess perimenopause symptoms and hormonal changes.', '["FSH","LH","Oestradiol","Progesterone","Testosterone","SHBG","TSH","Free T4","Prolactin","Cortisol","Vitamin D","Ferritin"]', 'blood', true, 70, false, 2),

('PCOS Profile', 'Women''s Health', 'PCOS', 'A targeted panel for investigating polycystic ovary syndrome including androgens, insulin resistance and related hormones.', '["Testosterone","Free Testosterone","SHBG","DHEA-S","Androstenedione","FSH","LH","Oestradiol","Prolactin","HbA1c","Fasting Glucose","Insulin","TSH","Free T4","AMH"]', 'blood', true, 70, true, 3),

-- Fertility additions
('Progesterone Test', 'Fertility', 'Ovulation', 'A single progesterone blood test used to confirm ovulation, typically taken on day 21 of the menstrual cycle.', '["Progesterone"]', 'blood', true, 65, false, 1),

('Ovulation Profile', 'Fertility', 'Ovulation', 'A hormone panel measuring FSH, LH and oestradiol to assess ovarian function, typically taken on day 3 of the menstrual cycle.', '["FSH","LH","Oestradiol"]', 'blood', true, 65, false, 2),

('Female Hormones', 'Hormones', 'Female', 'A comprehensive female hormone panel covering reproductive hormones, thyroid and adrenal function.', '["FSH","LH","Oestradiol","Progesterone","Testosterone","SHBG","Prolactin","DHEA-S","Cortisol","TSH","Free T4"]', 'blood', true, 75, false, 2),

-- Cancer Screening additions
('Lung Cancer Screening', 'Cancer Screening', 'Lung', 'A screening test for early detection of lung cancer using blood-based biomarkers.', '["Lung Cancer Biomarkers"]', 'blood', true, 60, false, 5),

('Multi-Cancer Early Detection', 'Cancer Screening', 'Multi-Cancer', 'A comprehensive blood test designed to screen for multiple types of cancer simultaneously using advanced genomic or proteomic analysis.', '["Multi-Cancer Panel"]', 'blood', true, 65, false, 10),

('HPV Screening', 'Cancer Screening', 'Cervical', 'A screening test for human papillomavirus (HPV), the leading cause of cervical cancer.', '["HPV DNA"]', NULL, true, 70, false, 3),

-- General Health additions
('Comprehensive Health MOT', 'General Health', 'Comprehensive', 'An extensive health screening covering 100+ biomarkers across all major body systems for a complete health overview.', '["FBC","Ferritin","Iron","TIBC","Vitamin D","Vitamin B12","Folate","TSH","Free T4","Free T3","Anti-TPO","Cholesterol","HDL","LDL","Triglycerides","HbA1c","Fasting Glucose","ALT","ALP","GGT","Albumin","Bilirubin","AST","Creatinine","eGFR","Urea","Uric Acid","CRP","hs-CRP","Testosterone","SHBG","Oestradiol","FSH","LH","Cortisol","DHEA-S","Magnesium","Zinc","Selenium","Omega-3","Omega-6"]', 'blood', true, 80, true, 3),

('Basic Health Screen', 'General Health', 'Basic', 'A simple baseline health check covering essential markers for cholesterol, diabetes, liver, kidney and blood count.', '["FBC","Cholesterol","HDL","LDL","Triglycerides","HbA1c","ALT","Creatinine","eGFR","TSH","CRP"]', 'blood', true, 85, true, 2),

-- Inflammation / CRP
('CRP Test', 'Inflammation', 'Inflammatory', 'A C-reactive protein blood test to measure inflammation levels in the body.', '["CRP"]', 'blood', true, 60, false, 1),

-- Nutritional Health
('Nutritional Health', 'Vitamins', 'Comprehensive', 'A comprehensive nutritional panel covering key vitamins and minerals to identify deficiencies.', '["Vitamin D","Vitamin B12","Active B12","Folate","Ferritin","Iron","TIBC","Magnesium","Zinc","Selenium","Copper"]', 'blood', true, 70, false, 2),

('Folate Test', 'Vitamins', 'B Vitamins', 'A blood test to measure folate (vitamin B9) levels, essential for cell growth and DNA formation.', '["Folate"]', 'blood', true, 55, false, 1),

('Ferritin Test', 'Vitamins', 'Iron', 'A blood test measuring ferritin levels to assess iron stores in the body.', '["Ferritin"]', 'blood', true, 60, false, 1),

('Active B12 Test', 'Vitamins', 'B Vitamins', 'An active vitamin B12 blood test providing a more accurate measure of B12 status than total B12.', '["Active B12"]', 'blood', true, 60, false, 1),

-- Lipid / Cholesterol
('Lipid Profile', 'Heart Health', 'Lipids', 'A comprehensive cholesterol and lipid panel measuring total cholesterol, HDL, LDL and triglycerides.', '["Cholesterol","HDL","LDL","Triglycerides","Non-HDL Cholesterol","Chol:HDL Ratio"]', 'blood', true, 75, true, 1),

-- Diabetes
('Diabetes Profile', 'Diabetes', 'Glucose', 'A comprehensive diabetes assessment including HbA1c and fasting glucose to evaluate blood sugar control.', '["HbA1c","Fasting Glucose","Insulin"]', 'blood', true, 70, true, 2),

-- Digestive / Pancreatic
('Pancreatic Function', 'Gut Health', 'Digestive', 'A test measuring amylase and lipase enzyme levels to assess pancreatic health.', '["Amylase","Lipase"]', 'blood', true, 55, false, 1),

-- Toxicology
('Heavy Metals Screen', 'General Health', 'Toxicology', 'A blood test screening for heavy metal exposure including aluminium, lead, mercury and cadmium.', '["Aluminium","Lead","Mercury","Cadmium","Arsenic"]', 'blood', true, 50, false, 5),

-- Individual hormone tests
('Prolactin Test', 'Hormones', 'Pituitary', 'A blood test measuring prolactin hormone levels, relevant to fertility, menstrual irregularities and pituitary function.', '["Prolactin"]', 'blood', true, 55, false, 1),

('DHEA-S Test', 'Hormones', 'Adrenal', 'A blood test measuring DHEA-sulphate, an adrenal hormone linked to energy, mood and ageing.', '["DHEA-S"]', 'blood', true, 55, false, 1),

-- Thyroid individual
('TSH Test', 'Thyroid', 'Thyroid', 'A single TSH blood test to screen for thyroid dysfunction.', '["TSH"]', 'blood', true, 65, false, 1),

-- Sexual Health additions
('Chlamydia & Gonorrhoea Test', 'Sexual Health', 'STI', 'A targeted test for the two most common bacterial sexually transmitted infections.', '["Chlamydia","Gonorrhoea"]', NULL, true, 65, false, 2),

('Syphilis Test', 'Sexual Health', 'STI', 'A blood test for syphilis antibodies to detect current or past infection.', '["Syphilis Antibodies"]', 'blood', true, 60, false, 2),

('Comprehensive STI Panel', 'Sexual Health', 'Comprehensive', 'A comprehensive sexual health panel testing for all major sexually transmitted infections.', '["HIV","Hepatitis B","Hepatitis C","Syphilis","Chlamydia","Gonorrhoea","Herpes"]', NULL, true, 70, false, 3);

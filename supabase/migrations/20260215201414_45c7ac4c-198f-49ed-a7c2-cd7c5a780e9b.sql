
INSERT INTO tests_master (test_name, category, subcategory, description, biomarkers, sample_type, is_active) VALUES
-- Fertility
('AMH (Anti-Müllerian Hormone)', 'Fertility', 'Ovarian Reserve', 'Measures ovarian reserve to assess fertility potential. Key biomarker for women planning pregnancy or considering egg freezing.', '["AMH"]'::jsonb, 'blood', true),
('Female Fertility', 'Fertility', 'Female', 'Comprehensive female hormone and fertility panel including FSH, LH, oestradiol, and AMH to assess reproductive health.', '["FSH", "LH", "Oestradiol", "AMH", "Prolactin"]'::jsonb, 'blood', true),
('Male Fertility', 'Fertility', 'Male', 'Male hormone and fertility assessment including testosterone, FSH, LH, and prolactin for reproductive health evaluation.', '["Testosterone", "FSH", "LH", "Prolactin", "SHBG"]'::jsonb, 'blood', true),
('Antenatal Health', 'Fertility', 'Pregnancy', 'Antenatal screening panel covering key health markers for pregnancy monitoring and maternal wellbeing.', '["FBC", "Blood Group", "Rubella", "Hepatitis B", "HIV", "Syphilis"]'::jsonb, 'blood', true),
-- Allergy
('Allergy Profile', 'Allergy', 'Comprehensive', 'Comprehensive allergy panel testing for common environmental and food allergens including IgE antibodies.', '["Total IgE", "Specific IgE Panel"]'::jsonb, 'blood', true),
('Food Intolerance', 'Allergy', 'Food', 'Food intolerance and sensitivity testing to identify IgG reactions to common food groups.', '["Food IgG Panel"]'::jsonb, 'blood', true),
-- Cancer Screening
('Bowel Cancer Screening', 'Cancer Screening', 'Bowel', 'Faecal immunochemical test (FIT) for early detection of bowel cancer through occult blood detection.', '["FIT"]'::jsonb, NULL, true),
('Prostate Cancer Screening', 'Cancer Screening', 'Prostate', 'PSA and advanced biomarker testing for early prostate cancer detection.', '["PSA", "Free PSA"]'::jsonb, 'blood', true),
('Cervical Cancer Screening', 'Cancer Screening', 'Cervical', 'HPV screening test for early detection of cervical cancer risk factors.', '["HPV"]'::jsonb, NULL, true),
('Advanced Cancer Screening', 'Cancer Screening', 'Multi-Cancer', 'Advanced multi-cancer early detection screening using liquid biopsy or circulating tumour cell technology.', '["ctDNA", "CTC"]'::jsonb, 'blood', true),
-- Sexual Health
('STI Screen', 'Sexual Health', 'Comprehensive', 'Comprehensive sexually transmitted infection screening including chlamydia, gonorrhoea, syphilis, and HIV.', '["Chlamydia", "Gonorrhoea", "Syphilis", "HIV"]'::jsonb, 'blood', true),
('HIV Test', 'Sexual Health', 'HIV', 'HIV antibody and antigen testing for early and reliable detection of HIV infection.', '["HIV Ag/Ab"]'::jsonb, 'blood', true),
('Hepatitis Screening', 'Sexual Health', 'Hepatitis', 'Hepatitis B and C screening panel to detect current or past infection.', '["Hepatitis B Surface Antigen", "Hepatitis C Antibody"]'::jsonb, 'blood', true),
-- Immunology
('Autoimmune Screen', 'Immunology', 'Autoimmune', 'Autoimmune antibody panel including ANA for detection of autoimmune conditions such as lupus and rheumatoid arthritis.', '["ANA", "Anti-dsDNA", "Rheumatoid Factor"]'::jsonb, 'blood', true),
-- Haematology
('Full Blood Count', 'Haematology', 'Blood Count', 'Complete blood count measuring red cells, white cells, platelets, and haemoglobin for overall health assessment.', '["RBC", "WBC", "Platelets", "Haemoglobin", "Haematocrit", "MCV", "MCH"]'::jsonb, 'blood', true),
('Blood Group', 'Haematology', 'Blood Typing', 'ABO blood group and Rhesus factor typing for medical records and transfusion compatibility.', '["ABO Group", "Rhesus Factor"]'::jsonb, 'blood', true),
-- Gut Health
('Gut Health', 'Gut Health', 'Digestive', 'Digestive health panel assessing gut function, inflammation markers, and digestive enzyme levels.', '["Calprotectin", "H. Pylori", "Amylase"]'::jsonb, NULL, true),
('Coeliac Screen', 'Gut Health', 'Coeliac', 'Coeliac disease screening measuring tissue transglutaminase antibodies and total IgA.', '["tTG IgA", "Total IgA"]'::jsonb, 'blood', true),
-- Bone Health
('Bone Health', 'Bone Health', 'Bone Metabolism', 'Bone health markers including calcium, vitamin D, and phosphate for osteoporosis risk assessment.', '["Calcium", "Corrected Calcium", "Phosphate", "Vitamin D", "ALP"]'::jsonb, 'blood', true),
-- Hair Loss
('Hair Loss', 'Hair Loss', 'Trichology', 'Blood test panel investigating common causes of hair loss including iron, thyroid, and hormonal markers.', '["Ferritin", "TSH", "FT4", "Testosterone", "DHEA-S", "Zinc"]'::jsonb, 'blood', true),
-- Weight Management
('Weight Management', 'Weight Management', 'Metabolic', 'Metabolic and hormonal panel to support weight management including thyroid, insulin, and cortisol markers.', '["TSH", "FT4", "Insulin", "HbA1c", "Cortisol", "Leptin"]'::jsonb, 'blood', true),
-- Fatigue (supplements existing Wellness tests)
('Fatigue Profile', 'Wellness', 'Fatigue', 'Comprehensive fatigue investigation panel covering thyroid, iron, vitamins, and metabolic markers.', '["TSH", "FT4", "Ferritin", "Iron", "Vitamin B12", "Folate", "Vitamin D", "FBC"]'::jsonb, 'blood', true);

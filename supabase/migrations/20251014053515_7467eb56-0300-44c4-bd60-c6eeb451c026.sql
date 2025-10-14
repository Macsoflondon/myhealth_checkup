-- Insert Goodbody Clinic tests from CSV data
INSERT INTO provider_tests (
  provider_id,
  test_name,
  provider_test_id,
  category,
  price,
  description,
  is_active,
  url
) VALUES
  ('goodbody-clinic', 'Advanced Vitamins', 'Goodbody061', 'Vitamins & Nutrition', 649.0, 'Comprehensive vitamin panel including advanced markers. Sample: SST, EDTA (2 vials)', true, 'https://goodbody.co.uk/tests/advanced-vitamins'),
  ('goodbody-clinic', 'Advanced Well Man', 'Goodbody008', 'General Health', 175.0, 'Comprehensive male health check. Sample: SST, EDTA (2 vials)', true, 'https://goodbody.co.uk/tests/advanced-well-man'),
  ('goodbody-clinic', 'Advanced Well Woman', 'Goodbody009', 'General Health', 175.0, 'Comprehensive female health check. Sample: SST, EDTA (2 vials)', true, 'https://goodbody.co.uk/tests/advanced-well-woman'),
  ('goodbody-clinic', 'Anaemia', 'Goodbody076', 'Haematology', 119.0, 'Complete anaemia screening panel. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/anaemia'),
  ('goodbody-clinic', 'Anti-Mullerian', 'Goodbody039', 'Fertility', 109.0, 'AMH testing for ovarian reserve. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/anti-mullerian'),
  ('goodbody-clinic', 'Autoimmune Disease', 'Goodbody054', 'Autoimmune', 229.0, 'Comprehensive autoimmune screening. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/autoimmune-disease'),
  ('goodbody-clinic', 'Blood Group', 'Goodbody105', 'Haematology', 109.0, 'Blood group and RhD typing. Sample: EDTA (1 vial)', true, 'https://goodbody.co.uk/tests/blood-group'),
  ('goodbody-clinic', 'Cardiac Risk', 'Goodbody006', 'Heart & Cardiovascular', 99.0, 'Cardiovascular risk assessment panel. Sample: SST, EDTA (2 vials)', true, 'https://goodbody.co.uk/tests/cardiac-risk'),
  ('goodbody-clinic', 'Cholesterol', 'Goodbody004', 'Cholesterol & Lipids', 79.0, 'Full lipid profile test. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/cholesterol'),
  ('goodbody-clinic', 'Coeliac Disease', 'Goodbody055', 'Autoimmune', 179.0, 'Coeliac disease antibody screening. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/coeliac-disease'),
  ('goodbody-clinic', 'Complete Allergy', 'Goodbody063', 'Allergy', 399.0, 'Comprehensive allergy testing panel. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/complete-allergy'),
  ('goodbody-clinic', 'Complete Wellness', 'Goodbody124', 'General Health', 249.0, 'Full wellness screening package. Sample: SST, EDTA (3 vials)', true, 'https://goodbody.co.uk/tests/complete-wellness'),
  ('goodbody-clinic', 'Cortisol', 'Goodbody123', 'Hormones', 16.0, 'Cortisol stress hormone test. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/cortisol'),
  ('goodbody-clinic', 'Diabetes', 'Goodbody035', 'Diabetes', 79.0, 'Diabetes screening panel. Sample: EDTA (1 vial)', true, 'https://goodbody.co.uk/tests/diabetes'),
  ('goodbody-clinic', 'Enhanced Well Woman (Rachel''s Test)', 'Goodbody120', 'General Health', 175.0, 'Enhanced female health screening. Sample: SST, EDTA (2 vials)', true, 'https://goodbody.co.uk/tests/enhanced-well-woman'),
  ('goodbody-clinic', 'Erectile Dysfunction', 'Goodbody067', 'Men''s Health', 11.0, 'Erectile dysfunction hormone panel. Sample: SST, EDTA (2 vials)', true, 'https://goodbody.co.uk/tests/erectile-dysfunction'),
  ('goodbody-clinic', 'Female Hormone & Fertility', 'Goodbody020', 'Women''s Health', 119.0, 'Female reproductive hormone profile. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/female-hormone-fertility'),
  ('goodbody-clinic', 'Full Blood Count', 'Goodbody001', 'Haematology', 69.0, 'Complete blood count analysis. Sample: EDTA (1 vial)', true, 'https://goodbody.co.uk/tests/full-blood-count'),
  ('goodbody-clinic', 'Hepatitis Screening', 'Goodbody051', 'Infectious Disease', 129.0, 'Hepatitis B and C screening. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/hepatitis-screening'),
  ('goodbody-clinic', 'Iron', 'Goodbody013', 'Iron Studies', 79.0, 'Iron status and ferritin test. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/iron'),
  ('goodbody-clinic', 'Kidney', 'Goodbody002', 'Renal', 79.0, 'Kidney function test panel. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/kidney'),
  ('goodbody-clinic', 'Liver', 'Goodbody003', 'Liver', 79.0, 'Liver function test panel. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/liver'),
  ('goodbody-clinic', 'Male Hormone & Fertility', 'Goodbody019', 'Men''s Health', 79.0, 'Male reproductive hormone profile. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/male-hormone-fertility'),
  ('goodbody-clinic', 'Menopause', 'Goodbody021', 'Women''s Health', 119.0, 'Menopause hormone screening. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/menopause'),
  ('goodbody-clinic', 'Polycystic Ovary Syndrome', 'Goodbody014', 'Women''s Health', 129.0, 'PCOS hormone screening panel. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/pcos'),
  ('goodbody-clinic', 'Pregnancy', 'Goodbody040', 'Women''s Health', 79.0, 'Pregnancy screening test. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/pregnancy'),
  ('goodbody-clinic', 'Prostate PSA', 'Goodbody072', 'Men''s Health', 119.0, 'Prostate-specific antigen test. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/prostate-psa'),
  ('goodbody-clinic', 'Rheumatoid Arthritis', 'Goodbody056', 'Autoimmune', 129.0, 'Rheumatoid arthritis screening. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/rheumatoid-arthritis'),
  ('goodbody-clinic', 'Sexual Health', 'Goodbody071', 'Sexual Health', 169.0, 'Full sexual health screening. Sample: SST, EDTA (2 vials)', true, 'https://goodbody.co.uk/tests/sexual-health'),
  ('goodbody-clinic', 'STI Advanced', 'Goodbody052', 'Sexual Health', 249.0, 'Comprehensive STI testing panel. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/sti-advanced'),
  ('goodbody-clinic', 'Testosterone', 'Goodbody018', 'Hormones', 79.0, 'Total and free testosterone test. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/testosterone'),
  ('goodbody-clinic', 'Thyroid', 'Goodbody005', 'Thyroid', 79.0, 'Thyroid function test panel. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/thyroid'),
  ('goodbody-clinic', 'Vitamin B12', 'Goodbody011', 'Vitamins & Nutrition', 69.0, 'Vitamin B12 level test. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/vitamin-b12'),
  ('goodbody-clinic', 'Vitamin D', 'Goodbody010', 'Vitamins & Nutrition', 69.0, 'Vitamin D level test. Sample: SST (1 vial)', true, 'https://goodbody.co.uk/tests/vitamin-d'),
  ('goodbody-clinic', 'Well Man', 'Goodbody007', 'General Health', 99.0, 'Essential male health check. Sample: SST, EDTA (2 vials)', true, 'https://goodbody.co.uk/tests/well-man'),
  ('goodbody-clinic', 'Well Woman', 'Goodbody016', 'General Health', 99.0, 'Essential female health check. Sample: SST, EDTA (2 vials)', true, 'https://goodbody.co.uk/tests/well-woman')
ON CONFLICT (provider_id, provider_test_id) 
DO UPDATE SET
  test_name = EXCLUDED.test_name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  updated_at = now();

-- Create index for faster Goodbody queries
CREATE INDEX IF NOT EXISTS idx_provider_tests_goodbody ON provider_tests(provider_id) WHERE provider_id = 'goodbody-clinic';
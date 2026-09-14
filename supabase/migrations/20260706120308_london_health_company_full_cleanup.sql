
-- Remove /pages/ content pages scraped in as if they were tests
delete from public.provider_tests
where provider_id = 'london-health-company'
  and url in (
    'https://londonhealthcompany.co.uk/pages/test-requirements',
    'https://londonhealthcompany.co.uk/pages/test-requirements-for-iron-profile-ferritin',
    'https://londonhealthcompany.co.uk/pages/testosterone'
  );

-- Deactivate conflicting-price duplicate pairs pending re-scrape (can't confirm which price is current)
update public.provider_tests set is_active = false, url_verified = false
where provider_id = 'london-health-company'
  and url in (
    'https://londonhealthcompany.co.uk/products/prostate-specific-antigen-psa-blood-test',
    'https://londonhealthcompany.co.uk/products/vitamin-b12-blood-test'
  );

-- Remove clean duplicates (same URL, same price) keeping one row per product
delete from public.provider_tests where id in (
  '00000000-0000-0000-0000-000000000000' -- placeholder, replaced below by name-based deletes
);

delete from public.provider_tests
where provider_id = 'london-health-company' and is_active = true
  and test_name in (
    'A1c Diabetes Blood Test Kit (HbA1c)',
    'Home Cholesterol & Lipid Blood Test Kit',
    'Cortisol Test Kit',
    'Ferritin Blood Test Kit',
    'Kidney Function Blood Test Kit',
    'Male Hormone Panel Blood Test (4 Biomarkers)',
    'Magnesium & Calcium Blood Test Kit',
    'Female Hormone Panel Test Kit (6 Biomarkers)',
    'Thyroid Health Test UK | Lab Results & Report',
    'Liver Function Health Check Blood Test',
    'Essential Health MOT: 16 Biomarker Laboratory Blood Test'
  );

-- Re-categorise remaining miscategorised active tests
update public.provider_tests set category = 'Blood Count'
where provider_id = 'london-health-company' and is_active = true
  and test_name in ('Blood Count Test (4 Biomarkers) Haemoglobin, RBC, WBC & Platelets', 'Blood Count Test | RBC, WBC & Haemoglobin');

update public.provider_tests set category = 'Vitamins & Minerals'
where provider_id = 'london-health-company' and is_active = true
  and test_name in ('Folate Blood Test Kit with Lab-Verified Numerical Results. Delivered A', 'Nutrients (Ferritin, Vitamin D, B12, Folate) Blood Test');

update public.provider_tests set category = 'Men''s Health'
where provider_id = 'london-health-company' and is_active = true
  and test_name in ('Total Testosterone Test – CQC Regulated Lab', 'TRT Monitoring Blood Test Bundle | Ultimate Hormone & Health Panel UK');

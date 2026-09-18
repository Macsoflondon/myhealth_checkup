-- Closes the 7-row Clinilabs biomarker residual that has been stuck since
-- 2026-08-14 (reconfirmed unchanged on 2026-08-15 and again today,
-- 2026-09-04 — always the same 7 rows, always the same "clean 200,
-- no_biomarkers_found" outcome from mhc-biomarker-extract's Firecrawl-backed
-- fetch, despite the pages themselves being fine).
--
-- Verified today via a direct, non-Firecrawl fetch of each live page: all 6
-- real tests have a complete, intact "What's included in this test" section
-- with the exact biomarker names below (Advanced Female Fertility Check's
-- 50 names match the Aug 14 count exactly, corroborating this was always a
-- Firecrawl-specific fetch-layer issue for these 6 URLs, never a real
-- content or extraction-logic gap). Every name here is verbatim from
-- clinilabs.co.uk's own product page, not inferred or generated.
--
-- The 7th (Phlebotomy / Venous draw at clinic) is confirmed a genuine
-- collection-service add-on with no biomarker panel — left untouched,
-- exactly as the 14/15 August research concluded.

update public.provider_tests set
  biomarkers_list = '["Sodium"]'::jsonb,
  biomarker_count = 1,
  biomarkers_not_stated = false
where provider_id = 'clinilabs' and provider_test_id = 'clinilabs-sodium';

update public.provider_tests set
  biomarkers_list = '["Syphilis TP Latex"]'::jsonb,
  biomarker_count = 1,
  biomarkers_not_stated = false
where provider_id = 'clinilabs' and provider_test_id = 'clinilabs-syphilis-tp-latex';

update public.provider_tests set
  biomarkers_list = '["Total Protein"]'::jsonb,
  biomarker_count = 1,
  biomarkers_not_stated = false
where provider_id = 'clinilabs' and provider_test_id = 'clinilabs-total-protein';

update public.provider_tests set
  biomarkers_list = '["Creatinine", "eGFR"]'::jsonb,
  biomarker_count = 2,
  biomarkers_not_stated = false
where provider_id = 'clinilabs' and provider_test_id = 'clinilabs-creatinine-with-egfr';

update public.provider_tests set
  biomarkers_list = '["Luteinising hormone (LH)", "Follicle stimulating hormone level (FSH)", "Oestradiol", "Free T4", "TSH"]'::jsonb,
  biomarker_count = 5,
  biomarkers_not_stated = false
where provider_id = 'clinilabs' and provider_test_id = 'clinilabs-menopause-blood-test';

update public.provider_tests set
  biomarkers_list = '[
    "Mean Platelet Volume", "Red Cell Distribution Width", "White Blood Cells", "Red Blood Cells",
    "Haemoglobin", "Haematocrit", "Mean Corpuscular Volume", "Mean Corpuscular Haemoglobin",
    "Mean Corpuscular Haemoglobin Concentration", "Platelets", "Eosinophils", "Basophils",
    "Neutrophils", "Lymphocytes", "Monocytes",
    "Testosterone", "DHEA-S", "Oestradiol", "Prolactin", "Luteinising Hormone",
    "Follicle Stimulating Hormone", "Anti-Müllerian Hormone", "Cortisol", "Progesterone",
    "Sex Hormone Binding Globulin", "Free Testosterone",
    "TIBC", "Transferrin Saturation", "UIBC", "Transferrin", "Ferritin", "Iron",
    "Haemoglobin A1c", "TSH", "Free T4", "Free T3", "Magnesium",
    "Alanine Aminotransferase", "Total Bilirubin", "Albumin", "Total Protein",
    "Alkaline Phosphatase", "Aspartate Aminotransferase",
    "Bicarbonate", "Sodium", "Potassium", "Urea",
    "Vitamin B12", "Vitamin D", "Folate"
  ]'::jsonb,
  biomarker_count = 50,
  biomarkers_not_stated = false
where provider_id = 'clinilabs' and provider_test_id = 'clinilabs-advanced-female-fertility-check';

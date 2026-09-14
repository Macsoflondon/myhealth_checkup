-- Manual backfill for 14 of 17 Medical Diagnosis tests where mhc-biomarker-extract
-- touched the row but could not populate biomarkers_list (single-analyte / PCR /
-- functional-assay pages that don't use the accordion pattern the extractor
-- targets). Every value read verbatim from the live product page on 2026-09-04.
-- 3 tests (Stool Culture/Bacteria PCR, Stool Bacteria and Parasites PCR, Sputum)
-- are deliberately left untouched: their pages disclose no specific analyte or
-- organism list at all, so recording anything would be fabrication. They remain
-- genuine, documented gaps.

update provider_tests set biomarkers_list = '["Zonulin"]'::jsonb, biomarker_count = 1, biomarkers_not_stated = false
where provider_id = 'medical-diagnosis' and provider_test_id = 'meddiag-zonulin';

update provider_tests set biomarkers_list = '["Serotonin"]'::jsonb, biomarker_count = 1, biomarkers_not_stated = false
where provider_id = 'medical-diagnosis' and provider_test_id = 'meddiag-serotonin';

update provider_tests set biomarkers_list = '["Glutathione"]'::jsonb, biomarker_count = 1, biomarkers_not_stated = false
where provider_id = 'medical-diagnosis' and provider_test_id = 'meddiag-glutathione';

update provider_tests set biomarkers_list = '["Demodex spp. (mite presence and density, skin microscopy)"]'::jsonb, biomarker_count = 1, biomarkers_not_stated = false
where provider_id = 'medical-diagnosis' and provider_test_id = 'meddiag-demodex-spp-microscopy';

update provider_tests set biomarkers_list = '["CD57 (lymphocyte subset marker)"]'::jsonb, biomarker_count = 1, biomarkers_not_stated = false
where provider_id = 'medical-diagnosis' and provider_test_id = 'meddiag-lymphocyte-subsets-cd57';

update provider_tests set biomarkers_list = '["NK cell cytotoxicity (functional assay)"]'::jsonb, biomarker_count = 1, biomarkers_not_stated = false
where provider_id = 'medical-diagnosis' and provider_test_id = 'meddiag-nk-cells-cytotoxicity-assay';

update provider_tests set biomarkers_list = '["Gardnerella vaginalis"]'::jsonb, biomarker_count = 1, biomarkers_not_stated = false
where provider_id = 'medical-diagnosis' and provider_test_id = 'meddiag-gardnerella-vaginalis-pcr';

update provider_tests set biomarkers_list = '["Mycoplasma species","Ureaplasma species"]'::jsonb, biomarker_count = 2, biomarkers_not_stated = false
where provider_id = 'medical-diagnosis' and provider_test_id = 'meddiag-mycoplasma-ureaplasma-pcr';

update provider_tests set biomarkers_list = '["Chlamydia trachomatis","Neisseria gonorrhoeae"]'::jsonb, biomarker_count = 2, biomarkers_not_stated = false
where provider_id = 'medical-diagnosis' and provider_test_id = 'meddiag-chlamydia-trachomatis-neisseria-gonorrhoea-pcr';

update provider_tests set biomarkers_list = '["Chlamydia trachomatis"]'::jsonb, biomarker_count = 1, biomarkers_not_stated = false
where provider_id = 'medical-diagnosis' and provider_test_id = 'meddiag-chlamydia-trachomatis-pcr';

update provider_tests set biomarkers_list = '["Chlamydia trachomatis","Neisseria gonorrhoeae","Trichomonas vaginalis"]'::jsonb, biomarker_count = 3, biomarkers_not_stated = false
where provider_id = 'medical-diagnosis' and provider_test_id = 'meddiag-chlamydia-trachomatis-neisseria-gonorrhoea-pcr-trichomonas-vaginalis-pcr';

update provider_tests set biomarkers_list = '["Haemoglobin (faecal, quantitative)"]'::jsonb, biomarker_count = 1, biomarkers_not_stated = false
where provider_id = 'medical-diagnosis' and provider_test_id = 'meddiag-quantitative-faecal-immunochemical-test-qfit';

update provider_tests set
  biomarkers_list = '["Allergen macroarray panel — 300 components (extracts and molecular components; provider does not publish an itemised allergen list)"]'::jsonb,
  biomarker_count = 300,
  biomarkers_not_stated = false
where provider_id = 'medical-diagnosis' and provider_test_id = 'meddiag-alex3';

update provider_tests set
  biomarkers_list = '["ALT","AST","Testosterone","SHBG","HbA1c","Lipase","hs-CRP","Lipoprotein (a)","Full Blood Count (FBC) + Differential","Total Cholesterol","Triglycerides","HDL Cholesterol","LDL Cholesterol","Cholesterol Risk Factor","Non-HDL Cholesterol"]'::jsonb,
  biomarker_count = 15,
  biomarkers_not_stated = false
where provider_id = 'medical-diagnosis' and provider_test_id = 'meddiag-mens-essentials';
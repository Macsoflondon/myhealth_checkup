-- Manual backfill for the 7 real (non-add-on) Randox tests still missing
-- biomarkers after two randox-scraper runs. Every value read verbatim from
-- the live product page on 2026-09-04. Two of these pages make a marketing
-- claim ("15 genes" / "10 STIs") not matched by what the page actually
-- enumerates (13 genes / 9 organisms respectively, confirmed on two
-- independent fetches each) — recorded as the verified count, not the
-- provider's unverified higher claim; flagged separately, not silently
-- reconciled.

update provider_tests set
  biomarkers_list = '["Chlamydia","Herpes Simplex I","Herpes Simplex II","Mycoplasma genitalium","Mycoplasma hominis","Trichomonas vaginalis","Ureaplasma urealyticum","Gonorrhoea","Syphilis"]'::jsonb,
  biomarker_count = 9,
  biomarkers_not_stated = false
where provider_id = 'randox' and provider_test_id = 'randox-home-home-sti-test';

update provider_tests set
  biomarkers_list = '["APC","BMPR1A","EPCAM","MLH1","MSH2","MSH6","MUTYH","PMS2","PTEN","SMAD4","STK11","POLD1","POLE"]'::jsonb,
  biomarker_count = 13,
  biomarkers_not_stated = false
where provider_id = 'randox' and provider_test_id = 'randox-clinic-bowel-cancer-risk-test';

update provider_tests set
  biomarkers_list = '["rs10509540","rs1264813","rs12722495","rs2187668","rs2292239","rs2395029","rs2476601","rs3129889","rs689","rs7454108"]'::jsonb,
  biomarker_count = 10,
  biomarkers_not_stated = false
where provider_id = 'randox' and provider_test_id = 'randox-home-type-1-diabetes-home-test';

update provider_tests set
  biomarkers_list = '["Acinetobacter baumannii","Enterobacter cloacae","Enterococcus faecalis","Enterococcus faecium","Escherichia coli","Klebsiella aerogenes","Klebsiella oxytoca","Klebsiella pneumoniae","Morganella morganii","Proteus spp.","Providencia stuartii","Pseudomonas aeruginosa","Staphylococcus aureus","Staphylococcus epidermidis","Staphylococcus saprophyticus","Streptococcus agalactiae (GBS)","Methicillin Resistance","Trimethoprim Resistance","Vancomycin Resistance"]'::jsonb,
  biomarker_count = 19,
  biomarkers_not_stated = false
where provider_id = 'randox' and provider_test_id = 'randox-clinic-uti-test';

update provider_tests set
  biomarkers_list = '["BRCA1","BRCA2","CDH1","CHEK2","PALB2","PTEN","RAD51C","RAD51D","TP53","ATM"]'::jsonb,
  biomarker_count = 10,
  biomarkers_not_stated = false
where provider_id = 'randox' and provider_test_id = 'randox-clinic-breast-ovarian-cancer-risk-test';

update provider_tests set
  biomarkers_list = '["Human Adenovirus A/B/C/D/E","Human Bocavirus 1/2/3","Human Coronavirus 229E/NL63","Human Coronavirus OC43/HKU1","Human Enterovirus A/B/C","Human Metapneumovirus","Human Parainfluenza Virus 1","Human Parainfluenza Virus 2","Human Parainfluenza Virus 3","Human Parainfluenza Virus 4","Human Respiratory Syncytial Virus A","Human Respiratory Syncytial Virus B","Human Rhinovirus A/B/C","Influenza A","Influenza B","Bordetella Pertussis","Chlamydophila Pneumoniae","Haemophilus Influenzae","Legionella Pneumophila","Moraxella Catarrhalis","Mycoplasma Pneumoniae","Streptococcus Pneumoniae"]'::jsonb,
  biomarker_count = 22,
  biomarkers_not_stated = false
where provider_id = 'randox' and provider_test_id = 'randox-clinic-cold-cough-flu-test';

update provider_tests set
  biomarkers_list = '["Chlamydia","Herpes Simplex I","Herpes Simplex II","Mycoplasma genitalium","Mycoplasma hominis","Trichomonas vaginalis","Ureaplasma urealyticum","Gonorrhoea","Syphilis"]'::jsonb,
  biomarker_count = 9,
  biomarkers_not_stated = false
where provider_id = 'randox' and provider_test_id = 'randox-clinic-simplyhealth-sti-urine-next-day';
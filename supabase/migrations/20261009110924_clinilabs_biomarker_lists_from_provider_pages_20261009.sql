-- Restored from supabase_migrations.schema_migrations (version 20261009110924, name clinilabs_biomarker_lists_from_provider_pages_20261009).
-- md5 of the recorded statements: 4539d6481d1a3d4128c6d4552f893c66
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.
--
-- Replay adaptation (2026-10-11): the recorded check raised an exception unless
-- exactly 14 Clinilabs product rows matched. Those rows come from the scrapers, not
-- from migrations, so a fresh database has none and stopped here. The check now
-- reports the count with a notice, and the update matches only the rows that exist.
-- Production ran the original check, which found all 14.

create temp table _cl(slug text, names text[]) on commit drop;
insert into _cl values
('advanced-health-check', array['White Blood Cells (WBC)','Red Blood Cells (RBC)','Haemoglobin (Hb)','Haematocrit (HCT)','Mean Corpuscular Volume (MCV)','Mean Corpuscular Haemoglobin (MCH)','Mean Corpuscular Haemoglobin Concentration (MCHC)','Red Cell Distribution Width (RDW)','Platelets (PLT)','Mean Platelet Volume (MPV)','Lymphocytes (Ly)','Monocytes (Mo)','Neutrophils (Ne)','Eosinophils (Eo)','Basophils (Ba)','Sodium','Total protein','Creatinine','eGFR (estimated Glomerular Filtration Rate)','Urea','Globulin','Albumin','Bilirubin (Total)','Alanine Aminotransferase (ALT)','Gamma-Glutamyl transpeptidase (GGT)','Alkaline phosphatase (ALP)','Aspartate Aminotransferase (AST) (SGOT)','Calcium','Corrected Calcium','Potassium','Chloride','C Reactive Protein (CRP)','Immunoglobulin G (IgG)','Immunoglobulin M (IgM)','Immunoglobulin A (IgA)']),
('advanced-heart-cholesterol-blood-test', array['Cholesterol','HDL Cholesterol','LDL Cholesterol','Non-HDL Cholesterol','Triglycerides','HDL/Cholesterol Ratio','Apolipoprotein A1 (APO A1)','Apolipoprotein B (APO B)','Apo A1:B Ratio','Lipoprotein (a) level','C Reactive Protein (CRP)','Haemoglobin A1c (HBA1c)']),
('complete-mens-health-check', array['White Blood Cells (WBC)','Red Blood Cells (RBC)','Haemoglobin (Hb)','Haematocrit (HCT)','Mean Corpuscular Volume (MCV)','Mean Corpuscular Haemoglobin (MCH)','Mean Corpuscular Haemoglobin Concentration (MCHC)','Red Cell Distribution Width (RDW)','Platelets (PLT)','Mean Platelet Volume (MPV)','Lymphocytes (Ly)','Monocytes (Mo)','Neutrophils (Ne)','Eosinophils (Eo)','Basophils (Ba)','Immunoglobulin A (IgA)','TSH','Free T4','Free T3','Vitamin B12','Folate','Ferritin','Iron','Transferrin','Creatinine','eGFR (estimated Glomerular Filtration Rate)','Urea','Uric Acid','Globulin','Albumin','Total protein','Bilirubin (Total)','Alanine Aminotransferase (ALT)','Gamma-Glutamyl transpeptidase (GGT)','Alkaline phosphatase (ALP)','Cholesterol','HDL Cholesterol','LDL Cholesterol','Non-HDL Cholesterol','Triglycerides','HDL/Cholesterol Ratio','C Reactive Protein (CRP)','Magnesium','Testosterone']),
('complete-womens-health-check', array['White Blood Cells (WBC)','Red Blood Cells (RBC)','Haemoglobin (Hb)','Haematocrit (HCT)','Mean Corpuscular Volume (MCV)','Mean Corpuscular Haemoglobin (MCH)','Mean Corpuscular Haemoglobin Concentration (MCHC)','Red Cell Distribution Width (RDW)','Platelets (PLT)','Mean Platelet Volume (MPV)','Lymphocytes (Ly)','Monocytes (Mo)','Neutrophils (Ne)','Eosinophils (Eo)','Basophils (Ba)','Immunoglobulin A (IgA)','TSH','Free T4','Free T3','Vitamin B12','Folate','Ferritin','Iron','Transferrin','Creatinine','eGFR (estimated Glomerular Filtration Rate)','Urea','Uric Acid','Globulin','Albumin','Total protein','Bilirubin (Total)','Alanine Aminotransferase (ALT)','Gamma-Glutamyl transpeptidase (GGT)','Alkaline phosphatase (ALP)','Cholesterol','HDL Cholesterol','LDL Cholesterol','Non-HDL Cholesterol','Triglycerides','HDL/Cholesterol Ratio','C Reactive Protein (CRP)','Magnesium','Oestradiol','Luteinising hormone (LH)','Follicle stimulating hormone level (FSH)']),
('erectile-dysfunction-blood-test', array['Testosterone','Testosterone Free','Sex hormone binding globulin level (SHBG)','Albumin','Free Androgen Index','Prolactin','Luteinising hormone (LH)','TSH','Free T4','Free T3','Cholesterol','HDL Cholesterol','LDL Cholesterol','Non-HDL Cholesterol','Triglycerides','HDL/Cholesterol Ratio','Haemoglobin A1c (HBA1c)']),
('essential-health-check', array['Alanine Aminotransferase (ALT)','Alkaline phosphatase (ALP)','Gamma-Glutamyl transpeptidase (GGT)','Bilirubin (Total)','Albumin','Total protein','Globulin','Urea','Creatinine','eGFR (estimated Glomerular Filtration Rate)','Sodium','Potassium','Chloride','Bicarbonate','Cholesterol','HDL Cholesterol','LDL Cholesterol','Non-HDL Cholesterol','Triglycerides','HDL/Cholesterol Ratio','Haemoglobin A1c (HBA1c)','Ferritin','Corrected Calcium','C Reactive Protein (CRP)','Uric Acid']),
('herpes-simplex-igm', array['Herpes Simplex Virus 1 and 2 IgM']),
('herpes-simplex-igg', array['Herpes Simplex Virus 1 IgG','Herpes Simplex Virus 2 IgG']),
('pcos-blood-test', array['Testosterone','Sex hormone binding globulin level (SHBG)','Free Androgen Index','Dehydroepiandrosterone sulphate (DHEA-S)','Luteinising hormone (LH)','Follicle stimulating hormone level (FSH)','LH:FSH Ratio','Oestradiol','Prolactin','Anti Mullerian Hormone','TSH','Haemoglobin A1c (HBA1c)','Cholesterol','HDL Cholesterol','LDL Cholesterol','Non-HDL Cholesterol','Triglycerides','HDL/Cholesterol Ratio']),
('thyroid-function-with-antibodies-blood-test', array['Free T3','Free T4','TSH','Thyroglobulin Antibody','Thyroid peroxidase (TPO) antibodies']),
('uric-acid', array['Uric Acid']),
('vitamin-mineral-blood-test', array['Vitamin D (25-OH)','Vitamin B12','Folate','Ferritin','Iron','TIBC','Transferrin','Transferrin Saturation','UIBC','Magnesium','Calcium','Corrected Calcium','C Reactive Protein (CRP)','Haemoglobin A1c (HBA1c)']),
-- single-analyte tests named for the analyte, where the page shows only "1 Biomarker"
('gamma-glutamyl-transpeptidase-ggt', array['Gamma-Glutamyl transpeptidase (GGT)']),
('hepatitis-b-core-antibody-igm', array['Hepatitis B Core Antibody (IgM)']);

do $$ declare n int; begin
  select count(*) into n from _cl c join public.provider_tests t on t.provider_id='clinilabs' and t.url = 'https://www.clinilabs.co.uk/products/' || c.slug;
  if n <> 14 then raise notice 'Expected 14 matching Clinilabs tests, got %', n; end if;
end $$;

update public.provider_tests t
   set biomarkers_list = to_jsonb(c.names), biomarker_count = array_length(c.names, 1), biomarkers_not_stated = false, updated_at = now()
  from _cl c
 where t.provider_id = 'clinilabs' and t.url = 'https://www.clinilabs.co.uk/products/' || c.slug;

select public.refresh_provider_test_biomarkers();

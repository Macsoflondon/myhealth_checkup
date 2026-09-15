WITH seed(snomed_concept_id, preferred_term, semantic_tag, match_names) AS (
  VALUES
  ('166816008','Serum cholesterol level','observable entity',ARRAY['total cholesterol','cholesterol']),
  ('166830009','Serum HDL cholesterol level','observable entity',ARRAY['hdl cholesterol','hdl']),
  ('166831008','Serum LDL cholesterol level','observable entity',ARRAY['ldl cholesterol','ldl']),
  ('166833006','Serum triglycerides level','observable entity',ARRAY['triglycerides','triglyceride']),
  ('43396009','Hemoglobin A1c measurement','observable entity',ARRAY['hba1c','haemoglobin a1c']),
  ('33747003','Glucose level','observable entity',ARRAY['glucose','fasting glucose']),
  ('38082009','Hemoglobin concentration','observable entity',ARRAY['haemoglobin','hemoglobin']),
  ('28317006','Hematocrit determination','observable entity',ARRAY['haematocrit','hematocrit']),
  ('14089001','Red blood cell count','observable entity',ARRAY['red blood cell count','red blood cells']),
  ('12227005','White blood cell count','observable entity',ARRAY['white blood cell count','white blood cells']),
  ('61928009','Platelet count','observable entity',ARRAY['platelet count','platelets']),
  ('70901006','Serum creatinine level','observable entity',ARRAY['creatinine']),
  ('105011006','Urea level','observable entity',ARRAY['urea']),
  ('61151006','Serum albumin level','observable entity',ARRAY['albumin']),
  ('61789006','Total protein level','observable entity',ARRAY['total protein']),
  ('50223003','Serum total bilirubin level','observable entity',ARRAY['bilirubin','total bilirubin']),
  ('87678001','Serum alanine aminotransferase level','observable entity',ARRAY['alt','alanine transferase','alanine aminotransferase']),
  ('58962007','Serum aspartate aminotransferase level','observable entity',ARRAY['ast','aspartate aminotransferase']),
  ('39088009','Serum alkaline phosphatase level','observable entity',ARRAY['alkaline phosphatase','alp']),
  ('61608008','Serum gamma glutamyl transferase level','observable entity',ARRAY['ggt','gamma gt','gamma glutamyl transferase']),
  ('89264008','Serum thyroid stimulating hormone level','observable entity',ARRAY['tsh','thyroid stimulating hormone']),
  ('61167004','Serum free thyroxine level','observable entity',ARRAY['free t4','free thyroxine']),
  ('167110000','Serum free triiodothyronine level','observable entity',ARRAY['free t3']),
  ('63476009','Prostate specific antigen level','observable entity',ARRAY['psa','prostate specific antigen']),
  ('165590007','C-reactive protein level','observable entity',ARRAY['crp','c-reactive protein','c reactive protein']),
  ('62430004','Serum ferritin level','observable entity',ARRAY['ferritin']),
  ('64719006','Serum iron level','observable entity',ARRAY['iron']),
  ('104755000','Serum vitamin B12 level','observable entity',ARRAY['vitamin b12','b12']),
  ('104598001','Serum folate level','observable entity',ARRAY['folate']),
  ('167086006','Serum 25-hydroxy vitamin D level','observable entity',ARRAY['vitamin d','vitamin d (25 oh)','25-hydroxyvitamin d']),
  ('25197003','Serum sodium level','observable entity',ARRAY['sodium']),
  ('59573005','Serum potassium level','observable entity',ARRAY['potassium']),
  ('104934005','Serum chloride level','observable entity',ARRAY['chloride']),
  ('17202008','Serum calcium level','observable entity',ARRAY['calcium']),
  ('49960006','Serum phosphate level','observable entity',ARRAY['phosphate','phosphorus']),
  ('35664005','Serum magnesium level','observable entity',ARRAY['magnesium']),
  ('35222005','Serum urate level','observable entity',ARRAY['uric acid','urate']),
  ('81894009','Serum testosterone level','observable entity',ARRAY['testosterone','total testosterone']),
  ('79878006','Serum estradiol level','observable entity',ARRAY['oestradiol','estradiol']),
  ('62596007','Serum progesterone level','observable entity',ARRAY['progesterone']),
  ('47557005','Serum follicle stimulating hormone level','observable entity',ARRAY['fsh','follicle stimulating hormone']),
  ('55964009','Serum luteinizing hormone level','observable entity',ARRAY['lh','luteinising hormone','luteinizing hormone']),
  ('61046002','Serum prolactin level','observable entity',ARRAY['prolactin']),
  ('104957009','Serum sex hormone binding globulin level','observable entity',ARRAY['shbg','sex hormone binding globulin']),
  ('104802006','Serum dehydroepiandrosterone sulfate level','observable entity',ARRAY['dhea sulphate','dhea-s','dheas']),
  ('80938002','Serum cortisol level','observable entity',ARRAY['cortisol']),
  ('4537002','Erythrocyte sedimentation rate','observable entity',ARRAY['esr','erythrocyte sedimentation rate'])
)
INSERT INTO public.clinical_snomed_mappings (
  snomed_concept_id, preferred_term, biomarker_id, biomarker_code,
  biomarker_name, category, is_active, is_primary,
  verification_status, code_source, notes
)
SELECT
  s.snomed_concept_id, s.preferred_term,
  h.id, h.biomarker_code, h.name, h.category_clinical, true, false,
  'unverified',
  'seeded candidate, not yet checked against the NHS TRUD SNOMED CT UK Edition release',
  'Matched to biomarker by name. Confirm the concept ID and preferred term against the UK Edition browser before marking verified.'
FROM seed s
LEFT JOIN LATERAL (
  SELECT bh.id, bh.biomarker_code, bh.name, bh.category_clinical
  FROM public.biomarker_hub bh
  WHERE bh.status <> 'duplicate'
    AND lower(trim(bh.name)) = ANY(s.match_names)
  ORDER BY array_position(s.match_names, lower(trim(bh.name)))
  LIMIT 1
) h ON true
ON CONFLICT (snomed_concept_id) DO NOTHING;
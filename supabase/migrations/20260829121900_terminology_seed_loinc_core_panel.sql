-- Seed LOINC for the biomarkers that actually drive comparison on the
-- platform. Every row is inserted as verification_status = 'unverified' and
-- is_primary = false: these are working candidates, not signed-off mappings.
-- Nothing downstream will treat them as authoritative until a human verifies
-- each one against the official LOINC release.

WITH seed(loinc_code, long_name, short_name, component, property, time_aspect, system, scale_type, common_units, match_names) AS (
  VALUES
  ('2093-3','Cholesterol [Mass/volume] in Serum or Plasma','Cholest SerPl-mCnc','Cholesterol','MCnc','Pt','Ser/Plas','Qn',ARRAY['mmol/L','mg/dL'],ARRAY['total cholesterol','cholesterol']),
  ('2085-9','Cholesterol in HDL [Mass/volume] in Serum or Plasma','HDLc SerPl-mCnc','Cholesterol.in HDL','MCnc','Pt','Ser/Plas','Qn',ARRAY['mmol/L','mg/dL'],ARRAY['hdl cholesterol','hdl']),
  ('2089-1','Cholesterol in LDL [Mass/volume] in Serum or Plasma by calculation','LDLc SerPl Calc-mCnc','Cholesterol.in LDL','MCnc','Pt','Ser/Plas','Qn',ARRAY['mmol/L','mg/dL'],ARRAY['ldl cholesterol','ldl']),
  ('2571-8','Triglyceride [Mass/volume] in Serum or Plasma','Trigl SerPl-mCnc','Triglyceride','MCnc','Pt','Ser/Plas','Qn',ARRAY['mmol/L','mg/dL'],ARRAY['triglycerides','triglyceride']),
  ('4548-4','Haemoglobin A1c/Haemoglobin.total in Blood','HbA1c MFr Bld','Hemoglobin A1c/Hemoglobin.total','MFr','Pt','Bld','Qn',ARRAY['mmol/mol','%'],ARRAY['hba1c','haemoglobin a1c']),
  ('2345-7','Glucose [Mass/volume] in Serum or Plasma','Glucose SerPl-mCnc','Glucose','MCnc','Pt','Ser/Plas','Qn',ARRAY['mmol/L','mg/dL'],ARRAY['glucose','fasting glucose']),
  ('718-7','Haemoglobin [Mass/volume] in Blood','Hgb Bld-mCnc','Hemoglobin','MCnc','Pt','Bld','Qn',ARRAY['g/L','g/dL'],ARRAY['haemoglobin','hemoglobin']),
  ('4544-3','Haematocrit [Volume Fraction] of Blood by Automated count','Hct VFr Bld Auto','Hematocrit','VFr','Pt','Bld','Qn',ARRAY['L/L','%'],ARRAY['haematocrit','hematocrit']),
  ('789-8','Erythrocytes [#/volume] in Blood by Automated count','RBC # Bld Auto','Erythrocytes','NCnc','Pt','Bld','Qn',ARRAY['x10^12/L'],ARRAY['red blood cell count','red blood cells']),
  ('6690-2','Leukocytes [#/volume] in Blood by Automated count','WBC # Bld Auto','Leukocytes','NCnc','Pt','Bld','Qn',ARRAY['x10^9/L'],ARRAY['white blood cell count','white blood cells']),
  ('777-3','Platelets [#/volume] in Blood by Automated count','Platelet # Bld Auto','Platelets','NCnc','Pt','Bld','Qn',ARRAY['x10^9/L'],ARRAY['platelet count','platelets']),
  ('2160-0','Creatinine [Mass/volume] in Serum or Plasma','Creat SerPl-mCnc','Creatinine','MCnc','Pt','Ser/Plas','Qn',ARRAY['umol/L','mg/dL'],ARRAY['creatinine']),
  ('22664-7','Urea [Moles/volume] in Serum or Plasma','Urea SerPl-sCnc','Urea','SCnc','Pt','Ser/Plas','Qn',ARRAY['mmol/L'],ARRAY['urea']),
  ('1751-7','Albumin [Mass/volume] in Serum or Plasma','Albumin SerPl-mCnc','Albumin','MCnc','Pt','Ser/Plas','Qn',ARRAY['g/L'],ARRAY['albumin']),
  ('2885-2','Protein [Mass/volume] in Serum or Plasma','Prot SerPl-mCnc','Protein','MCnc','Pt','Ser/Plas','Qn',ARRAY['g/L'],ARRAY['total protein']),
  ('1975-2','Bilirubin.total [Mass/volume] in Serum or Plasma','Bilirub SerPl-mCnc','Bilirubin','MCnc','Pt','Ser/Plas','Qn',ARRAY['umol/L'],ARRAY['bilirubin','total bilirubin']),
  ('1742-6','Alanine aminotransferase [Enzymatic activity/volume] in Serum or Plasma','ALT SerPl-cCnc','Alanine aminotransferase','CCnc','Pt','Ser/Plas','Qn',ARRAY['U/L','IU/L'],ARRAY['alt','alanine transferase','alanine aminotransferase']),
  ('1920-8','Aspartate aminotransferase [Enzymatic activity/volume] in Serum or Plasma','AST SerPl-cCnc','Aspartate aminotransferase','CCnc','Pt','Ser/Plas','Qn',ARRAY['U/L','IU/L'],ARRAY['ast','aspartate aminotransferase']),
  ('6768-6','Alkaline phosphatase [Enzymatic activity/volume] in Serum or Plasma','ALP SerPl-cCnc','Alkaline phosphatase','CCnc','Pt','Ser/Plas','Qn',ARRAY['U/L','IU/L'],ARRAY['alkaline phosphatase','alp']),
  ('2324-2','Gamma glutamyl transferase [Enzymatic activity/volume] in Serum or Plasma','GGT SerPl-cCnc','Gamma glutamyl transferase','CCnc','Pt','Ser/Plas','Qn',ARRAY['U/L','IU/L'],ARRAY['ggt','gamma gt','gamma glutamyl transferase']),
  ('3016-3','Thyrotropin [Units/volume] in Serum or Plasma','TSH SerPl-aCnc','Thyrotropin','ACnc','Pt','Ser/Plas','Qn',ARRAY['mIU/L'],ARRAY['tsh','thyroid stimulating hormone']),
  ('3024-7','Thyroxine (T4) free [Mass/volume] in Serum or Plasma','T4 Free SerPl-mCnc','Thyroxine.free','MCnc','Pt','Ser/Plas','Qn',ARRAY['pmol/L'],ARRAY['free t4','free thyroxine']),
  ('3051-0','Triiodothyronine (T3) Free [Mass/volume] in Serum or Plasma','T3Free SerPl-mCnc','Triiodothyronine.free','MCnc','Pt','Ser/Plas','Qn',ARRAY['pmol/L'],ARRAY['free t3']),
  ('2857-1','Prostate specific Ag [Mass/volume] in Serum or Plasma','PSA SerPl-mCnc','Prostate specific Ag','MCnc','Pt','Ser/Plas','Qn',ARRAY['ug/L','ng/mL'],ARRAY['psa','prostate specific antigen']),
  ('1988-5','C reactive protein [Mass/volume] in Serum or Plasma','CRP SerPl-mCnc','C reactive protein','MCnc','Pt','Ser/Plas','Qn',ARRAY['mg/L'],ARRAY['crp','c-reactive protein','c reactive protein']),
  ('2276-4','Ferritin [Mass/volume] in Serum or Plasma','Ferritin SerPl-mCnc','Ferritin','MCnc','Pt','Ser/Plas','Qn',ARRAY['ug/L','ng/mL'],ARRAY['ferritin']),
  ('2498-4','Iron [Mass/volume] in Serum or Plasma','Iron SerPl-mCnc','Iron','MCnc','Pt','Ser/Plas','Qn',ARRAY['umol/L'],ARRAY['iron']),
  ('2132-9','Cobalamin (Vitamin B12) [Mass/volume] in Serum or Plasma','B12 SerPl-mCnc','Cobalamin','MCnc','Pt','Ser/Plas','Qn',ARRAY['pmol/L','pg/mL'],ARRAY['vitamin b12','b12']),
  ('2284-8','Folate [Mass/volume] in Serum or Plasma','Folate SerPl-mCnc','Folate','MCnc','Pt','Ser/Plas','Qn',ARRAY['nmol/L'],ARRAY['folate']),
  ('1989-3','25-hydroxyvitamin D3 [Mass/volume] in Serum or Plasma','25(OH)D3 SerPl-mCnc','Calcifediol','MCnc','Pt','Ser/Plas','Qn',ARRAY['nmol/L'],ARRAY['vitamin d','vitamin d (25 oh)','25-hydroxyvitamin d']),
  ('2951-2','Sodium [Moles/volume] in Serum or Plasma','Sodium SerPl-sCnc','Sodium','SCnc','Pt','Ser/Plas','Qn',ARRAY['mmol/L'],ARRAY['sodium']),
  ('2823-3','Potassium [Moles/volume] in Serum or Plasma','Potassium SerPl-sCnc','Potassium','SCnc','Pt','Ser/Plas','Qn',ARRAY['mmol/L'],ARRAY['potassium']),
  ('2075-0','Chloride [Moles/volume] in Serum or Plasma','Chloride SerPl-sCnc','Chloride','SCnc','Pt','Ser/Plas','Qn',ARRAY['mmol/L'],ARRAY['chloride']),
  ('17861-6','Calcium [Mass/volume] in Serum or Plasma','Calcium SerPl-mCnc','Calcium','MCnc','Pt','Ser/Plas','Qn',ARRAY['mmol/L'],ARRAY['calcium']),
  ('2777-1','Phosphate [Mass/volume] in Serum or Plasma','Phos SerPl-mCnc','Phosphate','MCnc','Pt','Ser/Plas','Qn',ARRAY['mmol/L'],ARRAY['phosphate','phosphorus']),
  ('2601-3','Magnesium [Moles/volume] in Serum or Plasma','Magnesium SerPl-sCnc','Magnesium','SCnc','Pt','Ser/Plas','Qn',ARRAY['mmol/L'],ARRAY['magnesium']),
  ('3084-1','Urate [Mass/volume] in Serum or Plasma','Urate SerPl-mCnc','Urate','MCnc','Pt','Ser/Plas','Qn',ARRAY['umol/L'],ARRAY['uric acid','urate']),
  ('2986-8','Testosterone [Mass/volume] in Serum or Plasma','Testosterone SerPl-mCnc','Testosterone','MCnc','Pt','Ser/Plas','Qn',ARRAY['nmol/L'],ARRAY['testosterone','total testosterone']),
  ('2243-4','Estradiol (E2) [Mass/volume] in Serum or Plasma','Estradiol SerPl-mCnc','Estradiol','MCnc','Pt','Ser/Plas','Qn',ARRAY['pmol/L'],ARRAY['oestradiol','estradiol']),
  ('2839-9','Progesterone [Mass/volume] in Serum or Plasma','Progest SerPl-mCnc','Progesterone','MCnc','Pt','Ser/Plas','Qn',ARRAY['nmol/L'],ARRAY['progesterone']),
  ('15067-2','Follitropin [Units/volume] in Serum or Plasma','FSH SerPl-aCnc','Follitropin','ACnc','Pt','Ser/Plas','Qn',ARRAY['IU/L'],ARRAY['fsh','follicle stimulating hormone']),
  ('10501-5','Lutropin [Units/volume] in Serum or Plasma','LH SerPl-aCnc','Lutropin','ACnc','Pt','Ser/Plas','Qn',ARRAY['IU/L'],ARRAY['lh','luteinising hormone','luteinizing hormone']),
  ('2842-3','Prolactin [Mass/volume] in Serum or Plasma','Prolactin SerPl-mCnc','Prolactin','MCnc','Pt','Ser/Plas','Qn',ARRAY['mIU/L'],ARRAY['prolactin']),
  ('13967-5','Sex hormone binding globulin [Moles/volume] in Serum or Plasma','SHBG SerPl-sCnc','Sex hormone binding globulin','SCnc','Pt','Ser/Plas','Qn',ARRAY['nmol/L'],ARRAY['shbg','sex hormone binding globulin']),
  ('2191-5','Dehydroepiandrosterone sulfate [Mass/volume] in Serum or Plasma','DHEA-S SerPl-mCnc','Dehydroepiandrosterone sulfate','MCnc','Pt','Ser/Plas','Qn',ARRAY['umol/L'],ARRAY['dhea sulphate','dhea-s','dheas']),
  ('2143-6','Cortisol [Mass/volume] in Serum or Plasma','Cortisol SerPl-mCnc','Cortisol','MCnc','Pt','Ser/Plas','Qn',ARRAY['nmol/L'],ARRAY['cortisol']),
  ('30341-2','Erythrocyte sedimentation rate','ESR','Erythrocyte sedimentation rate','Vel','Pt','Bld','Qn',ARRAY['mm/h'],ARRAY['esr','erythrocyte sedimentation rate'])
)
INSERT INTO public.clinical_loinc_mappings (
  loinc_code, long_name, short_name, component, property, time_aspect, system,
  scale_type, common_units, biomarker_id, biomarker_code, is_active, is_primary,
  verification_status, code_source, notes
)
SELECT
  s.loinc_code, s.long_name, s.short_name, s.component, s.property, s.time_aspect,
  s.system, s.scale_type, s.common_units,
  h.id, h.biomarker_code, true, false,
  'unverified',
  'seeded candidate, not yet checked against an official LOINC release',
  'Matched to biomarker by name. Confirm the code, the specimen and the property against loinc.org before marking verified.'
FROM seed s
LEFT JOIN LATERAL (
  SELECT bh.id, bh.biomarker_code
  FROM public.biomarker_hub bh
  WHERE bh.status <> 'duplicate'
    AND lower(trim(bh.name)) = ANY(s.match_names)
  ORDER BY array_position(s.match_names, lower(trim(bh.name)))
  LIMIT 1
) h ON true
ON CONFLICT (loinc_code) DO NOTHING;
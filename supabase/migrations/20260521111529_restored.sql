-- Restored verbatim from supabase_migrations.schema_migrations (version 20260521111529).
-- md5 of the recorded statements: 1fb7a1214fa04e900ab2f65cca481cae
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


-- Body system backfill via category
UPDATE public.biomarkers_library SET body_system = CASE
  WHEN category IN ('Liver Function') THEN 'hepatic'
  WHEN category IN ('Kidney Function','Electrolytes') THEN 'renal'
  WHEN category IN ('Thyroid','Hormones','Fertility') THEN 'endocrine'
  WHEN category IN ('Cardiac','Cardiovascular','Lipid Profile') THEN 'cardiovascular'
  WHEN category IN ('Haematology') THEN 'haematology'
  WHEN category IN ('Diabetes','Metabolic') THEN 'metabolic'
  WHEN category IN ('Vitamins','Vitamins & Minerals','Minerals') THEN 'nutritional'
  WHEN category IN ('Immunology') THEN 'immunological'
  WHEN category IN ('Cancer Screening','Cancer Markers') THEN 'oncological'
  WHEN category IN ('Bone Health') THEN 'musculoskeletal'
  ELSE 'other'
END
WHERE body_system IS NULL;

-- Default sample type to serum
UPDATE public.biomarkers_library SET biomaterial = 'serum' WHERE biomaterial IS NULL;

-- Overrides for urine markers
UPDATE public.biomarkers_library SET biomaterial = 'urine'
  WHERE biomarker_code IN ('UFC24','ACR','5HIAA');

-- Overrides for whole blood markers
UPDATE public.biomarkers_library SET biomaterial = 'whole_blood'
  WHERE biomarker_code IN ('COHB');

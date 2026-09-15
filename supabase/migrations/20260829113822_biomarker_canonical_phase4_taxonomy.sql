-- Phase 4. One vocabulary in two columns, held together by a mapping table.
-- The original `category` column is left exactly as it was, so nothing that
-- currently reads it changes behaviour.

CREATE TABLE IF NOT EXISTS public.biomarker_category_map (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinical_category text NOT NULL,
  consumer_category text NOT NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (clinical_category, consumer_category)
);

ALTER TABLE public.biomarker_category_map ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS biomarker_category_map_public_read ON public.biomarker_category_map;
CREATE POLICY biomarker_category_map_public_read
  ON public.biomarker_category_map FOR SELECT USING (true);

DROP POLICY IF EXISTS biomarker_category_map_admin_write ON public.biomarker_category_map;
CREATE POLICY biomarker_category_map_admin_write
  ON public.biomarker_category_map FOR ALL
  USING (has_role((SELECT auth.uid()), 'admin'::app_role));

COMMENT ON TABLE public.biomarker_category_map IS
  'Bridges the clinical taxonomy (snake_case, used by search and FHIR work) and the consumer taxonomy (Title Case, used on the site). Deliberately many-to-many: several clinical groups map to one consumer group and vice versa.';

INSERT INTO public.biomarker_category_map (clinical_category, consumer_category) VALUES
  ('allergy',            'Allergy & Immunology'),
  ('immunology',         'Autoimmune & Immunology'),
  ('autoimmune',         'Autoimmune & Immunology'),
  ('immunology',         'Inflammation'),
  ('endocrinology',      'Hormones'),
  ('endocrinology',      'Thyroid'),
  ('haematology',        'Haematology'),
  ('haematology',        'Full Blood Count'),
  ('haematology',        'Iron Status'),
  ('coagulation',        'Haematology'),
  ('cardiology',         'Cardiac Markers'),
  ('cardiology',         'Cardiac'),
  ('cardiology',         'Cardiovascular'),
  ('cardiology',         'Cholesterol & Heart'),
  ('cardiology',         'Lipid Profile'),
  ('oncology',           'Cancer Screening'),
  ('oncology',           'Cancer Markers'),
  ('renal',              'Kidney Function'),
  ('hepatology',         'Liver & Metabolic'),
  ('hepatology',         'Liver Function'),
  ('genetics',           'Genetics & Pharmacogenomics'),
  ('toxicology',         'Toxicology & Heavy Metals'),
  ('toxicology',         'Therapeutic Drug Monitoring'),
  ('reproductive',       'Reproductive Health'),
  ('reproductive',       'Fertility'),
  ('infectious_disease', 'Infectious Disease'),
  ('microbiology',       'Infectious Disease'),
  ('nutrition',          'Iron & Nutrients'),
  ('nutrition',          'Vitamins'),
  ('nutrition',          'Minerals'),
  ('nutrition',          'Vitamins & Minerals'),
  ('gastroenterology',   'Gut Health'),
  ('gastroenterology',   'Digestive Health'),
  ('gastroenterology',   'Digestive'),
  ('metabolic',          'Diabetes & Metabolic'),
  ('metabolic',          'Diabetes'),
  ('metabolic',          'Metabolic'),
  ('metabolic',          'Inborn Errors of Metabolism'),
  ('biochemistry',       'Bone Health'),
  ('biochemistry',       'Electrolytes'),
  ('biochemistry',       'Enzymes')
ON CONFLICT DO NOTHING;

-- rows whose legacy `category` is already the consumer vocabulary
UPDATE public.biomarker_hub h
SET category_consumer = h.category
WHERE h.category_consumer IS NULL
  AND h.category IS NOT NULL
  AND h.category <> lower(h.category);

-- derive the missing consumer category from the clinical one, first match wins
UPDATE public.biomarker_hub h
SET category_consumer = m.consumer_category
FROM (
  SELECT DISTINCT ON (clinical_category) clinical_category, consumer_category
  FROM public.biomarker_category_map
  ORDER BY clinical_category, consumer_category
) m
WHERE h.category_consumer IS NULL
  AND h.category_clinical = m.clinical_category;

-- derive the missing clinical category from the consumer one
UPDATE public.biomarker_hub h
SET category_clinical = m.clinical_category
FROM public.biomarker_category_map m
WHERE h.category_clinical IS NULL
  AND h.category_consumer = m.consumer_category;
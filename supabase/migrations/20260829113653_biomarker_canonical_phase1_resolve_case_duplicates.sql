-- The hub carried 18 pairs of rows that are the same biomarker under two
-- capitalisations (e.g. "oestradiol" and "Oestradiol"): one row from the
-- clinical import, one from the consumer editorial build. The richer row is
-- kept as canonical, the other keeps all of its data and is flagged as a
-- duplicate pointing at the canonical row. No row is deleted.

ALTER TABLE public.biomarker_hub
  ADD COLUMN IF NOT EXISTS canonical_id uuid REFERENCES public.biomarker_hub(id);

COMMENT ON COLUMN public.biomarker_hub.canonical_id IS
  'Set on rows with status = duplicate. Points at the canonical row for the same biomarker. The duplicate row is retained in full, never deleted.';

WITH ranked AS (
  SELECT id, lower(trim(name)) AS n,
         row_number() OVER (
           PARTITION BY lower(trim(name))
           ORDER BY (description_what IS NOT NULL) DESC,
                    (unit IS NOT NULL) DESC,
                    created_at DESC
         ) AS rn
  FROM public.biomarker_hub
  WHERE lower(trim(name)) IN (
    SELECT lower(trim(name)) FROM public.biomarker_hub GROUP BY 1 HAVING count(*) > 1
  )
),
keeper    AS (SELECT id, n FROM ranked WHERE rn = 1),
duplicate AS (SELECT id, n FROM ranked WHERE rn > 1)

-- 1. lift anything the duplicate holds that the keeper lacks
UPDATE public.biomarker_hub k
SET
  symptoms_linked      = COALESCE(k.symptoms_linked, d.symptoms_linked),
  category_clinical    = COALESCE(k.category_clinical, d.category_clinical),
  clinical_description = COALESCE(k.clinical_description, d.clinical_description),
  legacy_description   = COALESCE(k.legacy_description, d.legacy_description),
  biomarker_code       = COALESCE(k.biomarker_code, d.biomarker_code),
  unit                 = COALESCE(k.unit, d.unit),
  reference_ranges     = COALESCE(k.reference_ranges, d.reference_ranges),
  clinical_significance = COALESCE(k.clinical_significance, d.clinical_significance),
  interpretation_guide = COALESCE(k.interpretation_guide, d.interpretation_guide),
  normal_range_male    = COALESCE(k.normal_range_male, d.normal_range_male),
  normal_range_female  = COALESCE(k.normal_range_female, d.normal_range_female),
  alternate_units      = COALESCE(k.alternate_units, d.alternate_units),
  related_conditions   = COALESCE(k.related_conditions, d.related_conditions),
  lifestyle_factors    = COALESCE(k.lifestyle_factors, d.lifestyle_factors),
  synonyms             = COALESCE(k.synonyms, d.synonyms),
  biomaterial          = COALESCE(k.biomaterial, d.biomaterial),
  body_system          = COALESCE(k.body_system, d.body_system),
  what_it_measures     = COALESCE(k.what_it_measures, d.what_it_measures),
  why_it_matters       = COALESCE(k.why_it_matters, d.why_it_matters),
  what_affects_it      = COALESCE(k.what_affects_it, d.what_affects_it),
  when_to_retest       = COALESCE(k.when_to_retest, d.when_to_retest),
  clinical_tips        = COALESCE(k.clinical_tips, d.clinical_tips),
  related_tests        = COALESCE(k.related_tests, d.related_tests),
  abbreviation         = COALESCE(k.abbreviation, d.abbreviation),
  icon                 = COALESCE(k.icon, d.icon),
  legacy_codes         = (SELECT ARRAY(SELECT DISTINCT unnest(k.legacy_codes || d.legacy_codes))),
  source_systems       = (SELECT ARRAY(SELECT DISTINCT unnest(k.source_systems || d.source_systems))),
  last_updated         = now()
FROM keeper kp
JOIN duplicate dp ON dp.n = kp.n
JOIN public.biomarker_hub d ON d.id = dp.id
WHERE k.id = kp.id;
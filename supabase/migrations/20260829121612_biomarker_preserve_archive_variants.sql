-- Before the archives go, sweep every value they hold that is not already
-- represented on the canonical row into a provenance column. These are
-- almost all the losing side of a duplicate pair: a second, differently
-- worded description or reference range for the same biomarker. Keeping
-- them means the archives can be dropped with genuinely nothing lost.

ALTER TABLE public.biomarker_hub
  ADD COLUMN IF NOT EXISTS variant_content jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.biomarker_hub.variant_content IS
  'Superseded alternate values carried over from biomarkers_library_archive and biomarker_knowledge_hub_archive before those tables were dropped. Keyed by source and field. Reference material for editorial review, not for display.';

-- library variants
WITH v AS (
  SELECT h.id AS hub_id,
         jsonb_strip_nulls(jsonb_build_object(
           'library_description',
             CASE WHEN l.description IS NOT NULL
                   AND h.legacy_description IS DISTINCT FROM l.description
                   AND h.clinical_description IS DISTINCT FROM l.description
                   AND h.description_what IS DISTINCT FROM l.description
                  THEN to_jsonb(l.description) END,
           'library_clinical_significance',
             CASE WHEN l.clinical_significance IS NOT NULL
                   AND h.clinical_significance IS DISTINCT FROM l.clinical_significance
                  THEN to_jsonb(l.clinical_significance) END,
           'library_related_conditions',
             CASE WHEN l.related_conditions IS NOT NULL
                   AND h.related_conditions IS DISTINCT FROM l.related_conditions
                  THEN to_jsonb(l.related_conditions) END,
           'library_lifestyle_factors',
             CASE WHEN l.lifestyle_factors IS NOT NULL
                   AND h.lifestyle_factors IS DISTINCT FROM l.lifestyle_factors
                  THEN to_jsonb(l.lifestyle_factors) END,
           'library_reference_ranges',
             CASE WHEN l.reference_ranges IS NOT NULL
                   AND h.reference_ranges IS DISTINCT FROM l.reference_ranges
                  THEN l.reference_ranges END,
           'library_interpretation_guide',
             CASE WHEN l.interpretation_guide IS NOT NULL
                   AND h.interpretation_guide IS DISTINCT FROM l.interpretation_guide
                  THEN l.interpretation_guide END,
           'library_unit',
             CASE WHEN l.unit_of_measurement IS NOT NULL
                   AND h.unit IS DISTINCT FROM l.unit_of_measurement
                  THEN to_jsonb(l.unit_of_measurement) END,
           'library_category',
             CASE WHEN l.category IS NOT NULL
                   AND h.category_consumer IS DISTINCT FROM l.category
                  THEN to_jsonb(l.category) END,
           'library_source_id', to_jsonb(l.id::text),
           'library_source_code', to_jsonb(l.biomarker_code)
         )) AS payload
  FROM public.biomarkers_library_archive l
  JOIN public.biomarker_hub h ON lower(trim(h.name)) = lower(trim(l.biomarker_name))
)
UPDATE public.biomarker_hub h
SET variant_content = h.variant_content || v.payload
FROM v
WHERE h.id = v.hub_id
  AND v.payload - 'library_source_id' - 'library_source_code' <> '{}'::jsonb;

-- knowledge hub variants
WITH v AS (
  SELECT h.id AS hub_id,
         jsonb_strip_nulls(jsonb_build_object(
           'knowledge_related_symptoms',
             CASE WHEN k.related_symptoms IS NOT NULL
                   AND array_length(k.related_symptoms,1) > 0
                   AND h.symptoms_linked IS DISTINCT FROM k.related_symptoms
                  THEN to_jsonb(k.related_symptoms) END,
           'knowledge_clinical_description',
             CASE WHEN k.clinical_description IS NOT NULL
                   AND h.clinical_description IS DISTINCT FROM k.clinical_description
                   AND h.legacy_description IS DISTINCT FROM k.clinical_description
                  THEN to_jsonb(k.clinical_description) END,
           'knowledge_source_id', to_jsonb(k.id::text)
         )) AS payload
  FROM public.biomarker_knowledge_hub_archive k
  JOIN public.biomarker_hub h ON lower(trim(h.name)) = lower(trim(k.name))
)
UPDATE public.biomarker_hub h
SET variant_content = h.variant_content || v.payload
FROM v
WHERE h.id = v.hub_id
  AND v.payload - 'knowledge_source_id' <> '{}'::jsonb;
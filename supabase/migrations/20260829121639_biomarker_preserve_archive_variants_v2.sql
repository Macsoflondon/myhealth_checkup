-- Two library rows can map to one canonical row, so a flat key/value shape
-- loses the second. Rebuild the library side as an array, one entry per
-- source row, so every duplicate is kept.

UPDATE public.biomarker_hub
SET variant_content = variant_content
      - 'library_description' - 'library_clinical_significance'
      - 'library_related_conditions' - 'library_lifestyle_factors'
      - 'library_reference_ranges' - 'library_interpretation_guide'
      - 'library_unit' - 'library_category'
      - 'library_source_id' - 'library_source_code'
WHERE variant_content <> '{}'::jsonb;

WITH per_row AS (
  SELECT h.id AS hub_id,
         jsonb_strip_nulls(jsonb_build_object(
           'source_row_id',   l.id::text,
           'source_code',     l.biomarker_code,
           'description',
             CASE WHEN l.description IS NOT NULL
                   AND h.legacy_description IS DISTINCT FROM l.description
                   AND h.clinical_description IS DISTINCT FROM l.description
                   AND h.description_what IS DISTINCT FROM l.description
                  THEN to_jsonb(l.description) END,
           'clinical_significance',
             CASE WHEN l.clinical_significance IS NOT NULL
                   AND h.clinical_significance IS DISTINCT FROM l.clinical_significance
                  THEN to_jsonb(l.clinical_significance) END,
           'related_conditions',
             CASE WHEN l.related_conditions IS NOT NULL
                   AND h.related_conditions IS DISTINCT FROM l.related_conditions
                  THEN to_jsonb(l.related_conditions) END,
           'lifestyle_factors',
             CASE WHEN l.lifestyle_factors IS NOT NULL
                   AND h.lifestyle_factors IS DISTINCT FROM l.lifestyle_factors
                  THEN to_jsonb(l.lifestyle_factors) END,
           'reference_ranges',
             CASE WHEN l.reference_ranges IS NOT NULL
                   AND h.reference_ranges IS DISTINCT FROM l.reference_ranges
                  THEN l.reference_ranges END,
           'interpretation_guide',
             CASE WHEN l.interpretation_guide IS NOT NULL
                   AND h.interpretation_guide IS DISTINCT FROM l.interpretation_guide
                  THEN l.interpretation_guide END,
           'unit_of_measurement',
             CASE WHEN l.unit_of_measurement IS NOT NULL
                   AND h.unit IS DISTINCT FROM l.unit_of_measurement
                  THEN to_jsonb(l.unit_of_measurement) END,
           'category',
             CASE WHEN l.category IS NOT NULL
                   AND h.category_consumer IS DISTINCT FROM l.category
                  THEN to_jsonb(l.category) END
         )) AS entry
  FROM public.biomarkers_library_archive l
  JOIN public.biomarker_hub h ON lower(trim(h.name)) = lower(trim(l.biomarker_name))
),
kept AS (
  SELECT hub_id, jsonb_agg(entry) AS entries
  FROM per_row
  WHERE entry - 'source_row_id' - 'source_code' <> '{}'::jsonb
  GROUP BY hub_id
)
UPDATE public.biomarker_hub h
SET variant_content = h.variant_content || jsonb_build_object('library_variants', k.entries)
FROM kept k
WHERE h.id = k.hub_id;
-- Insert the biomarkers that exist only in biomarkers_library and have no
-- row in biomarker_hub. Same duplicate-collapsing rule as the matched
-- backfill. Nothing is removed from biomarkers_library.

WITH ranked AS (
  SELECT *,
         row_number() OVER (
           PARTITION BY lower(trim(biomarker_name))
           ORDER BY created_at DESC, length(coalesce(description,'')) DESC
         ) AS rn
  FROM public.biomarkers_library
),
merged AS (
  SELECT
    a.biomarker_name,
    a.biomarker_code,
    b.biomarker_code                                                AS superseded_code,
    COALESCE(NULLIF(a.description,''), b.description)               AS description,
    COALESCE(a.category, b.category)                                AS category,
    COALESCE(a.clinical_significance, b.clinical_significance)      AS clinical_significance,
    COALESCE(a.normal_range_male, b.normal_range_male)              AS normal_range_male,
    COALESCE(a.normal_range_female, b.normal_range_female)          AS normal_range_female,
    COALESCE(a.unit_of_measurement, b.unit_of_measurement)          AS unit_of_measurement,
    COALESCE(a.interpretation_guide, b.interpretation_guide)        AS interpretation_guide,
    COALESCE(a.related_conditions, b.related_conditions)            AS related_conditions,
    COALESCE(a.lifestyle_factors, b.lifestyle_factors)              AS lifestyle_factors,
    COALESCE(a.synonyms, b.synonyms)                                AS synonyms,
    COALESCE(a.biomaterial, b.biomaterial)                          AS biomaterial,
    COALESCE(a.body_system, b.body_system)                          AS body_system,
    COALESCE(a.reference_ranges, b.reference_ranges)                AS reference_ranges,
    COALESCE(a.alternate_units, b.alternate_units)                  AS alternate_units,
    COALESCE(a.what_it_measures, b.what_it_measures)                AS what_it_measures,
    COALESCE(a.why_it_matters, b.why_it_matters)                    AS why_it_matters,
    COALESCE(a.what_affects_it, b.what_affects_it)                  AS what_affects_it,
    COALESCE(a.when_to_retest, b.when_to_retest)                    AS when_to_retest,
    COALESCE(a.related_articles, b.related_articles)                AS related_articles,
    COALESCE(a.last_reviewed_at, b.last_reviewed_at)                AS last_reviewed_at,
    COALESCE(a.reviewed_by, b.reviewed_by)                          AS reviewed_by
  FROM ranked a
  LEFT JOIN ranked b
    ON lower(trim(b.biomarker_name)) = lower(trim(a.biomarker_name))
   AND b.rn = 2
  WHERE a.rn = 1
)
INSERT INTO public.biomarker_hub (
  name, biomarker_code, legacy_codes, legacy_description, category, category_consumer,
  unit, reference_ranges, alternate_units, clinical_significance, interpretation_guide,
  normal_range_male, normal_range_female, related_conditions, lifestyle_factors,
  synonyms, biomaterial, body_system, what_it_measures, why_it_matters,
  what_affects_it, when_to_retest, related_articles, last_reviewed_at, reviewed_by,
  status, last_updated, source_systems
)
SELECT
  m.biomarker_name, m.biomarker_code,
  CASE WHEN m.superseded_code IS NOT NULL THEN ARRAY[m.superseded_code] ELSE '{}'::text[] END,
  m.description, m.category, m.category,
  m.unit_of_measurement, m.reference_ranges, m.alternate_units, m.clinical_significance,
  m.interpretation_guide, m.normal_range_male, m.normal_range_female,
  m.related_conditions, m.lifestyle_factors, m.synonyms, m.biomaterial, m.body_system,
  m.what_it_measures, m.why_it_matters, m.what_affects_it, m.when_to_retest,
  m.related_articles, m.last_reviewed_at, m.reviewed_by,
  'active', now(), ARRAY['biomarkers_library']
FROM merged m
WHERE NOT EXISTS (
  SELECT 1 FROM public.biomarker_hub h
  WHERE lower(trim(h.name)) = lower(trim(m.biomarker_name))
);
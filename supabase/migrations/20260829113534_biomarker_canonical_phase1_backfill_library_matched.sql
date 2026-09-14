-- Fold biomarkers_library into biomarker_hub for names that already exist.
-- The 15 duplicate library names are collapsed first: the newer April 2026
-- row (real descriptions, mnemonic codes) wins, the older October 2025 row
-- fills any gap it leaves, and its superseded code is kept in legacy_codes.
-- Existing hub values are never overwritten, only gaps are filled.

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
    lower(trim(a.biomarker_name))                                   AS join_name,
    a.biomarker_code                                                AS biomarker_code,
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
UPDATE public.biomarker_hub h
SET
  biomarker_code        = COALESCE(h.biomarker_code, m.biomarker_code),
  legacy_codes          = (SELECT ARRAY(SELECT DISTINCT unnest(
                             h.legacy_codes || CASE WHEN m.superseded_code IS NOT NULL
                                                    THEN ARRAY[m.superseded_code] ELSE '{}'::text[] END))),
  category_consumer     = COALESCE(h.category_consumer, m.category),
  clinical_significance = COALESCE(h.clinical_significance, m.clinical_significance),
  normal_range_male     = COALESCE(h.normal_range_male, m.normal_range_male),
  normal_range_female   = COALESCE(h.normal_range_female, m.normal_range_female),
  unit                  = COALESCE(h.unit, m.unit_of_measurement),
  interpretation_guide  = COALESCE(h.interpretation_guide, m.interpretation_guide),
  related_conditions    = COALESCE(h.related_conditions, m.related_conditions),
  lifestyle_factors     = COALESCE(h.lifestyle_factors, m.lifestyle_factors),
  synonyms              = COALESCE(h.synonyms, m.synonyms),
  biomaterial           = COALESCE(h.biomaterial, m.biomaterial),
  body_system           = COALESCE(h.body_system, m.body_system),
  reference_ranges      = COALESCE(h.reference_ranges, m.reference_ranges),
  alternate_units       = COALESCE(h.alternate_units, m.alternate_units),
  what_it_measures      = COALESCE(h.what_it_measures, m.what_it_measures),
  why_it_matters        = COALESCE(h.why_it_matters, m.why_it_matters),
  what_affects_it       = COALESCE(h.what_affects_it, m.what_affects_it),
  when_to_retest        = COALESCE(h.when_to_retest, m.when_to_retest),
  related_articles      = COALESCE(h.related_articles, m.related_articles),
  last_reviewed_at      = COALESCE(h.last_reviewed_at, m.last_reviewed_at),
  reviewed_by           = COALESCE(h.reviewed_by, m.reviewed_by),
  legacy_description    = COALESCE(h.legacy_description, m.description),
  last_updated          = now(),
  source_systems        = (SELECT ARRAY(SELECT DISTINCT unnest(h.source_systems || ARRAY['biomarkers_library'])))
FROM merged m
WHERE lower(trim(h.name)) = m.join_name;
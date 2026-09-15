-- Compatibility layer ahead of Phase 5. New code reads this view; the two
-- legacy tables stay live and untouched until the front end is confirmed
-- off them.

CREATE OR REPLACE VIEW public.biomarkers_canonical AS
SELECT
  h.id,
  h.biomarker_code,
  h.legacy_codes,
  h.name,
  h.abbreviation,
  h.synonyms,
  h.category_consumer,
  h.category_clinical,
  h.category                AS legacy_category,
  h.unit,
  h.alternate_units,
  h.biomaterial,
  h.body_system,
  COALESCE(h.description_what, h.what_it_measures)              AS what_it_measures,
  COALESCE(h.description_why, h.why_it_matters)                 AS why_it_matters,
  h.what_affects_it,
  h.when_to_retest,
  COALESCE(h.clinical_description, h.legacy_description)        AS clinical_description,
  h.clinical_significance,
  h.interpretation_guide,
  h.reference_ranges,
  h.normal_range_male,
  h.normal_range_female,
  h.related_conditions,
  h.lifestyle_factors,
  h.symptoms_linked,
  h.clinical_tips,
  h.related_tests,
  h.related_articles,
  h.loinc_code,
  h.snomed_code,
  h.icon,
  h.source_systems,
  h.last_reviewed_at,
  h.reviewed_by,
  h.last_updated,
  h.created_at
FROM public.biomarker_hub h
WHERE h.status <> 'duplicate';

COMMENT ON VIEW public.biomarkers_canonical IS
  'Read model over biomarker_hub. Duplicates excluded, consumer and clinical fields resolved. Point new front-end and edge-function queries here.';

GRANT SELECT ON public.biomarkers_canonical TO anon, authenticated;

COMMENT ON TABLE public.biomarker_knowledge_hub IS
  'DEPRECATED as of the biomarker consolidation. Fully folded into biomarker_hub (clinical_description, category_clinical, legacy_embedding). Retained read-only for verification. match_biomarkers no longer reads it. Do not write new rows here.';

COMMENT ON TABLE public.biomarkers_library IS
  'DEPRECATED as of the biomarker consolidation. Fully folded into biomarker_hub, including the 87 names it alone held and the deep editorial fields. Retained read-only for verification. Do not write new rows here.';
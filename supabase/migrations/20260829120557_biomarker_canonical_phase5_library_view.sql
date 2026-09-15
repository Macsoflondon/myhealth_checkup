-- Phase 5b. biomarkers_library has three readers, all reads, all relying on
-- the column names biomarker_name, biomarker_code, description, category
-- plus the structured columns via select(*). The view reproduces all 26
-- original columns under their original names, so none of them change.
-- The 205 original rows survive in biomarkers_library_archive.
--
-- Columns that were NOT NULL on the table are kept NOT NULL in effect via
-- COALESCE, so the generated TypeScript types stay accurate and no consumer
-- receives an unexpected null.

ALTER TABLE public.biomarkers_library RENAME TO biomarkers_library_archive;

COMMENT ON TABLE public.biomarkers_library_archive IS
  'Frozen pre-consolidation snapshot, retained for verification and rollback. Superseded by biomarker_hub on 29 Aug 2026. Do not read or write.';

CREATE VIEW public.biomarkers_library
WITH (security_invoker = on) AS
SELECT
  h.id,
  COALESCE(h.biomarker_code,
           upper(regexp_replace(h.name, '[^a-zA-Z0-9]+', '_', 'g')))  AS biomarker_code,
  h.name                                                              AS biomarker_name,
  COALESCE(h.category_consumer, h.category, 'Other')                  AS category,
  COALESCE(h.legacy_description, h.clinical_description, h.description_what, '') AS description,
  h.clinical_significance,
  h.normal_range_male,
  h.normal_range_female,
  h.unit                                                              AS unit_of_measurement,
  h.interpretation_guide,
  h.related_conditions,
  h.lifestyle_factors,
  h.created_at,
  h.last_updated                                                      AS updated_at,
  h.synonyms,
  h.biomaterial,
  h.body_system,
  h.reference_ranges,
  h.alternate_units,
  COALESCE(h.what_it_measures, h.description_what)                    AS what_it_measures,
  COALESCE(h.why_it_matters, h.description_why)                       AS why_it_matters,
  h.what_affects_it,
  h.when_to_retest,
  h.related_articles,
  h.last_reviewed_at,
  h.reviewed_by
FROM public.biomarker_hub h
WHERE h.status <> 'duplicate';

COMMENT ON VIEW public.biomarkers_library IS
  'Compatibility view over biomarker_hub, preserving the original column names. Now returns the full canonical set rather than the original 205 rows, so biomarker lookups on test detail pages resolve far more names. The underlying table is archived at biomarkers_library_archive.';

GRANT SELECT ON public.biomarkers_library TO anon, authenticated;
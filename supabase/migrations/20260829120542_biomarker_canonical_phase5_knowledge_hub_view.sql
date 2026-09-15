-- Phase 5a. biomarker_knowledge_hub has no reader anywhere in the codebase,
-- so it is retired first. The table itself is renamed, not dropped: all 866
-- rows survive in biomarker_knowledge_hub_archive, and the original name
-- becomes a read-only view over the canonical table with identical columns.

ALTER TABLE public.biomarker_knowledge_hub RENAME TO biomarker_knowledge_hub_archive;

COMMENT ON TABLE public.biomarker_knowledge_hub_archive IS
  'Frozen pre-consolidation snapshot, retained for verification and rollback. Superseded by biomarker_hub on 29 Aug 2026. Do not read or write.';

CREATE VIEW public.biomarker_knowledge_hub
WITH (security_invoker = on) AS
SELECT
  h.id,
  h.name,
  COALESCE(h.clinical_description, h.legacy_description, '')  AS clinical_description,
  h.embedding,
  h.snomed_code,
  COALESCE(h.category_clinical, h.category, 'other')           AS category,
  COALESCE(h.symptoms_linked, '{}'::text[])                    AS related_symptoms,
  h.created_at                                                 AS effective_date_time,
  h.last_updated,
  h.status,
  h.loinc_code,
  COALESCE(h.reference_ranges, '{}'::jsonb)                    AS reference_range_json,
  h.created_at
FROM public.biomarker_hub h
WHERE h.status <> 'duplicate';

COMMENT ON VIEW public.biomarker_knowledge_hub IS
  'Compatibility view over biomarker_hub, preserving the original column names. The underlying table is archived at biomarker_knowledge_hub_archive.';

GRANT SELECT ON public.biomarker_knowledge_hub TO anon, authenticated;
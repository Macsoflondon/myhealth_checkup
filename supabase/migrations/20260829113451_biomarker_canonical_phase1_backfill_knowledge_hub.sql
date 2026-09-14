-- Fold biomarker_knowledge_hub into biomarker_hub.
-- Every one of its 866 names already exists in the hub, so this is a column
-- fill, not an insert. legacy_description is never overwritten: the clinical
-- text lands in its own column, so both versions survive for review.

UPDATE public.biomarker_hub h
SET
  clinical_description = k.clinical_description,
  category_clinical    = COALESCE(h.category_clinical, k.category),
  snomed_code          = COALESCE(h.snomed_code, k.snomed_code),
  loinc_code           = COALESCE(h.loinc_code, k.loinc_code),
  status               = COALESCE(k.status, h.status),
  last_updated         = GREATEST(COALESCE(k.last_updated, k.created_at), COALESCE(h.created_at, now())),
  -- keep the knowledge-hub vector only where it genuinely differs
  legacy_embedding     = CASE
                           WHEN h.embedding IS NULL THEN NULL
                           WHEN k.embedding IS NOT NULL
                            AND k.embedding::text IS DISTINCT FROM h.embedding::text
                           THEN k.embedding
                           ELSE h.legacy_embedding
                         END,
  -- if the hub row had no vector at all, adopt the knowledge-hub one
  embedding            = COALESCE(h.embedding, k.embedding),
  source_systems       = (SELECT ARRAY(SELECT DISTINCT unnest(h.source_systems || ARRAY['biomarker_knowledge_hub'])))
FROM public.biomarker_knowledge_hub k
WHERE lower(trim(h.name)) = lower(trim(k.name));
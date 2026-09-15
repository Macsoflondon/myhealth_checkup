-- Phase 2. Repoint semantic search at the canonical table and index the
-- vector column. The function signature is unchanged, so every existing
-- caller keeps working without a code change.

CREATE INDEX IF NOT EXISTS idx_biomarker_hub_embedding_hnsw
  ON public.biomarker_hub
  USING hnsw (embedding extensions.vector_cosine_ops);

CREATE OR REPLACE FUNCTION public.match_biomarkers(
  query_embedding extensions.vector,
  match_threshold double precision DEFAULT 0.65,
  match_count integer DEFAULT 5
)
RETURNS TABLE(
  id uuid,
  name text,
  clinical_description text,
  snomed_code text,
  category text,
  related_symptoms text[],
  similarity double precision
)
LANGUAGE plpgsql
SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    bh.id,
    bh.name,
    COALESCE(bh.clinical_description, bh.legacy_description, bh.description_what) AS clinical_description,
    bh.snomed_code,
    COALESCE(bh.category_clinical, bh.category)          AS category,
    COALESCE(bh.symptoms_linked, '{}'::text[])           AS related_symptoms,
    1 - (bh.embedding <=> query_embedding)               AS similarity
  FROM public.biomarker_hub bh
  WHERE bh.embedding IS NOT NULL
    AND bh.status <> 'duplicate'
    AND 1 - (bh.embedding <=> query_embedding) > match_threshold
  ORDER BY bh.embedding <=> query_embedding
  LIMIT match_count;
END;
$function$;

COMMENT ON FUNCTION public.match_biomarkers IS
  'Semantic biomarker search over the canonical biomarker_hub table. Signature unchanged from the biomarker_knowledge_hub version so existing callers need no change.';
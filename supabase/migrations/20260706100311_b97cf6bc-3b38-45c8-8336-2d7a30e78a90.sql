CREATE OR REPLACE FUNCTION public.match_biomarkers(query_embedding extensions.vector, match_threshold double precision DEFAULT 0.65, match_count integer DEFAULT 5)
 RETURNS TABLE(id uuid, name text, clinical_description text, snomed_code text, category text, related_symptoms text[], similarity double precision)
 LANGUAGE plpgsql
 SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    bkh.id,
    bkh.name,
    bkh.clinical_description,
    bkh.snomed_code,
    bkh.category,
    bkh.related_symptoms,
    1 - (bkh.embedding <=> query_embedding) AS similarity
  FROM public.biomarker_knowledge_hub bkh
  WHERE bkh.embedding IS NOT NULL
    AND 1 - (bkh.embedding <=> query_embedding) > match_threshold
  ORDER BY bkh.embedding <=> query_embedding
  LIMIT match_count;
END;
$function$;
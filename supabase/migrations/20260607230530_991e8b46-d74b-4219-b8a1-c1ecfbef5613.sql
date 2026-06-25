
CREATE OR REPLACE FUNCTION public.get_biomarker_validation_issues()
RETURNS TABLE (
  id uuid,
  provider_id text,
  test_name text,
  category text,
  biomarker_count integer,
  biomarkers_list jsonb,
  url text,
  scraped_at timestamptz,
  updated_at timestamptz,
  issue text
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Admin role required';
  END IF;

  RETURN QUERY
  SELECT
    pt.id,
    pt.provider_id,
    pt.test_name,
    pt.category,
    pt.biomarker_count,
    pt.biomarkers_list,
    pt.url,
    pt.scraped_at,
    pt.updated_at,
    CASE
      WHEN pt.biomarkers_list IS NULL THEN 'missing_list'
      WHEN jsonb_typeof(pt.biomarkers_list) = 'array' AND jsonb_array_length(pt.biomarkers_list) = 0 THEN 'empty_list'
      WHEN jsonb_typeof(pt.biomarkers_list) = 'array'
           AND pt.biomarker_count IS NOT NULL
           AND jsonb_array_length(pt.biomarkers_list) <> pt.biomarker_count THEN 'count_mismatch'
      ELSE 'unknown'
    END AS issue
  FROM public.provider_tests pt
  WHERE pt.is_active = true
    AND COALESCE(pt.biomarker_count, 0) > 0
    AND (
      pt.biomarkers_list IS NULL
      OR (jsonb_typeof(pt.biomarkers_list) = 'array' AND jsonb_array_length(pt.biomarkers_list) = 0)
      OR (jsonb_typeof(pt.biomarkers_list) = 'array'
          AND jsonb_array_length(pt.biomarkers_list) <> pt.biomarker_count)
    )
  ORDER BY pt.provider_id, pt.test_name;
END;
$$;

REVOKE ALL ON FUNCTION public.get_biomarker_validation_issues() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_biomarker_validation_issues() TO authenticated, service_role;

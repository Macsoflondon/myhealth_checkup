-- 1. Biomarker validation report: drop SECURITY DEFINER (reads only publicly-readable provider_tests)
CREATE OR REPLACE FUNCTION public.get_biomarker_validation_issues()
 RETURNS TABLE(id uuid, provider_id text, test_name text, category text, biomarker_count integer, biomarkers_list jsonb, url text, scraped_at timestamp with time zone, updated_at timestamp with time zone, issue text)
 LANGUAGE plpgsql
 STABLE SECURITY INVOKER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  RETURN QUERY
  SELECT
    pt.id,
    pt.provider_id,
    pt.test_name,
    pt.category,
    pt.biomarker_count,
    CASE WHEN jsonb_typeof(pt.biomarkers_list) = 'array' THEN pt.biomarkers_list ELSE NULL END,
    pt.url,
    pt.scraped_at,
    pt.updated_at,
    CASE
      WHEN pt.biomarkers_list IS NULL THEN 'missing_list'
      WHEN jsonb_typeof(pt.biomarkers_list) <> 'array' THEN 'unknown'
      WHEN jsonb_array_length(pt.biomarkers_list) = 0 THEN 'empty_list'
      WHEN jsonb_array_length(pt.biomarkers_list) <> pt.biomarker_count THEN 'count_mismatch'
      ELSE 'unknown'
    END AS issue
  FROM public.provider_tests pt
  WHERE pt.is_active = true
    AND COALESCE(pt.biomarker_count, 0) > 0
    AND (
      pt.biomarkers_list IS NULL
      OR jsonb_typeof(pt.biomarkers_list) <> 'array'
      OR jsonb_array_length(pt.biomarkers_list) = 0
      OR jsonb_array_length(pt.biomarkers_list) <> pt.biomarker_count
    )
  ORDER BY pt.provider_id, pt.test_name;
END;
$function$;

REVOKE ALL ON FUNCTION public.get_biomarker_validation_issues() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_biomarker_validation_issues() TO authenticated;

-- 2. Backup codes helper must stay SECURITY DEFINER (writes hashes users must not control).
--    Lock the execute surface down to authenticated only; internal guards already require aal2.
REVOKE ALL ON FUNCTION public.regenerate_mfa_backup_codes() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.regenerate_mfa_backup_codes() TO authenticated;
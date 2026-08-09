DO $$
BEGIN
  IF to_regprocedure('public.call_edge_with_service_role(text, jsonb)') IS NOT NULL THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.call_edge_with_service_role(text, jsonb) FROM PUBLIC';
    EXECUTE 'REVOKE ALL ON FUNCTION public.call_edge_with_service_role(text, jsonb) FROM anon';
    EXECUTE 'REVOKE ALL ON FUNCTION public.call_edge_with_service_role(text, jsonb) FROM authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.call_edge_with_service_role(text, jsonb) TO postgres';
  END IF;
END $$;
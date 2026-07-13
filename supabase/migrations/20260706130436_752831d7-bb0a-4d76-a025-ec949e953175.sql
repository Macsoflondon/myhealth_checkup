DO $$
BEGIN
  REVOKE EXECUTE ON FUNCTION public.call_edge_with_service_role(text, jsonb) FROM authenticated;
EXCEPTION WHEN undefined_function OR undefined_object THEN NULL;
END $$;

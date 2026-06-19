REVOKE EXECUTE ON FUNCTION public.cleanup_csp_reports() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_csp_reports() TO service_role;
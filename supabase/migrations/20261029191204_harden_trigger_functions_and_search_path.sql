-- Trigger functions must never be callable through the REST RPC endpoint.
-- Postgres checks EXECUTE only when a trigger is created, so existing
-- triggers keep firing after this revoke.
REVOKE EXECUTE ON FUNCTION public.block_excluded_provider_tests() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.block_excluded_provider_tests() TO service_role;
REVOKE EXECUTE ON FUNCTION public.strip_biomarker_junk() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.strip_biomarker_junk() TO service_role;

-- Pin the search path. The body uses only built-in pg_catalog functions.
ALTER FUNCTION public.provider_test_product_path(text) SET search_path = '';
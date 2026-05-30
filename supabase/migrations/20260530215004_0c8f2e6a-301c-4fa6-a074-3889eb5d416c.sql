
REVOKE EXECUTE ON FUNCTION public.sanitize_popular_provider_tests() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sanitize_popular_provider_tests() TO postgres, service_role;

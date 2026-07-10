
ALTER FUNCTION public.category_text_to_canonical(text) SECURITY INVOKER;
REVOKE ALL ON FUNCTION public.category_text_to_canonical(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.category_text_to_canonical(text) TO service_role;

REVOKE ALL ON FUNCTION public.provider_tests_autoset_canonical() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.provider_tests_autoset_canonical() TO service_role;

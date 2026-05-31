REVOKE EXECUTE ON FUNCTION public.resolve_canonical_category(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_canonical_category(TEXT, TEXT) TO service_role;
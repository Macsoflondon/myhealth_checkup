-- The view must enforce the querying user's RLS, not the creator's.
ALTER VIEW public.biomarkers_canonical SET (security_invoker = on);

-- The terminology sync function is a trigger helper and must not be
-- callable over the REST API.
REVOKE EXECUTE ON FUNCTION public.sync_primary_terminology_code() FROM PUBLIC, anon, authenticated;
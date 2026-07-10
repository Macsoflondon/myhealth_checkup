-- Restrict public exposure of admin-only columns on test_categories
REVOKE SELECT ON public.test_categories FROM anon, authenticated;

GRANT SELECT (id, name, provider_id, display_order, created_at, last_price_update)
  ON public.test_categories TO anon, authenticated;

-- service_role retains full access for admin/edge-function operations
GRANT ALL ON public.test_categories TO service_role;
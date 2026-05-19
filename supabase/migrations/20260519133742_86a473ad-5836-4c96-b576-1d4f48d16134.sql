-- Remove sensitive columns from realtime publication if present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'test_categories'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.test_categories';
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.test_categories (id, name, provider_id, display_order, created_at, last_price_update)';
  END IF;
END $$;

-- Revoke column-level SELECT on internal operational fields from public roles
REVOKE SELECT (price_check_frequency_hours, realtime_enabled) ON public.test_categories FROM anon, authenticated, PUBLIC;

-- Re-grant SELECT on the safe columns explicitly so PostgREST can still read them
GRANT SELECT (id, name, provider_id, display_order, created_at, last_price_update)
  ON public.test_categories TO anon, authenticated;

-- Service role: full access to everything
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' LOOP
    EXECUTE format('GRANT ALL ON public.%I TO service_role', r.table_name);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', r.table_name);
  END LOOP;
END $$;

-- Public catalogue tables: allow anon SELECT (RLS still applies)
GRANT SELECT ON public.provider_tests TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.category_aliases TO anon, authenticated;
GRANT SELECT ON public.category_test_mapping TO anon, authenticated;
GRANT SELECT ON public.test_categories TO anon, authenticated;
GRANT SELECT ON public.tests_master TO anon, authenticated;
GRANT SELECT ON public.biomarkers_library TO anon, authenticated;
GRANT SELECT ON public.provider_biomarker_products TO anon, authenticated;
GRANT SELECT ON public.provider_test_mapping TO anon, authenticated;
GRANT SELECT ON public.provider_section_category_map TO anon, authenticated;
GRANT SELECT ON public.live_comparison_panels TO anon, authenticated;
GRANT SELECT ON public.lola_health_products TO anon, authenticated;
GRANT SELECT ON public.price_history TO anon, authenticated;
GRANT SELECT ON public.popular_test_enrichment_cache TO anon, authenticated;

-- Sequences (for inserts on authenticated tables)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;

-- Views (if any in public): restore default exposure
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT table_name FROM information_schema.views WHERE table_schema='public' LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated', r.table_name);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', r.table_name);
  END LOOP;
END $$;

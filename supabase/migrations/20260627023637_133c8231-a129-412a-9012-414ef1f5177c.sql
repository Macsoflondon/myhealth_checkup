DO $$
DECLARE
    tbl record;
    has_priv boolean;
BEGIN
    FOR tbl IN
        SELECT c.relname AS table_name
          FROM pg_class c
          JOIN pg_namespace n ON n.oid = c.relnamespace
         WHERE c.relkind = 'r' AND n.nspname = 'public'
    LOOP
        SELECT EXISTS (
            SELECT 1 FROM information_schema.role_table_grants
             WHERE grantee='authenticated' AND table_schema='public' AND table_name=tbl.table_name
               AND privilege_type IN ('SELECT','INSERT','UPDATE','DELETE')
        ) INTO has_priv;
        IF NOT has_priv THEN
            EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', tbl.table_name);
        END IF;

        SELECT EXISTS (
            SELECT 1 FROM information_schema.role_table_grants
             WHERE grantee='service_role' AND table_schema='public' AND table_name=tbl.table_name
               AND privilege_type IN ('SELECT','INSERT','UPDATE','DELETE')
        ) INTO has_priv;
        IF NOT has_priv THEN
            EXECUTE format('GRANT ALL ON public.%I TO service_role', tbl.table_name);
        END IF;
    END LOOP;
END;
$$;

-- Anon SELECT on tables with permissive public-read RLS policies
GRANT SELECT ON public.provider_tests              TO anon;
GRANT SELECT ON public.tests_master                TO anon;
GRANT SELECT ON public.provider_test_mapping       TO anon;
GRANT SELECT ON public.categories                  TO anon;
GRANT SELECT ON public.category_aliases            TO anon;
GRANT SELECT ON public.category_test_mapping       TO anon;
GRANT SELECT ON public.test_categories             TO anon;
GRANT SELECT ON public.provider_section_category_map TO anon;
GRANT SELECT ON public.biomarkers_library          TO anon;
GRANT SELECT ON public.provider_biomarker_products TO anon;
GRANT SELECT ON public.lola_health_products        TO anon;
GRANT SELECT ON public.live_comparison_panels      TO anon;
GRANT SELECT ON public.price_history               TO anon;
GRANT SELECT ON public.popular_test_enrichment_cache TO anon;

-- Sequences (autoincrement ids) — keep usage open to API roles
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
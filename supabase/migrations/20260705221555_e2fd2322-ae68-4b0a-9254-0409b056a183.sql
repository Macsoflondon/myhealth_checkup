
-- 1. Fix search_path + revoke execute on cleanup_expired_recommendations
-- Function is created out-of-band on production; guard for preview environments.
DO $$ BEGIN
  ALTER FUNCTION public.cleanup_expired_recommendations() SET search_path = public;
  REVOKE EXECUTE ON FUNCTION public.cleanup_expired_recommendations() FROM PUBLIC, anon, authenticated;
EXCEPTION WHEN undefined_function OR undefined_object THEN NULL;
END $$;

-- 2. Convert match_biomarkers to SECURITY INVOKER (removes DEFINER exec finding)
-- Function and its source table are created out-of-band; guard for preview environments.
DO $$ BEGIN
  ALTER FUNCTION public.match_biomarkers(extensions.vector, double precision, integer) SECURITY INVOKER;
EXCEPTION WHEN undefined_function OR undefined_object THEN NULL;
END $$;
-- Ensure authenticated can still read the source table it queries
DO $$ BEGIN
  GRANT SELECT ON public.biomarker_knowledge_hub TO authenticated;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- 3. Drop redundant service_role "always true" policies (service_role bypasses RLS anyway)
-- Tables with migrations — safe to drop without guards:
DROP POLICY IF EXISTS "Price updates: service_role can delete" ON public.price_updates;
DROP POLICY IF EXISTS "Price updates: service_role can insert" ON public.price_updates;
DROP POLICY IF EXISTS "Price updates: service_role can update" ON public.price_updates;
DROP POLICY IF EXISTS "Service role can insert notification history" ON public.notification_history;
DROP POLICY IF EXISTS "Service role can insert subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Service role can update subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Service role can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role manages encryption keys" ON public.encryption_keys;
DROP POLICY IF EXISTS "Service role manages SIEM cursor" ON public.siem_export_cursor;
DROP POLICY IF EXISTS "Service role manages translations" ON public.translations_cache;
DROP POLICY IF EXISTS "service role only" ON public.popular_test_enrichment_cache;

-- Out-of-band tables: guard each against undefined_table in preview environments.
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_ai_logs" ON public.ai_operation_logs; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_funnel" ON public.funnel_events; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_events" ON public.user_events; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_platform_met" ON public.platform_metrics; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_admin_log" ON public.admin_activity_log; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_edge_logs" ON public.edge_function_logs; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_alerts" ON public.operational_alerts; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_prod_change" ON public.product_change_log; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_prod_scores" ON public.product_scores; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_prov_metrics" ON public.provider_metrics; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_revenue" ON public.revenue_events; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_scrape_chg" ON public.scrape_change_events; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_scrape_ops" ON public.scrape_operations; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_seo_issues" ON public.seo_crawl_issues; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_seo_kw" ON public.seo_keyword_rankings; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_seo_metrics" ON public.seo_page_metrics; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "svc_insert_sessions" ON public.user_sessions; EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- 4. Tighten the public-role recommendation_history insert to owner-only
DO $$ BEGIN
  DROP POLICY IF EXISTS "recommendation_history_insert" ON public.recommendation_history;
  CREATE POLICY "recommendation_history_insert_own"
    ON public.recommendation_history
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid()::text = user_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

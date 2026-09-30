-- MCP server upgrade (src/lib/mcp). Additive and reversible.
-- Run manually against the external Supabase project, then move this file
-- into supabase/migrations/ so the parity check stays green.
-- 1. favorites: remove duplicates (keep oldest) and enforce one row per user/test.
-- 2. Denied-call audit logging helper.
-- 3. Aggregation functions so MCP tools never depend on the PostgREST row cap.
-- Catalogue functions are SECURITY INVOKER so existing RLS still applies.
-- Admin functions additionally check has_role(auth.uid(), 'admin').

-- 1. favorites uniqueness ----------------------------------------------------
DELETE FROM public.favorites f
USING public.favorites g
WHERE f.user_id = g.user_id
  AND f.test_id = g.test_id
  AND (f.created_at, f.id) > (g.created_at, g.id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'favorites_user_id_test_id_key'
      AND conrelid = 'public.favorites'::regclass
  ) THEN
    ALTER TABLE public.favorites
      ADD CONSTRAINT favorites_user_id_test_id_key UNIQUE (user_id, test_id);
  END IF;
END $$;

-- 2. Denied MCP call logging (callers are not admins, so RLS would block them)
CREATE OR REPLACE FUNCTION public.mcp_log_denied_tool_call(p_tool text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;
  INSERT INTO public.admin_activity_log
    (admin_user_id, action, resource_type, resource_name, new_value, success, error_message)
  VALUES
    (auth.uid(), 'mcp.denied', 'mcp_tool', left(coalesce(p_tool, 'unknown'), 100),
     jsonb_build_object('via', 'mcp'), false, 'Caller lacks admin role');
END;
$$;
REVOKE ALL ON FUNCTION public.mcp_log_denied_tool_call(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mcp_log_denied_tool_call(text) TO authenticated;

-- 3a. Public: providers with accreditation flags and exact counts
CREATE OR REPLACE FUNCTION public.mcp_list_providers()
RETURNS TABLE (
  provider_id text, provider_name text, test_count bigint,
  lab_ukas_accredited boolean, lab_cqc_regulated boolean, lab_iso15189 boolean,
  latest_updated_at timestamptz
)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$
  SELECT u.provider_id, max(u.provider_name), count(*)::bigint,
         bool_and(u.lab_ukas_accredited), bool_and(u.lab_cqc_regulated),
         bool_and(u.lab_iso15189), max(u.updated_at)
  FROM public.unified_provider_tests u
  WHERE coalesce(u.is_addon, false) = false
  GROUP BY u.provider_id
$$;
GRANT EXECUTE ON FUNCTION public.mcp_list_providers() TO anon, authenticated;

-- 3b. Public: single provider profile
CREATE OR REPLACE FUNCTION public.mcp_get_provider(p_provider_id text)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$
  WITH t AS (
    SELECT * FROM public.unified_provider_tests
    WHERE provider_id = p_provider_id AND coalesce(is_addon, false) = false
  )
  SELECT CASE WHEN (SELECT count(*) FROM t) = 0 THEN NULL ELSE jsonb_build_object(
    'provider_id', p_provider_id,
    'provider_name', (SELECT max(provider_name) FROM t),
    'lab_ukas_accredited', (SELECT bool_and(lab_ukas_accredited) FROM t),
    'lab_cqc_regulated', (SELECT bool_and(lab_cqc_regulated) FROM t),
    'lab_iso15189', (SELECT bool_and(lab_iso15189) FROM t),
    'active_tests', (SELECT count(*) FROM t),
    'home_kit_tests', (SELECT count(*) FROM t WHERE home_kit_available IS TRUE),
    'clinic_visit_tests', (SELECT count(*) FROM t WHERE clinic_visit_available IS TRUE),
    'location_options', (
      SELECT coalesce(jsonb_agg(DISTINCT o), '[]'::jsonb)
      FROM t, jsonb_array_elements_text(
        CASE WHEN jsonb_typeof(t.location_options) = 'array' THEN t.location_options ELSE '[]'::jsonb END
      ) o
    ),
    'collection_fee_types', (
      SELECT coalesce(jsonb_agg(DISTINCT collection_fee_type), '[]'::jsonb)
      FROM t WHERE collection_fee_type IS NOT NULL
    ),
    'typical_phlebotomy_fee_gbp', (
      SELECT round(percentile_cont(0.5) WITHIN GROUP (ORDER BY collection_fee_amount)::numeric, 2)
      FROM t WHERE collection_fee_amount > 0
    ),
    'typical_gp_review_fee_gbp', (
      SELECT round(percentile_cont(0.5) WITHIN GROUP (ORDER BY clinical_review_fee)::numeric, 2)
      FROM t WHERE clinical_review_fee > 0
    ),
    'latest_updated_at', (SELECT max(updated_at) FROM t)
  ) END
$$;
GRANT EXECUTE ON FUNCTION public.mcp_get_provider(text) TO anon, authenticated;

-- 3c. Public: categories with active test counts
CREATE OR REPLACE FUNCTION public.mcp_list_categories()
RETURNS TABLE (slug text, name text, active_tests bigint, providers bigint)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$
  SELECT u.category_primary,
         coalesce(max(c.name), initcap(replace(u.category_primary, '-', ' '))),
         count(*)::bigint, count(DISTINCT u.provider_id)::bigint
  FROM public.unified_provider_tests u
  LEFT JOIN public.categories c ON c.slug = u.category_primary
  WHERE u.category_primary IS NOT NULL AND coalesce(u.is_addon, false) = false
  GROUP BY u.category_primary
  ORDER BY count(*) DESC
$$;
GRANT EXECUTE ON FUNCTION public.mcp_list_categories() TO anon, authenticated;

-- 3d. Public: tests containing a biomarker (case-insensitive substring)
CREATE OR REPLACE FUNCTION public.mcp_find_tests_by_biomarker(
  p_name text, p_max_price numeric DEFAULT NULL, p_limit int DEFAULT 25
)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$
  WITH pattern AS (
    SELECT '%' || replace(replace(replace(lower(trim(p_name)), '\', '\\'), '%', '\%'), '_', '\_') || '%' AS p
  ),
  hits AS (
    SELECT u.id, u.test_name, u.provider_id, u.provider_name, u.price,
           u.total_expected_cost, u.biomarker_count, u.turnaround_days_text,
           u.sample_type, u.url, u.updated_at,
           (SELECT jsonb_agg(e) FROM jsonb_array_elements_text(u.biomarkers_list) e, pattern
             WHERE lower(e) LIKE pattern.p ESCAPE '\') AS matched_biomarkers
    FROM public.unified_provider_tests u
    WHERE coalesce(u.is_addon, false) = false
      AND jsonb_typeof(u.biomarkers_list) = 'array'
      AND (p_max_price IS NULL OR u.total_expected_cost <= p_max_price)
  ),
  matched AS (SELECT * FROM hits WHERE matched_biomarkers IS NOT NULL)
  SELECT jsonb_build_object(
    'total_matches', (SELECT count(*) FROM matched),
    'tests', coalesce((
      SELECT jsonb_agg(to_jsonb(m) ORDER BY m.total_expected_cost ASC NULLS LAST, m.id)
      FROM (SELECT * FROM matched ORDER BY total_expected_cost ASC NULLS LAST, id
            LIMIT least(greatest(coalesce(p_limit, 25), 1), 100)) m
    ), '[]'::jsonb)
  )
$$;
GRANT EXECUTE ON FUNCTION public.mcp_find_tests_by_biomarker(text, numeric, int) TO anon, authenticated;

-- 3e. Admin: price movements (price field at both ends of the window)
CREATE OR REPLACE FUNCTION public.mcp_price_movements(
  p_days int DEFAULT 30, p_provider text DEFAULT NULL, p_direction text DEFAULT 'any',
  p_min_change_percentage numeric DEFAULT 0, p_limit int DEFAULT 50
)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public
AS $$
DECLARE
  v_since timestamptz := now() - make_interval(days => greatest(p_days, 1));
  v_limit int := least(greatest(coalesce(p_limit, 50), 1), 200);
  v_dir text := coalesce(p_direction, 'any');
  v_min numeric := coalesce(p_min_change_percentage, 0);
  v_result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'permission denied' USING ERRCODE = '42501';
  END IF;

  WITH h AS (
    SELECT coalesce(provider_test_id::text, provider_id || ':' || test_name) AS k,
           provider_id, test_name, price, snapshot_at,
           row_number() OVER (PARTITION BY coalesce(provider_test_id::text, provider_id || ':' || test_name) ORDER BY snapshot_at ASC) AS rn_first,
           row_number() OVER (PARTITION BY coalesce(provider_test_id::text, provider_id || ':' || test_name) ORDER BY snapshot_at DESC) AS rn_last
    FROM public.provider_test_history
    WHERE snapshot_at >= v_since AND price IS NOT NULL
      AND (p_provider IS NULL OR provider_id = p_provider)
  ),
  m AS (
    SELECT l.provider_id, l.test_name, f.price AS from_price, l.price AS to_price,
           round(l.price - f.price, 2) AS delta,
           CASE WHEN f.price = 0 THEN NULL ELSE round((l.price - f.price) / f.price * 100, 2) END AS change_percentage,
           f.snapshot_at AS first_seen_at, l.snapshot_at AS last_seen_at
    FROM h f JOIN h l ON l.k = f.k AND l.rn_last = 1
    WHERE f.rn_first = 1 AND l.price <> f.price
  ),
  mf AS (
    SELECT * FROM m
    WHERE (v_dir = 'any' OR (v_dir = 'up' AND delta > 0) OR (v_dir = 'down' AND delta < 0))
      AND (v_min = 0 OR abs(coalesce(change_percentage, 0)) >= v_min)
  ),
  ph AS (
    SELECT p.test_id, coalesce(pt.test_name, p.test_id) AS test_name,
           coalesce(pt.provider_id, p.provider) AS provider_id,
           p.old_price, p.new_price, p.change_percentage, p.availability_changed, p.changed_at
    FROM public.price_history p
    LEFT JOIN public.provider_tests pt ON pt.id::text = p.test_id
    WHERE p.changed_at >= v_since
      AND (p_provider IS NULL OR pt.provider_id = p_provider OR lower(p.provider) = lower(p_provider))
      AND (v_dir = 'any'
           OR (v_dir = 'up' AND p.new_price > p.old_price)
           OR (v_dir = 'down' AND p.new_price < p.old_price))
      AND (v_min = 0 OR abs(coalesce(p.change_percentage, 0)) >= v_min)
  )
  SELECT jsonb_build_object(
    'movements_total', (SELECT count(*) FROM mf),
    'movements', coalesce((SELECT jsonb_agg(to_jsonb(x)) FROM (
        SELECT * FROM mf ORDER BY abs(delta) DESC, provider_id, test_name LIMIT v_limit) x), '[]'::jsonb),
    'price_history_total', (SELECT count(*) FROM ph),
    'price_history_log', coalesce((SELECT jsonb_agg(to_jsonb(y)) FROM (
        SELECT * FROM ph ORDER BY changed_at DESC LIMIT v_limit) y), '[]'::jsonb)
  ) INTO v_result;
  RETURN v_result;
END;
$$;
REVOKE ALL ON FUNCTION public.mcp_price_movements(int, text, text, numeric, int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mcp_price_movements(int, text, text, numeric, int) TO authenticated;

-- 3f. Admin: Core Web Vitals percentiles and rating shares
CREATE OR REPLACE FUNCTION public.mcp_web_vitals_summary(p_days int DEFAULT 7, p_limit int DEFAULT 20)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public
AS $$
DECLARE
  v_since timestamptz := now() - make_interval(days => greatest(p_days, 1));
  v_limit int := least(greatest(coalesce(p_limit, 20), 1), 100);
  v_result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'permission denied' USING ERRCODE = '42501';
  END IF;

  WITH w AS (
    SELECT upper(metric) AS metric, coalesce(route, 'unknown') AS route, value,
           lower(coalesce(rating, '')) AS rating
    FROM public.web_vitals
    WHERE created_at >= v_since AND metric IS NOT NULL AND value IS NOT NULL
  ),
  agg AS (
    SELECT route, metric, count(*) AS samples,
           round(percentile_cont(0.5) WITHIN GROUP (ORDER BY value)::numeric, 3) AS p50,
           round(percentile_cont(0.75) WITHIN GROUP (ORDER BY value)::numeric, 3) AS p75,
           round(percentile_cont(0.95) WITHIN GROUP (ORDER BY value)::numeric, 3) AS p95,
           round(count(*) FILTER (WHERE rating = 'good')::numeric / count(*), 4) AS good_share,
           round(count(*) FILTER (WHERE rating = 'needs-improvement')::numeric / count(*), 4) AS needs_improvement_share,
           round(count(*) FILTER (WHERE rating = 'poor')::numeric / count(*), 4) AS poor_share
    FROM w GROUP BY GROUPING SETS ((route, metric), (metric))
  ),
  top_routes AS (
    SELECT route, count(*) AS samples FROM w GROUP BY route ORDER BY count(*) DESC, route LIMIT v_limit
  )
  SELECT jsonb_build_object(
    'total_samples', (SELECT count(*) FROM w),
    'overall', coalesce((SELECT jsonb_object_agg(metric, to_jsonb(a) - 'route' - 'metric') FROM agg a WHERE route IS NULL), '{}'::jsonb),
    'by_route', coalesce((SELECT jsonb_agg(jsonb_build_object(
        'route', t.route, 'samples', t.samples,
        'metrics', (SELECT jsonb_object_agg(a.metric, to_jsonb(a) - 'route' - 'metric') FROM agg a WHERE a.route = t.route))
        ORDER BY t.samples DESC, t.route) FROM top_routes t), '[]'::jsonb),
    'worst_lcp', coalesce((SELECT jsonb_agg(to_jsonb(x)) FROM (SELECT route, samples, p75 FROM agg WHERE metric = 'LCP' AND route IS NOT NULL AND samples >= 5 ORDER BY p75 DESC LIMIT 5) x), '[]'::jsonb),
    'worst_cls', coalesce((SELECT jsonb_agg(to_jsonb(x)) FROM (SELECT route, samples, p75 FROM agg WHERE metric = 'CLS' AND route IS NOT NULL AND samples >= 5 ORDER BY p75 DESC LIMIT 5) x), '[]'::jsonb),
    'worst_inp', coalesce((SELECT jsonb_agg(to_jsonb(x)) FROM (SELECT route, samples, p75 FROM agg WHERE metric = 'INP' AND route IS NOT NULL AND samples >= 5 ORDER BY p75 DESC LIMIT 5) x), '[]'::jsonb)
  ) INTO v_result;
  RETURN v_result;
END;
$$;
REVOKE ALL ON FUNCTION public.mcp_web_vitals_summary(int, int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mcp_web_vitals_summary(int, int) TO authenticated;

-- 3g. Admin: order aggregates
CREATE OR REPLACE FUNCTION public.mcp_business_summary(p_days int DEFAULT 365)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public
AS $$
DECLARE
  v_since timestamptz := now() - make_interval(days => greatest(p_days, 1));
  v_result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'permission denied' USING ERRCODE = '42501';
  END IF;

  WITH o AS (
    SELECT coalesce(status, 'unknown') AS status, coalesce(price, 0) AS price, order_date
    FROM public.orders WHERE order_date >= v_since
  )
  SELECT jsonb_build_object(
    'orders_total', (SELECT count(*) FROM o),
    'orders_total_value_gbp', (SELECT round(coalesce(sum(price), 0), 2) FROM o),
    'average_order_value_gbp', (SELECT round(coalesce(avg(price), 0), 2) FROM o),
    'orders_by_status', coalesce((SELECT jsonb_object_agg(status, jsonb_build_object('orders', n, 'value_gbp', v)) FROM (
        SELECT status, count(*) AS n, round(sum(price), 2) AS v FROM o GROUP BY status) s), '{}'::jsonb),
    'orders_by_month', coalesce((SELECT jsonb_agg(jsonb_build_object('month', m, 'orders', n, 'value_gbp', v) ORDER BY m) FROM (
        SELECT to_char(date_trunc('month', order_date), 'YYYY-MM') AS m, count(*) AS n, round(sum(price), 2) AS v
        FROM o GROUP BY 1) mm), '[]'::jsonb)
  ) INTO v_result;
  RETURN v_result;
END;
$$;
REVOKE ALL ON FUNCTION public.mcp_business_summary(int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mcp_business_summary(int) TO authenticated;

-- 3h. Admin: scraper and cron run counts (in-progress runs are not failures)
CREATE OR REPLACE FUNCTION public.mcp_run_status_class(p_status text)
RETURNS text
LANGUAGE sql IMMUTABLE SET search_path = public
AS $$
  SELECT CASE
    WHEN lower(coalesce(p_status, '')) IN ('success', 'succeeded', 'completed', 'complete', 'ok') THEN 'success'
    WHEN lower(coalesce(p_status, '')) IN ('running', 'in_progress', 'in progress', 'in-progress', 'started', 'pending', 'queued') THEN 'in_progress'
    WHEN lower(coalesce(p_status, '')) IN ('failed', 'failure', 'error', 'errored', 'timeout', 'timed_out', 'cancelled', 'aborted') THEN 'failure'
    ELSE 'other'
  END
$$;
GRANT EXECUTE ON FUNCTION public.mcp_run_status_class(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.mcp_platform_health_counts(p_hours int DEFAULT 72)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public
AS $$
DECLARE
  v_since timestamptz := now() - make_interval(hours => greatest(p_hours, 1));
  v_result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'permission denied' USING ERRCODE = '42501';
  END IF;

  WITH r AS (
    SELECT coalesce(provider_id, 'unknown') AS provider_id, status, started_at,
           public.mcp_run_status_class(status) AS cls
    FROM public.scrape_runs WHERE started_at >= v_since
  ),
  c AS (
    SELECT job_name, status, started_at, public.mcp_run_status_class(status) AS cls
    FROM public.cron_run_log WHERE started_at >= v_since
  )
  SELECT jsonb_build_object(
    'providers', coalesce((SELECT jsonb_agg(to_jsonb(p) ORDER BY p.last_run_at DESC NULLS LAST) FROM (
        SELECT provider_id, max(started_at) AS last_run_at,
               (array_agg(status ORDER BY started_at DESC))[1] AS last_status,
               count(*) FILTER (WHERE cls = 'success') AS success,
               count(*) FILTER (WHERE cls = 'failure') AS failure,
               count(*) FILTER (WHERE cls = 'in_progress') AS in_progress,
               count(*) FILTER (WHERE cls = 'other') AS other
        FROM r GROUP BY provider_id) p), '[]'::jsonb),
    'cron_totals', jsonb_build_object(
        'total', (SELECT count(*) FROM c),
        'success', (SELECT count(*) FROM c WHERE cls = 'success'),
        'failure', (SELECT count(*) FROM c WHERE cls = 'failure'),
        'in_progress', (SELECT count(*) FROM c WHERE cls = 'in_progress'),
        'other', (SELECT count(*) FROM c WHERE cls = 'other')),
    'cron_by_job', coalesce((SELECT jsonb_agg(to_jsonb(j) ORDER BY j.job_name) FROM (
        SELECT job_name,
               count(*) FILTER (WHERE cls = 'success') AS success,
               count(*) FILTER (WHERE cls = 'failure') AS failure,
               count(*) FILTER (WHERE cls = 'in_progress') AS in_progress,
               max(started_at) AS last_run_at
        FROM c GROUP BY job_name) j), '[]'::jsonb)
  ) INTO v_result;
  RETURN v_result;
END;
$$;
REVOKE ALL ON FUNCTION public.mcp_platform_health_counts(int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mcp_platform_health_counts(int) TO authenticated;

-- Rollback:
--   DROP FUNCTION public.mcp_platform_health_counts(int), public.mcp_run_status_class(text),
--     public.mcp_business_summary(int), public.mcp_web_vitals_summary(int, int),
--     public.mcp_price_movements(int, text, text, numeric, int),
--     public.mcp_find_tests_by_biomarker(text, numeric, int), public.mcp_list_categories(),
--     public.mcp_get_provider(text), public.mcp_list_providers(), public.mcp_log_denied_tool_call(text);
--   ALTER TABLE public.favorites DROP CONSTRAINT favorites_user_id_test_id_key;

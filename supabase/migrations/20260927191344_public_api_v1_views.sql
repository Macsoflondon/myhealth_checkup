-- Public API v1: a stable, read-only contract in front of the internal
-- catalogue tables, served by the public-api edge function and described to
-- AI agents by /.well-known/web-mcp.json and /llms.txt.
--
-- Why views rather than exposing provider_tests directly: the internal schema
-- is still moving (TEC Engine, Crux Dataset). These views pin the public field
-- names so the internals can change without breaking agents that rely on them.
--
-- Access: service_role only. anon and authenticated get nothing, so the only
-- way to read these is through the edge function, which adds caching,
-- disclaimers and freshness metadata. No user data is involved anywhere.

-- 1. provider_metadata.slug — joins provider_metadata to provider_tests.provider_id.
--    Previously there was no key between the two (Randox Health vs 'randox').
ALTER TABLE public.provider_metadata ADD COLUMN IF NOT EXISTS slug text;

UPDATE public.provider_metadata
   SET slug = CASE provider_name
                WHEN 'Randox Health' THEN 'randox'
                ELSE lower(regexp_replace(trim(provider_name), '[^A-Za-z0-9]+', '-', 'g'))
              END
 WHERE slug IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS provider_metadata_slug_key
  ON public.provider_metadata (slug);

COMMENT ON COLUMN public.provider_metadata.slug IS
  'Matches provider_tests.provider_id. Used by the api_v1_* views.';

-- 2. Tests: every active, priced test with its full cost breakdown.
CREATE OR REPLACE VIEW public.api_v1_tests
WITH (security_invoker = on) AS
SELECT
  pt.id,
  pt.provider_id,
  COALESCE(pm.provider_name, initcap(replace(pt.provider_id, '-', ' '))) AS provider_name,
  pt.test_name,
  NULLIF(lower(pt.canonical_category), '') AS category,
  COALESCE(pt.is_addon, false) AS is_addon,
  pt.price AS price_gbp,
  COALESCE(pt.total_expected_cost, pt.price) AS total_expected_cost_gbp,
  pt.collection_method,
  pt.collection_fee_type,
  pt.collection_fee_amount AS collection_fee_gbp,
  pt.home_phlebotomy_cost AS home_phlebotomy_cost_gbp,
  pt.clinic_phlebotomy_cost AS clinic_phlebotomy_cost_gbp,
  pt.clinical_review_type,
  pt.clinical_review_fee AS clinical_review_fee_gbp,
  pt.sample_type,
  COALESCE(pt.home_kit_available, false) AS home_kit_available,
  COALESCE(pt.clinic_visit_available, false) AS clinic_visit_available,
  to_jsonb(array_remove(ARRAY[
    CASE WHEN pt.home_kit_available THEN 'home_kit' END,
    CASE WHEN pt.clinic_visit_available THEN 'clinic_visit' END
  ], NULL)) AS location_options,
  pt.turnaround_days,
  pt.turnaround_days_text AS turnaround_text,
  pt.biomarker_count,
  CASE WHEN jsonb_typeof(pt.biomarkers_list) = 'array' THEN pt.biomarkers_list ELSE '[]'::jsonb END AS biomarkers,
  pt.gender_specific,
  pt.url AS provider_url,
  COALESCE(pt.url_verified, false) AS provider_url_verified,
  COALESCE(pt.last_validated_at, pt.scraped_at) AS last_checked_at,
  (COALESCE(pt.last_validated_at, pt.scraped_at) < now() - interval '7 days') AS price_check_stale
FROM public.provider_tests pt
LEFT JOIN public.provider_metadata pm ON pm.slug = pt.provider_id
WHERE pt.is_active = true
  AND pt.price > 0;

COMMENT ON VIEW public.api_v1_tests IS
  'Public API v1 contract. Active, priced tests only. total_expected_cost_gbp is the TEC Engine all-in cost where known. price_check_stale = not re-checked against the provider page for 7+ days.';

-- 3. Providers: one row per provider with live tests, plus verified
--    accreditation notes exactly as recorded from UKAS/CQC registers.
CREATE OR REPLACE VIEW public.api_v1_providers
WITH (security_invoker = on) AS
WITH t AS (
  SELECT
    provider_id,
    count(*) FILTER (WHERE NOT is_addon) AS test_count,
    count(*) FILTER (WHERE is_addon) AS addon_count,
    min(total_expected_cost_gbp) FILTER (WHERE NOT is_addon) AS min_total_expected_cost_gbp,
    max(total_expected_cost_gbp) FILTER (WHERE NOT is_addon) AS max_total_expected_cost_gbp,
    bool_or(home_kit_available) AS offers_home_kits,
    bool_or(clinic_visit_available) AS offers_clinic_visits,
    max(last_checked_at) AS prices_last_checked_at
  FROM public.api_v1_tests
  GROUP BY provider_id
)
SELECT
  t.provider_id AS id,
  COALESCE(pm.provider_name, initcap(replace(t.provider_id, '-', ' '))) AS name,
  pm.website_url,
  pm.metadata ->> 'legal_name' AS legal_name,
  pm.metadata ->> 'companies_house_number' AS companies_house_number,
  COALESCE(pm.accreditations, ARRAY[]::text[]) AS accreditation_notes,
  CASE WHEN (pm.metadata ->> 'accreditation_verified_at') ~ '^\d{4}-\d{2}-\d{2}$'
       THEN (pm.metadata ->> 'accreditation_verified_at')::date END AS accreditation_checked_on,
  t.test_count,
  t.addon_count,
  t.min_total_expected_cost_gbp,
  t.max_total_expected_cost_gbp,
  t.offers_home_kits,
  t.offers_clinic_visits,
  t.prices_last_checked_at
FROM t
LEFT JOIN public.provider_metadata pm ON pm.slug = t.provider_id;

COMMENT ON VIEW public.api_v1_providers IS
  'Public API v1 contract. accreditation_notes are the verbatim findings from the UKAS and CQC public registers, checked on accreditation_checked_on.';

-- 4. Biomarker offers: every (canonical biomarker, test) pair. This is the
--    cross-provider biomarker comparison that the public compare_biomarker
--    and find_tests_by_biomarkers tools are built on.
CREATE OR REPLACE VIEW public.api_v1_biomarker_offers
WITH (security_invoker = on) AS
SELECT DISTINCT ON (h.id, t.id)
  h.id AS biomarker_id,
  h.name AS biomarker_name,
  h.abbreviation AS biomarker_abbreviation,
  h.category_consumer AS biomarker_category,
  t.id AS test_id,
  t.provider_id,
  t.provider_name,
  t.test_name,
  t.is_addon,
  t.price_gbp,
  t.total_expected_cost_gbp,
  t.biomarker_count,
  t.sample_type,
  t.home_kit_available,
  t.clinic_visit_available,
  t.turnaround_days,
  t.turnaround_text,
  t.provider_url,
  t.last_checked_at,
  t.price_check_stale
FROM public.provider_test_biomarkers ptb
JOIN public.biomarker_hub h ON h.id = ptb.biomarker_id AND h.status <> 'duplicate'
JOIN public.api_v1_tests t ON t.id = ptb.provider_test_id
ORDER BY h.id, t.id;

COMMENT ON VIEW public.api_v1_biomarker_offers IS
  'Public API v1 contract. One row per canonical biomarker per test that measures it, from the exact-match provider_test_biomarkers links.';

-- 5. Biomarker directory: canonical biomarkers that at least one live test
--    measures, with coverage and the cheapest standalone route.
CREATE OR REPLACE VIEW public.api_v1_biomarkers
WITH (security_invoker = on) AS
SELECT
  h.id,
  h.name,
  h.abbreviation,
  COALESCE(h.synonyms, ARRAY[]::text[]) AS synonyms,
  h.category_consumer AS category,
  count(DISTINCT o.provider_id) AS provider_count,
  count(DISTINCT o.test_id) AS test_count,
  min(o.total_expected_cost_gbp) FILTER (WHERE NOT o.is_addon) AS cheapest_standalone_test_gbp
FROM public.biomarker_hub h
JOIN public.api_v1_biomarker_offers o ON o.biomarker_id = h.id
GROUP BY h.id, h.name, h.abbreviation, h.synonyms, h.category_consumer;

COMMENT ON VIEW public.api_v1_biomarkers IS
  'Public API v1 contract. Canonical biomarkers measured by at least one live test.';

-- 6. Categories.
CREATE OR REPLACE VIEW public.api_v1_categories
WITH (security_invoker = on) AS
SELECT
  category,
  count(*) FILTER (WHERE NOT is_addon) AS test_count,
  count(DISTINCT provider_id) AS provider_count
FROM public.api_v1_tests
WHERE category IS NOT NULL
GROUP BY category;

COMMENT ON VIEW public.api_v1_categories IS 'Public API v1 contract. Test categories with live tests.';

-- 7. Lock down: service_role only.
REVOKE ALL ON public.api_v1_tests, public.api_v1_providers, public.api_v1_biomarker_offers,
              public.api_v1_biomarkers, public.api_v1_categories
  FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.api_v1_tests, public.api_v1_providers, public.api_v1_biomarker_offers,
                public.api_v1_biomarkers, public.api_v1_categories
  TO service_role;

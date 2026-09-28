-- Public API v1, correctness pass after an independent review of the live API.
--
-- 1. Biomarker equivalents. Several active biomarker_hub rows name the same
--    analyte (e.g. "HbA1c", "Glycated Haemoglobin (HbA1c)",
--    "Haemoglobin A1c (HBA1c)"). compare_biomarker treated them as different
--    biomarkers, so it left providers out (Clinilabs was missing from HbA1c).
--    Each alias row below gets canonical_id pointing at the row most providers
--    use. status stays 'active', so the site's biomarker library and test-page
--    tooltips (which read biomarkers_library, filtered on status) are
--    unchanged. Only the api_v1_* views fold aliases into the canonical row.
--    Deliberately NOT merged, because they are different measurements:
--    HDL % and the cholesterol ratios, CRP vs hs-CRP, total vs adjusted
--    calcium, total vs active B12.
--
-- 2. Bracket matching in refresh_provider_test_biomarkers(). Short bracketed
--    abbreviations produced false links: "Basophils (Ba)" -> Serum Bile Acids
--    (11 tests), "Salmonella spp. (Sal)" -> Salicylate, "Cryptosporidium spp.
--    (CR)" -> Chromium, "IgE (Total)" -> a hub row named "Total". Changes:
--      * text before the bracket is now tried before the bracket content
--      * a bracket of 3 characters or fewer only counts if the biomarker it
--        matches also shares its first four letters with the text before
--        the bracket (keeps "Mean Cell Volume (MCV)", drops "Salmonella (Sal)")
--      * generic words (total, free, ratio, ...) are never used as match keys
--    All bracket-derived links are deleted and rebuilt under the new rules.
--
-- 3. api_v1_tests:
--      * excludes rows that are not tests (Medichecks collection-method fee
--        rows, a Randox phlebotomy training course)
--      * total_expected_cost_gbp now adds a published collection fee when the
--        test can only be taken at a clinic and the TEC figure left it out
--        (19 London Medical Laboratory and 2 Clinilabs tests on 2026-09-27).
--        GREATEST() avoids double counting where TEC already includes it.
--
-- 4. api_v1_biomarkers lists canonical rows only, with alias names added to
--    synonyms so the API resolves "Luteinizing hormone" or "Glycated
--    Haemoglobin". New api_v1_coverage view reports the known gaps.

-- 1. Equivalents -------------------------------------------------------------
UPDATE public.biomarker_hub h
   SET canonical_id = m.canonical
  FROM (VALUES
    -- HbA1c
    ('fba8a345-0391-4d90-b1dc-7786dc342ee1'::uuid, '63442e30-06e1-493b-b9e5-35e14f0953f3'::uuid),
    ('774c5a50-c54b-461e-9fde-cd776b92270d'::uuid, '63442e30-06e1-493b-b9e5-35e14f0953f3'::uuid),
    ('0f8ecfc8-ade9-4768-97d0-d76d95548cb6'::uuid, '63442e30-06e1-493b-b9e5-35e14f0953f3'::uuid),
    -- HDL cholesterol
    ('44ec23b6-4f38-4ba3-9e2a-92668ac00337'::uuid, '2e74b733-3041-46c7-8e2e-76a5488286ba'::uuid),
    -- LDL cholesterol
    ('a81a9183-67ba-4de8-bed7-8a93e6d08614'::uuid, 'e33f7f1f-5bc9-45d1-a81a-2bc8ec703f61'::uuid),
    ('f0f4dab0-1daa-45ab-aa20-58fa316146f7'::uuid, 'e33f7f1f-5bc9-45d1-a81a-2bc8ec703f61'::uuid),
    -- Non-HDL cholesterol
    ('78ac7d44-bfb4-4e22-98b5-3f306b153ff0'::uuid, '8ff4679a-12e2-4f51-904e-919326dbbfff'::uuid),
    -- Luteinising hormone
    ('79f9be74-99a6-4bc1-9f49-2ae4731a7539'::uuid, 'e9b8d9e1-66ff-4cec-b7d7-237ee6940c4d'::uuid),
    ('060ffc98-71ce-4ed2-be5e-c5e2b6fd957f'::uuid, 'e9b8d9e1-66ff-4cec-b7d7-237ee6940c4d'::uuid),
    -- Follicle-stimulating hormone
    ('716727f6-b612-48d3-863b-27c91655d9da'::uuid, 'aec12f3b-e0c1-439b-b4d5-31fefb9a9f7e'::uuid),
    ('cf53de81-9951-49e1-bbac-4563723b21ed'::uuid, 'aec12f3b-e0c1-439b-b4d5-31fefb9a9f7e'::uuid),
    ('52e91273-05ac-474f-9e4a-156e23a8efef'::uuid, 'aec12f3b-e0c1-439b-b4d5-31fefb9a9f7e'::uuid),
    -- SHBG
    ('3a0febd6-968e-4ab5-8b2b-898b868aa33b'::uuid, '3a14d6f9-d6ae-4353-bd2d-cd6e55e19bd9'::uuid),
    ('7dbfb8bc-a025-473d-b492-b98a2c84af27'::uuid, '3a14d6f9-d6ae-4353-bd2d-cd6e55e19bd9'::uuid),
    -- hs-CRP (not standard CRP)
    ('e7b85f85-1a72-4ef9-96d0-9f5c9e1a8f13'::uuid, '263dcc2f-6439-4282-be9a-e7f1c590da89'::uuid),
    ('16b4eccf-75df-490a-ae34-5ab5e558132d'::uuid, '263dcc2f-6439-4282-be9a-e7f1c590da89'::uuid),
    -- DHEA sulphate
    ('7423ca8f-ff0b-4215-b144-d480d9ed3e91'::uuid, '1ce770fe-cafe-4cdb-94c0-cf86167414e3'::uuid),
    ('8a425538-80e0-4363-9f03-f2bf82053ecb'::uuid, '1ce770fe-cafe-4cdb-94c0-cf86167414e3'::uuid),
    ('bdbb50ca-1dc9-47f5-9457-97e2057b3312'::uuid, '1ce770fe-cafe-4cdb-94c0-cf86167414e3'::uuid),
    -- Uric acid
    ('17895c2e-7b5e-4441-8081-ad14008e34d5'::uuid, '621a85dc-b331-49ea-9bcd-629de2a9e5f6'::uuid),
    -- Vitamin D (25-OH)
    ('f4e4e8c6-8fde-4b9d-be79-da85da2be3a0'::uuid, 'abe2a417-1e24-4553-96f8-aa9862032368'::uuid),
    -- Apolipoprotein B
    ('ee7246e8-88ff-4dbd-a0e0-51961e28f290'::uuid, 'e94f7fa5-f8a1-4644-a164-b9bb981f4b86'::uuid),
    -- Full blood count indices named two ways
    ('efbe1c71-1923-4363-b55e-389abaa2a631'::uuid, 'c017c52d-8ec0-483e-b783-f076a89fb09a'::uuid),
    ('cf924085-39ee-4324-bf0e-b154e5191f30'::uuid, '4ae51c5c-6e4d-4465-a6dc-f052d17918d2'::uuid),
    -- Adjusted (corrected) calcium, kept separate from total calcium
    ('ed45052c-0ec5-434e-80ec-d81499debfdc'::uuid, '66d55b5a-e5c4-48be-b11a-1f93aa77805a'::uuid),
    ('9f2c3422-005e-4da1-9543-8393d05cc9c9'::uuid, '66d55b5a-e5c4-48be-b11a-1f93aa77805a'::uuid)
  ) AS m(alias, canonical)
 WHERE h.id = m.alias
   AND h.status <> 'duplicate'
   AND h.canonical_id IS NULL;

COMMENT ON COLUMN public.biomarker_hub.canonical_id IS
  'Row this one is equivalent to. status=duplicate rows are hidden everywhere. Active rows with a canonical_id stay visible in the site library but the public API (api_v1_*) folds them into the canonical row.';

-- 2. Link refresh with safer bracket matching ---------------------------------
CREATE OR REPLACE FUNCTION public.refresh_provider_test_biomarkers()
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_deleted  integer := 0;
  v_inserted integer := 0;
  v_updated  integer := 0;
BEGIN
  DROP TABLE IF EXISTS _ptb_resolved;
  CREATE TEMP TABLE _ptb_resolved ON COMMIT DROP AS
  WITH items AS (
    SELECT DISTINCT pt.id AS provider_test_id, item AS raw_label,
           lower(trim(item)) AS n,
           lower(trim(both '*' from trim(regexp_replace(item, '^#{1,6}\s*', '')))) AS md_stripped,
           lower(trim(substring(item from '\(([^)]+)\)$'))) AS paren_content,
           lower(trim(regexp_replace(item, '\s*\([^)]*\)\s*$', ''))) AS pre_paren
    FROM public.provider_tests pt,
         jsonb_array_elements_text(pt.biomarkers_list) item
    WHERE jsonb_typeof(pt.biomarkers_list) = 'array'
      AND length(trim(item)) > 0
  ),
  keys AS (
    SELECT COALESCE(CASE WHEN h.status = 'duplicate' THEN h.canonical_id END, h.id) AS id,
           (h.status = 'duplicate')::int AS alias, v.kind, v.k
    FROM public.biomarker_hub h
    CROSS JOIN LATERAL (
      SELECT 1 AS kind, lower(trim(h.name)) AS k
      UNION ALL SELECT 2, lower(trim(s)) FROM unnest(h.synonyms) s
      UNION ALL SELECT 3, lower(trim(h.abbreviation)) WHERE trim(COALESCE(h.abbreviation, '')) <> ''
    ) v
    WHERE v.k IS NOT NULL AND v.k <> ''
      AND v.k NOT IN ('total', 'free', 'ratio', 'level', 'levels', 'profile', 'panel', 'screen', 'test', 'count', 'other', 'index')
      AND (h.status <> 'duplicate' OR h.canonical_id IS NOT NULL)
  ),
  stems AS (
    SELECT DISTINCT id, left(regexp_replace(k, '[^a-z]', '', 'g'), 4) AS stem FROM keys
  ),
  cand AS (
    SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 1 AS p FROM items i JOIN keys k ON k.kind = 1 AND k.k = i.n
    UNION ALL SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 2 FROM items i JOIN keys k ON k.kind = 2 AND k.k = i.n
    UNION ALL SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 3 FROM items i JOIN keys k ON k.kind = 3 AND k.k = i.n
    UNION ALL SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 4 FROM items i JOIN keys k ON k.kind = 1 AND k.k = i.md_stripped
    UNION ALL SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 5 FROM items i JOIN keys k ON k.kind = 3 AND k.k = i.md_stripped
    -- Text before a trailing bracket, tried before the bracket content.
    UNION ALL SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 6 FROM items i JOIN keys k ON k.kind = 1 AND k.k = i.pre_paren WHERE i.pre_paren <> i.n
    UNION ALL SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 7 FROM items i JOIN keys k ON k.kind = 2 AND k.k = i.pre_paren WHERE i.pre_paren <> i.n
    -- Bracket content. Short abbreviations need a second signal.
    UNION ALL SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 8 FROM items i JOIN keys k ON k.kind = 3 AND k.k = i.paren_content
      WHERE length(i.paren_content) > 3
         OR EXISTS (SELECT 1 FROM stems s WHERE s.id = k.id AND length(s.stem) = 4
                      AND s.stem = left(regexp_replace(i.pre_paren, '[^a-z]', '', 'g'), 4))
    UNION ALL SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 9 FROM items i JOIN keys k ON k.kind = 1 AND k.k = i.paren_content
      WHERE length(i.paren_content) > 3
         OR EXISTS (SELECT 1 FROM stems s WHERE s.id = k.id AND length(s.stem) = 4
                      AND s.stem = left(regexp_replace(i.pre_paren, '[^a-z]', '', 'g'), 4))
  ),
  best AS (
    SELECT DISTINCT ON (provider_test_id, raw_label)
           provider_test_id, raw_label, id AS biomarker_id, p
    FROM cand
    ORDER BY provider_test_id, raw_label, p, alias, id
  )
  SELECT i.provider_test_id, i.raw_label, b.biomarker_id,
         CASE WHEN b.p IS NULL THEN 'unmatched'
              WHEN b.p = 1 THEN 'exact_name'
              WHEN b.p = 2 THEN 'exact_synonym'
              WHEN b.p = 3 THEN 'exact_abbreviation'
              WHEN b.p IN (4, 5) THEN 'markdown_stripped'
              WHEN b.p IN (6, 7) THEN 'pre_parenthetical'
              ELSE 'parenthetical_content' END AS match_method
  FROM items i
  LEFT JOIN best b USING (provider_test_id, raw_label);

  DELETE FROM public.provider_test_biomarkers p
  WHERE NOT EXISTS (
    SELECT 1 FROM _ptb_resolved r
    WHERE r.provider_test_id = p.provider_test_id AND r.raw_label = p.raw_label
  );
  GET DIAGNOSTICS v_deleted = ROW_COUNT;

  UPDATE public.provider_test_biomarkers p
     SET biomarker_id = r.biomarker_id,
         match_method = r.match_method
    FROM _ptb_resolved r
   WHERE r.provider_test_id = p.provider_test_id
     AND r.raw_label = p.raw_label
     AND r.biomarker_id IS NOT NULL
     AND p.biomarker_id IS DISTINCT FROM r.biomarker_id
     AND (
       p.biomarker_id IS NULL
       OR EXISTS (SELECT 1 FROM public.biomarker_hub h
                  WHERE h.id = p.biomarker_id AND h.status = 'duplicate')
     );
  GET DIAGNOSTICS v_updated = ROW_COUNT;

  INSERT INTO public.provider_test_biomarkers (provider_test_id, biomarker_id, raw_label, match_method)
  SELECT r.provider_test_id, r.biomarker_id, r.raw_label, r.match_method
  FROM _ptb_resolved r
  ON CONFLICT (provider_test_id, raw_label) DO NOTHING;
  GET DIAGNOSTICS v_inserted = ROW_COUNT;

  RETURN jsonb_build_object(
    'deleted', v_deleted,
    'updated', v_updated,
    'inserted', v_inserted,
    'refreshed_at', now()
  );
END;
$$;

COMMENT ON FUNCTION public.refresh_provider_test_biomarkers() IS
  'Re-derives provider_test_biomarkers from provider_tests.biomarkers_list: exact name, synonym, abbreviation, markdown-stripped, text before a bracket, then bracket content (short bracket abbreviations need a matching four-letter stem). Duplicate hub rows resolve to their canonical_id. Never downgrades a matched row. Scheduled every 6 hours after the scrapers.';

REVOKE ALL ON FUNCTION public.refresh_provider_test_biomarkers() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.refresh_provider_test_biomarkers() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_provider_test_biomarkers() TO service_role;

-- Rebuild every bracket-derived link under the new rules.
DELETE FROM public.provider_test_biomarkers
 WHERE match_method IN ('parenthetical_content', 'pre_parenthetical');

SELECT public.refresh_provider_test_biomarkers();

-- 3. Views ------------------------------------------------------------------
-- Column order changes, so the whole api_v1 set is dropped and recreated.
DROP VIEW IF EXISTS public.api_v1_categories, public.api_v1_biomarkers, public.api_v1_biomarker_offers,
                    public.api_v1_providers, public.api_v1_tests CASCADE;

CREATE VIEW public.api_v1_tests
WITH (security_invoker = on) AS
WITH base AS (
  SELECT
    pt.*,
    CASE
      WHEN COALESCE(pt.home_kit_available, false) = false
       AND COALESCE(pt.clinic_visit_available, false) = true
       AND COALESCE(pt.collection_fee_amount, 0) > 0
       AND COALESCE(pt.collection_fee_type, 'fixed') IN ('fixed', 'from')
      THEN pt.collection_fee_amount
      ELSE 0
    END AS mandatory_collection_fee,
    CASE
      WHEN pt.clinical_review_type IS NOT NULL
       AND pt.clinical_review_type NOT IN ('included', 'optional', 'not_included', 'not_available')
       AND COALESCE(pt.clinical_review_fee, 0) > 0
      THEN pt.clinical_review_fee
      ELSE 0
    END AS mandatory_review_fee
  FROM public.provider_tests pt
  WHERE pt.is_active = true
    AND pt.price > 0
    -- Rows the scrapers pick up that are not tests.
    AND pt.test_name !~* '(\[collection method\]|^collection method|phlebotomy course|award in)'
)
SELECT
  b.id,
  b.provider_id,
  COALESCE(pm.provider_name, initcap(replace(b.provider_id, '-', ' '))) AS provider_name,
  b.test_name,
  NULLIF(lower(b.canonical_category), '') AS category,
  COALESCE(b.is_addon, false) AS is_addon,
  b.price AS price_gbp,
  GREATEST(COALESCE(b.total_expected_cost, b.price), b.price + b.mandatory_collection_fee + b.mandatory_review_fee) AS total_expected_cost_gbp,
  (b.mandatory_collection_fee > 0) AS total_includes_collection_fee,
  b.collection_method,
  b.collection_fee_type,
  b.collection_fee_amount AS collection_fee_gbp,
  b.home_phlebotomy_cost AS home_phlebotomy_cost_gbp,
  b.clinic_phlebotomy_cost AS clinic_phlebotomy_cost_gbp,
  b.clinical_review_type,
  b.clinical_review_fee AS clinical_review_fee_gbp,
  b.sample_type,
  COALESCE(b.home_kit_available, false) AS home_kit_available,
  COALESCE(b.clinic_visit_available, false) AS clinic_visit_available,
  to_jsonb(array_remove(ARRAY[
    CASE WHEN b.home_kit_available THEN 'home_kit' END,
    CASE WHEN b.clinic_visit_available THEN 'clinic_visit' END
  ], NULL)) AS location_options,
  b.turnaround_days,
  b.turnaround_days_text AS turnaround_text,
  b.biomarker_count,
  CASE WHEN jsonb_typeof(b.biomarkers_list) = 'array' THEN b.biomarkers_list ELSE '[]'::jsonb END AS biomarkers,
  b.gender_specific,
  b.url AS provider_url,
  COALESCE(b.url_verified, false) AS provider_url_verified,
  COALESCE(b.last_validated_at, b.scraped_at) AS last_checked_at,
  (COALESCE(b.last_validated_at, b.scraped_at) < now() - interval '7 days') AS price_check_stale
FROM base b
LEFT JOIN public.provider_metadata pm ON pm.slug = b.provider_id;

COMMENT ON VIEW public.api_v1_tests IS
  'Public API v1 contract. Active, priced tests only, non-test rows excluded. total_expected_cost_gbp = TEC Engine figure, raised to include a published collection fee for clinic-only tests where TEC left it out. price_check_stale = not re-checked for 7+ days.';

CREATE VIEW public.api_v1_providers
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
  'Public API v1 contract. accreditation_notes are verbatim findings from public registers (UKAS, CQC, MHRA as named in each note), checked on accreditation_checked_on. Null date = not yet checked.';

CREATE VIEW public.api_v1_categories
WITH (security_invoker = on) AS
SELECT
  category,
  count(*) FILTER (WHERE NOT is_addon) AS test_count,
  count(DISTINCT provider_id) AS provider_count
FROM public.api_v1_tests
WHERE category IS NOT NULL
GROUP BY category;

COMMENT ON VIEW public.api_v1_categories IS 'Public API v1 contract. Test categories with live tests.';

CREATE VIEW public.api_v1_biomarker_offers
WITH (security_invoker = on) AS
SELECT DISTINCT ON (c.id, t.id)
  c.id AS biomarker_id,
  c.name AS biomarker_name,
  c.abbreviation AS biomarker_abbreviation,
  c.category_consumer AS biomarker_category,
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
JOIN public.biomarker_hub h ON h.id = ptb.biomarker_id
JOIN public.biomarker_hub c ON c.id = COALESCE(h.canonical_id, h.id) AND c.status <> 'duplicate'
JOIN public.api_v1_tests t ON t.id = ptb.provider_test_id
ORDER BY c.id, t.id;

COMMENT ON VIEW public.api_v1_biomarker_offers IS
  'Public API v1 contract. One row per canonical biomarker per test that measures it. Equivalent hub rows are folded into their canonical row.';

CREATE VIEW public.api_v1_biomarkers
WITH (security_invoker = on) AS
WITH aliases AS (
  SELECT a.canonical_id AS id,
         array_agg(DISTINCT x) FILTER (WHERE x IS NOT NULL AND x <> '') AS names
  FROM public.biomarker_hub a
  CROSS JOIN LATERAL unnest(ARRAY[a.name, a.abbreviation] || COALESCE(a.synonyms, ARRAY[]::text[])) AS x
  WHERE a.canonical_id IS NOT NULL
  GROUP BY a.canonical_id
)
SELECT
  h.id,
  h.name,
  h.abbreviation,
  ARRAY(
    SELECT DISTINCT s
    FROM unnest(COALESCE(h.synonyms, ARRAY[]::text[]) || COALESCE(al.names, ARRAY[]::text[])) s
    WHERE s IS NOT NULL AND s <> '' AND s <> h.name AND s IS DISTINCT FROM h.abbreviation
    ORDER BY s
  ) AS synonyms,
  h.category_consumer AS category,
  count(DISTINCT o.provider_id) AS provider_count,
  count(DISTINCT o.test_id) AS test_count,
  min(o.total_expected_cost_gbp) FILTER (WHERE NOT o.is_addon) AS cheapest_standalone_test_gbp
FROM public.biomarker_hub h
JOIN public.api_v1_biomarker_offers o ON o.biomarker_id = h.id
LEFT JOIN aliases al ON al.id = h.id
WHERE h.status <> 'duplicate' AND h.canonical_id IS NULL
GROUP BY h.id, h.name, h.abbreviation, h.synonyms, h.category_consumer, al.names;

COMMENT ON VIEW public.api_v1_biomarkers IS
  'Public API v1 contract. Canonical biomarkers measured by at least one live test. synonyms include the names of equivalent and duplicate hub rows.';

CREATE VIEW public.api_v1_coverage
WITH (security_invoker = on) AS
SELECT
  count(*) FILTER (WHERE NOT t.is_addon) AS standalone_tests,
  count(*) FILTER (WHERE t.is_addon) AS addon_tests,
  count(*) FILTER (WHERE NOT t.is_addon AND jsonb_array_length(t.biomarkers) = 0) AS standalone_tests_without_biomarker_list,
  count(*) FILTER (WHERE NOT t.is_addon AND NOT EXISTS (
    SELECT 1 FROM public.api_v1_biomarker_offers o WHERE o.test_id = t.id)) AS standalone_tests_without_matched_biomarkers,
  count(*) FILTER (WHERE t.price_check_stale) AS tests_with_stale_price_check,
  max(t.last_checked_at) AS data_last_checked_at
FROM public.api_v1_tests t;

COMMENT ON VIEW public.api_v1_coverage IS 'Public API v1 contract. Coverage and known gaps, reported by the API index.';

-- 5. Lock down: service_role only.
REVOKE ALL ON public.api_v1_tests, public.api_v1_providers, public.api_v1_categories,
              public.api_v1_biomarker_offers, public.api_v1_biomarkers, public.api_v1_coverage
  FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.api_v1_tests, public.api_v1_providers, public.api_v1_categories,
                public.api_v1_biomarker_offers, public.api_v1_biomarkers, public.api_v1_coverage
  TO service_role;

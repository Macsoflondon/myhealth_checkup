-- Keep provider_test_biomarkers in step with provider_tests.biomarkers_list.
--
-- The link table was populated once on 2026-08-29 (20260829235017) and never
-- refreshed. Since then the scrapers have added and changed tests, and a
-- biomarker_hub dedupe pass flagged more rows as duplicates. On 2026-09-27:
--   * 252 of 710 active priced tests had no biomarker links at all
--   * 1,878 current biomarker labels had no link row
--   * 1,050 link rows pointed at hub rows now flagged 'duplicate', so the
--     biomarker_provider_comparison view silently dropped them
--
-- This function re-derives the links with the same rules and priority as the
-- original populate migration: exact name, synonym, abbreviation, then
-- markdown-stripped, parenthetical content and pre-parenthetical text. No
-- fuzzy matching. One addition: hub rows flagged 'duplicate' still act as
-- aliases, but resolve to their curated canonical_id rather than to
-- themselves.
--
-- Rules:
--   * labels no longer in a test's biomarkers_list are removed
--   * new labels are inserted (matched or 'unmatched')
--   * an existing row is only ever upgraded: unmatched -> matched, or
--     duplicate hub row -> its canonical row. A matched row is never
--     downgraded to unmatched.
--
-- Dry run against production before applying: 6,216 labels, 5,212 matched,
-- 0 existing rows would change biomarker, 0 would be downgraded.
--
-- Scheduled at :45 every 6 hours, after the scrapers (:00-:28) and
-- promote-provider-tests (:35). Runs through run_logged_cleanup so each run
-- lands in cron_run_log and a failure raises a scraper_alerts row.

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
      AND (h.status <> 'duplicate' OR h.canonical_id IS NOT NULL)
  ),
  cand AS (
    SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 1 AS p FROM items i JOIN keys k ON k.kind = 1 AND k.k = i.n
    UNION ALL SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 2 FROM items i JOIN keys k ON k.kind = 2 AND k.k = i.n
    UNION ALL SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 3 FROM items i JOIN keys k ON k.kind = 3 AND k.k = i.n
    UNION ALL SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 4 FROM items i JOIN keys k ON k.kind = 1 AND k.k = i.md_stripped
    UNION ALL SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 5 FROM items i JOIN keys k ON k.kind = 3 AND k.k = i.md_stripped
    UNION ALL SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 6 FROM items i JOIN keys k ON k.kind = 3 AND k.k = i.paren_content
    UNION ALL SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 7 FROM items i JOIN keys k ON k.kind = 1 AND k.k = i.paren_content
    UNION ALL SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 8 FROM items i JOIN keys k ON k.kind = 1 AND k.k = i.pre_paren WHERE i.pre_paren <> i.n
    UNION ALL SELECT i.provider_test_id, i.raw_label, k.id, k.alias, 9 FROM items i JOIN keys k ON k.kind = 2 AND k.k = i.pre_paren WHERE i.pre_paren <> i.n
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
              WHEN b.p IN (6, 7) THEN 'parenthetical_content'
              ELSE 'pre_parenthetical' END AS match_method
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
  'Re-derives provider_test_biomarkers from provider_tests.biomarkers_list using the 2026-08-29 exact-match rules, with duplicate hub rows resolving to their canonical_id. Never downgrades a matched row. Scheduled every 6 hours after the scrapers.';

REVOKE ALL ON FUNCTION public.refresh_provider_test_biomarkers() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.refresh_provider_test_biomarkers() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_provider_test_biomarkers() TO service_role;

SELECT cron.schedule(
  'refresh-provider-test-biomarkers-6h',
  '45 */6 * * *',
  $cron$ SELECT public.run_logged_cleanup('refresh-provider-test-biomarkers', 'SELECT public.refresh_provider_test_biomarkers()'); $cron$
);

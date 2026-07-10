
DO $$
DECLARE
  rec RECORD;
  matches uuid[];
  combined_text text;
  legacy_id uuid;
  inserted_count integer := 0;
  no_match_count integer := 0;
BEGIN
  FOR rec IN
    SELECT id, provider_id, test_name,
           COALESCE(category, '') AS category,
           COALESCE(source_section, '') AS source_section,
           COALESCE(canonical_category, '') AS canonical_category
    FROM public.provider_tests
    WHERE is_active = true
  LOOP
    combined_text := lower(concat_ws(' | ',
      rec.test_name, rec.category, rec.source_section, rec.canonical_category
    ));

    matches := public.resolve_categories_for_text(combined_text);

    IF rec.canonical_category <> '' THEN
      SELECT id INTO legacy_id FROM public.categories
      WHERE slug = CASE rec.canonical_category
        WHEN 'heart'              THEN 'heart-health'
        WHEN 'gut'                THEN 'gut-health'
        WHEN 'vitamins-minerals'  THEN 'vitamins'
        WHEN 'blood-health'       THEN 'general-health'
        WHEN 'liver-health'       THEN 'general-health'
        WHEN 'kidney-health'      THEN 'general-health'
        WHEN 'diabetes'           THEN 'general-health'
        WHEN 'sports-performance' THEN 'athletic-performance'
        ELSE rec.canonical_category
      END;
      IF legacy_id IS NOT NULL THEN
        matches := matches || ARRAY[legacy_id];
      END IF;
    END IF;

    -- Dedup
    matches := ARRAY(SELECT DISTINCT x FROM unnest(matches) AS x WHERE x IS NOT NULL);

    IF array_length(matches, 1) IS NULL THEN
      SELECT ARRAY[id] INTO matches FROM public.categories WHERE slug = 'general-health';
      no_match_count := no_match_count + 1;
    END IF;

    INSERT INTO public.category_test_mapping (category_id, provider_test_id, source, confidence)
    SELECT cat_id, rec.id, 'backfill', 0.8
    FROM unnest(matches) AS cat_id
    ON CONFLICT DO NOTHING;

    inserted_count := inserted_count + COALESCE(array_length(matches, 1), 0);
  END LOOP;

  RAISE NOTICE 'Backfill done: % mappings, % fallbacks', inserted_count, no_match_count;
END $$;

-- Explicit bowel/FIT classification
INSERT INTO public.category_test_mapping (category_id, provider_test_id, source, confidence)
SELECT c.id, pt.id, 'backfill', 1.0
FROM public.provider_tests pt
CROSS JOIN public.categories c
WHERE pt.is_active = true
  AND c.slug IN ('at-home','bowel-tests')
  AND (
    pt.test_name ILIKE '%bowel%'
    OR pt.test_name ILIKE '%fit test%'
    OR pt.test_name ILIKE '%qfit%'
    OR pt.test_name ILIKE '%faecal%'
    OR pt.test_name ILIKE '%fecal%'
    OR pt.test_name ILIKE '%occult blood%'
    OR pt.test_name ILIKE '%colorectal%'
    OR pt.test_name ILIKE '%microbiome%'
  )
ON CONFLICT DO NOTHING;

INSERT INTO public.category_test_mapping (category_id, provider_test_id, source, confidence)
SELECT c.id, pt.id, 'backfill', 1.0
FROM public.provider_tests pt
CROSS JOIN public.categories c
WHERE pt.is_active = true
  AND c.slug = 'bowel-cancer-screening'
  AND pt.test_name ILIKE '%bowel cancer%'
ON CONFLICT DO NOTHING;

INSERT INTO public.category_test_mapping (category_id, provider_test_id, source, confidence)
SELECT c.id, pt.id, 'backfill', 1.0
FROM public.provider_tests pt
CROSS JOIN public.categories c
WHERE pt.is_active = true
  AND c.slug = 'bowel-microbiome'
  AND pt.test_name ILIKE '%microbiome%'
ON CONFLICT DO NOTHING;

-- Auto-classify newly inserted tests via aliases
CREATE OR REPLACE FUNCTION public.provider_tests_autoclassify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  resolved_ids uuid[];
  combined text;
BEGIN
  IF NEW.is_active IS DISTINCT FROM true THEN
    RETURN NEW;
  END IF;

  combined := lower(concat_ws(' | ',
    NEW.test_name,
    COALESCE(NEW.category, ''),
    COALESCE(NEW.source_section, ''),
    COALESCE(NEW.canonical_category, '')
  ));

  resolved_ids := public.resolve_categories_for_text(combined);

  IF array_length(resolved_ids, 1) IS NULL THEN
    SELECT ARRAY[id] INTO resolved_ids FROM public.categories WHERE slug = 'general-health';
  END IF;

  INSERT INTO public.category_test_mapping (category_id, provider_test_id, source, confidence)
  SELECT cat_id, NEW.id, 'crawl', 0.7
  FROM unnest(resolved_ids) AS cat_id
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.provider_tests_autoclassify() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.provider_tests_autoclassify() TO service_role;

DROP TRIGGER IF EXISTS provider_tests_autoclassify_trg ON public.provider_tests;
CREATE TRIGGER provider_tests_autoclassify_trg
  AFTER INSERT ON public.provider_tests
  FOR EACH ROW EXECUTE FUNCTION public.provider_tests_autoclassify();

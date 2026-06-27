-- Re-fire classification when an active test's text fields change (re-crawls)
CREATE OR REPLACE FUNCTION public.provider_tests_autoclassify_upd()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  resolved_ids uuid[];
  combined text;
BEGIN
  IF NEW.is_active IS DISTINCT FROM true THEN
    RETURN NEW;
  END IF;

  IF NEW.test_name IS NOT DISTINCT FROM OLD.test_name
     AND NEW.category IS NOT DISTINCT FROM OLD.category
     AND NEW.source_section IS NOT DISTINCT FROM OLD.source_section
     AND NEW.canonical_category IS NOT DISTINCT FROM OLD.canonical_category
     AND NEW.is_active IS NOT DISTINCT FROM OLD.is_active THEN
    RETURN NEW;
  END IF;

  combined := lower(concat_ws(' | ',
    NEW.test_name,
    COALESCE(NEW.category,''),
    COALESCE(NEW.source_section,''),
    COALESCE(NEW.canonical_category,'')
  ));
  resolved_ids := public.resolve_categories_for_text(combined);
  IF array_length(resolved_ids,1) IS NULL THEN
    SELECT ARRAY[id] INTO resolved_ids FROM public.categories WHERE slug='general-health';
  END IF;

  INSERT INTO public.category_test_mapping (category_id, provider_test_id, source, confidence)
  SELECT cat_id, NEW.id, 'crawl', 0.7
  FROM unnest(resolved_ids) AS cat_id
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS provider_tests_autoclassify_upd_trg ON public.provider_tests;
CREATE TRIGGER provider_tests_autoclassify_upd_trg
AFTER UPDATE ON public.provider_tests
FOR EACH ROW EXECUTE FUNCTION public.provider_tests_autoclassify_upd();

-- Auto-fill canonical_category on provider_tests when missing.
-- Strategy: derive from source_section via resolve_canonical_category(),
-- otherwise map from the existing free-text 'category' field.

CREATE OR REPLACE FUNCTION public.category_text_to_canonical(_category text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN _category IS NULL THEN NULL
    WHEN lower(_category) ~ '(women|female|menopause|pcos|well\s*woman)' THEN 'womens-health'
    WHEN lower(_category) ~ '(men''?s|^men |male|prostate|well\s*man)' THEN 'mens-health'
    WHEN lower(_category) ~ 'fertility|amh' THEN 'fertility'
    WHEN lower(_category) ~ '(sexual|sti|std)' THEN 'sexual-health'
    WHEN lower(_category) ~ 'thyroid' THEN 'thyroid'
    WHEN lower(_category) ~ '(heart|cardio|lipid|cholesterol)' THEN 'heart'
    WHEN lower(_category) ~ '(gut|digest|microbiome)' THEN 'gut'
    WHEN lower(_category) ~ '(vitamin|mineral|nutrient)' THEN 'vitamins'
    WHEN lower(_category) ~ 'hormon' THEN 'hormones'
    WHEN lower(_category) ~ '(cancer|tumour|tumor)' THEN 'cancer-screening'
    WHEN lower(_category) ~ '(sport|fitness|athlete|performance)' THEN 'sports-performance'
    WHEN lower(_category) ~ '(home|kit|at-home)' THEN 'at-home'
    ELSE 'general-health'
  END;
$$;

CREATE OR REPLACE FUNCTION public.provider_tests_autoset_canonical()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.canonical_category IS NULL OR NEW.canonical_category = '' THEN
    IF NEW.source_section IS NOT NULL AND NEW.source_section <> '' THEN
      NEW.canonical_category := public.resolve_canonical_category(NEW.provider_id, NEW.source_section);
    END IF;
    IF NEW.canonical_category IS NULL OR NEW.canonical_category = '' THEN
      NEW.canonical_category := public.category_text_to_canonical(NEW.category);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_provider_tests_autoset_canonical ON public.provider_tests;
CREATE TRIGGER trg_provider_tests_autoset_canonical
BEFORE INSERT OR UPDATE ON public.provider_tests
FOR EACH ROW
EXECUTE FUNCTION public.provider_tests_autoset_canonical();

-- Backfill existing rows
UPDATE public.provider_tests
SET canonical_category = public.category_text_to_canonical(category)
WHERE canonical_category IS NULL OR canonical_category = '';

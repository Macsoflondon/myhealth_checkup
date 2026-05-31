CREATE OR REPLACE FUNCTION public.resolve_canonical_category(
  _provider_id TEXT,
  _source_section TEXT
) RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result TEXT;
  norm TEXT;
BEGIN
  IF _source_section IS NULL OR _source_section = '' THEN
    RETURN NULL;
  END IF;
  norm := lower(regexp_replace(_source_section, '[^a-z0-9-]+', '-', 'gi'));
  norm := regexp_replace(norm, '^-+|-+$', '', 'g');

  SELECT canonical_category INTO result
    FROM public.provider_section_category_map
    WHERE provider_id = _provider_id AND source_section = norm
    LIMIT 1;

  IF result IS NOT NULL THEN RETURN result; END IF;

  result := CASE
    WHEN norm ~ '(women|female|gynae|menopause|pcos)' THEN 'womens-health'
    WHEN norm ~ '(men|male|prostate|testosterone)' THEN 'mens-health'
    WHEN norm ~ '(fertility|amh|conception)' THEN 'fertility'
    WHEN norm ~ '(sexual|sti|std)' THEN 'sexual-health'
    WHEN norm ~ 'thyroid' THEN 'thyroid'
    WHEN norm ~ '(heart|cardio|lipid|cholesterol)' THEN 'heart'
    WHEN norm ~ '(gut|digest|microbiome)' THEN 'gut'
    WHEN norm ~ '(vitamin|mineral|nutrient)' THEN 'vitamins'
    WHEN norm ~ 'hormon' THEN 'hormones'
    WHEN norm ~ '(cancer|tumour|tumor)' THEN 'cancer-screening'
    WHEN norm ~ '(sport|fitness|athlete|performance)' THEN 'sports-performance'
    WHEN norm ~ '(diabet|glucose|hba1c)' THEN 'general-health'
    WHEN norm ~ '(general|wellness|everyday|complete|full)' THEN 'general-health'
    WHEN norm ~ '(home|kit|at-home)' THEN 'at-home'
    ELSE NULL
  END;

  IF result IS NOT NULL THEN
    INSERT INTO public.provider_section_category_map (provider_id, source_section, canonical_category, needs_review)
    VALUES (_provider_id, norm, result, true)
    ON CONFLICT (provider_id, source_section) DO NOTHING;
  END IF;

  RETURN result;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.resolve_canonical_category(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.resolve_canonical_category(TEXT, TEXT) TO service_role;

INSERT INTO public.provider_section_category_map (provider_id, source_section, canonical_category) VALUES
  ('goodbody-clinic', 'womens-health', 'womens-health'),
  ('goodbody-clinic', 'mens-health', 'mens-health'),
  ('goodbody-clinic', 'hormones', 'hormones'),
  ('goodbody-clinic', 'thyroid', 'thyroid'),
  ('goodbody-clinic', 'cancer', 'cancer-screening'),
  ('goodbody-clinic', 'fertility', 'fertility'),
  ('goodbody-clinic', 'general-health', 'general-health'),
  ('london-health-company', 'womens-health', 'womens-health'),
  ('london-health-company', 'mens-health', 'mens-health'),
  ('london-health-company', 'general-health', 'general-health'),
  ('london-health-company', 'hormones', 'hormones')
ON CONFLICT (provider_id, source_section) DO NOTHING;

-- Backfill (non-volatile-safe: do it in a DO block invoking the function row-by-row is fine in plain SQL update too now)
UPDATE public.provider_tests pt
SET canonical_category = public.resolve_canonical_category(pt.provider_id, COALESCE(pt.source_section, pt.category))
WHERE pt.canonical_category IS NULL;

-- Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 1. Schema additions to provider_tests
ALTER TABLE public.provider_tests
  ADD COLUMN IF NOT EXISTS source_section TEXT,
  ADD COLUMN IF NOT EXISTS source_section_label TEXT,
  ADD COLUMN IF NOT EXISTS canonical_category TEXT;

CREATE INDEX IF NOT EXISTS idx_provider_tests_canonical
  ON public.provider_tests(canonical_category, is_active, provider_id)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_provider_tests_test_name_trgm
  ON public.provider_tests USING gin (test_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_tests_master_test_name_trgm
  ON public.tests_master USING gin (test_name gin_trgm_ops);

-- 2. provider_section_category_map
CREATE TABLE IF NOT EXISTS public.provider_section_category_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id TEXT NOT NULL,
  source_section TEXT NOT NULL,
  canonical_category TEXT NOT NULL,
  needs_review BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider_id, source_section)
);

GRANT SELECT ON public.provider_section_category_map TO anon, authenticated;
GRANT ALL ON public.provider_section_category_map TO service_role;

ALTER TABLE public.provider_section_category_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read section map"
  ON public.provider_section_category_map FOR SELECT
  USING (true);

CREATE POLICY "Admins manage section map"
  ON public.provider_section_category_map FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_provider_section_category_map_updated
  BEFORE UPDATE ON public.provider_section_category_map
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. scrape_run_log
CREATE TABLE IF NOT EXISTS public.scrape_run_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running',
  providers_run INTEGER DEFAULT 0,
  tests_scraped INTEGER DEFAULT 0,
  tests_promoted INTEGER DEFAULT 0,
  mappings_upserted INTEGER DEFAULT 0,
  verification_failures INTEGER DEFAULT 0,
  details JSONB,
  trigger_source TEXT
);

GRANT SELECT ON public.scrape_run_log TO authenticated;
GRANT ALL ON public.scrape_run_log TO service_role;

ALTER TABLE public.scrape_run_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view scrape runs"
  ON public.scrape_run_log FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Service role write access for promote function
GRANT INSERT, UPDATE ON public.tests_master TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.provider_test_mapping TO service_role;
GRANT UPDATE ON public.provider_tests TO service_role;

-- 5. Seed common section mappings for all 9 providers
INSERT INTO public.provider_section_category_map (provider_id, source_section, canonical_category) VALUES
  -- Medichecks
  ('medichecks', 'womens-health', 'womens-health'),
  ('medichecks', 'mens-health', 'mens-health'),
  ('medichecks', 'fertility', 'fertility'),
  ('medichecks', 'sexual-health', 'sexual-health'),
  ('medichecks', 'hormones', 'hormones'),
  ('medichecks', 'thyroid', 'thyroid'),
  ('medichecks', 'heart-health', 'heart'),
  ('medichecks', 'gut-health', 'gut'),
  ('medichecks', 'vitamins-minerals', 'vitamins'),
  ('medichecks', 'general-health', 'general-health'),
  ('medichecks', 'sports-fitness', 'sports-performance'),
  ('medichecks', 'cancer-screening', 'cancer-screening'),
  -- Thriva
  ('thriva', 'womens-health', 'womens-health'),
  ('thriva', 'mens-health', 'mens-health'),
  ('thriva', 'hormones', 'hormones'),
  ('thriva', 'thyroid', 'thyroid'),
  ('thriva', 'general-wellness', 'general-health'),
  -- Goodbody
  ('goodbody', 'womens-health', 'womens-health'),
  ('goodbody', 'mens-health', 'mens-health'),
  ('goodbody', 'hormones', 'hormones'),
  ('goodbody', 'thyroid', 'thyroid'),
  ('goodbody', 'cancer', 'cancer-screening'),
  -- Lola Health
  ('lola-health', 'womens-health', 'womens-health'),
  ('lola-health', 'fertility', 'fertility'),
  ('lola-health', 'hormones', 'hormones'),
  ('lola-health', 'menopause', 'womens-health'),
  -- Randox
  ('randox', 'womens-health', 'womens-health'),
  ('randox', 'mens-health', 'mens-health'),
  ('randox', 'everyday-health', 'general-health'),
  ('randox', 'sports-performance', 'sports-performance'),
  -- London Medical Laboratory
  ('london-medical-laboratory', 'womens-health', 'womens-health'),
  ('london-medical-laboratory', 'mens-health', 'mens-health'),
  ('london-medical-laboratory', 'general-health', 'general-health'),
  -- Clinilabs
  ('clinilabs', 'womens-health', 'womens-health'),
  ('clinilabs', 'mens-health', 'mens-health'),
  -- Medical Diagnosis
  ('medical-diagnosis', 'womens-health', 'womens-health'),
  ('medical-diagnosis', 'mens-health', 'mens-health')
ON CONFLICT (provider_id, source_section) DO NOTHING;

-- 6. Section resolver function
CREATE OR REPLACE FUNCTION public.resolve_canonical_category(
  _provider_id TEXT,
  _source_section TEXT
) RETURNS TEXT
LANGUAGE plpgsql
STABLE
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
  
  -- Fallback alias matching
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
  
  -- Auto-record for admin review
  IF result IS NOT NULL THEN
    INSERT INTO public.provider_section_category_map (provider_id, source_section, canonical_category, needs_review)
    VALUES (_provider_id, norm, result, true)
    ON CONFLICT (provider_id, source_section) DO NOTHING;
  END IF;
  
  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.resolve_canonical_category(TEXT, TEXT) TO anon, authenticated, service_role;

-- 7. Backfill canonical_category from existing category column where possible
UPDATE public.provider_tests
SET canonical_category = CASE
  WHEN lower(category) IN ('womens-health','women''s health','women') THEN 'womens-health'
  WHEN lower(category) IN ('mens-health','men''s health','men') THEN 'mens-health'
  WHEN lower(category) LIKE '%fertility%' THEN 'fertility'
  WHEN lower(category) LIKE '%sexual%' THEN 'sexual-health'
  WHEN lower(category) LIKE '%thyroid%' THEN 'thyroid'
  WHEN lower(category) LIKE '%heart%' OR lower(category) LIKE '%cardio%' THEN 'heart'
  WHEN lower(category) LIKE '%gut%' THEN 'gut'
  WHEN lower(category) LIKE '%vitamin%' THEN 'vitamins'
  WHEN lower(category) LIKE '%hormon%' THEN 'hormones'
  WHEN lower(category) LIKE '%cancer%' THEN 'cancer-screening'
  WHEN lower(category) LIKE '%sport%' OR lower(category) LIKE '%fitness%' THEN 'sports-performance'
  WHEN lower(category) LIKE '%general%' OR lower(category) LIKE '%wellness%' THEN 'general-health'
  ELSE canonical_category
END
WHERE canonical_category IS NULL AND category IS NOT NULL;

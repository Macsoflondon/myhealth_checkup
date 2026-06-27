
-- 0. Repair: extend the trigger's search_path so ltree resolves.
CREATE OR REPLACE FUNCTION public.categories_set_path()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  parent_path extensions.ltree;
  parent_level integer;
  safe_slug text;
BEGIN
  safe_slug := regexp_replace(lower(NEW.slug), '[^a-z0-9_]+', '_', 'g');
  IF NEW.parent_id IS NULL THEN
    NEW.level := 0;
    NEW.path := safe_slug::extensions.ltree;
  ELSE
    SELECT path, level INTO parent_path, parent_level
    FROM public.categories WHERE id = NEW.parent_id;
    IF parent_path IS NULL THEN
      RAISE EXCEPTION 'Parent category % has no path', NEW.parent_id;
    END IF;
    NEW.level := parent_level + 1;
    NEW.path := parent_path || safe_slug::extensions.ltree;
  END IF;
  RETURN NEW;
END;
$function$;

-- 1. Insert 8 missing top-level categories.
INSERT INTO public.categories (slug, name, parent_id, is_active, description) VALUES
  ('diabetes',                 'Diabetes',                 NULL, true, 'Blood sugar, HbA1c and insulin testing'),
  ('liver',                    'Liver Health',             NULL, true, 'Liver function and enzyme testing'),
  ('kidney-health',            'Kidney Health',            NULL, true, 'Kidney function and renal testing'),
  ('blood-tests',              'Blood Tests',              NULL, true, 'Full blood count and haematology panels'),
  ('genetic-testing',          'Genetic Testing',          NULL, true, 'DNA-based predisposition and ancestry testing'),
  ('longevity-tests',          'Longevity Tests',          NULL, true, 'Biological age and healthy ageing markers'),
  ('weight-loss-tests',        'Weight Loss Tests',        NULL, true, 'Metabolic and weight management testing'),
  ('sports-performance-tests', 'Sports Performance Tests', NULL, true, 'Athletic performance and recovery testing')
ON CONFLICT (slug) DO NOTHING;

-- 2. Alias keywords for the autoclassify trigger.
WITH c AS (SELECT id, slug FROM public.categories)
INSERT INTO public.category_aliases (category_id, alias, match_type)
SELECT c.id, v.alias, 'contains'
FROM c
JOIN (VALUES
  ('diabetes','diabetes'), ('diabetes','hba1c'), ('diabetes','glucose'), ('diabetes','insulin'),
  ('liver','liver'), ('liver','hepatic'), ('liver','alt'), ('liver','ast'), ('liver','bilirubin'),
  ('kidney-health','kidney'), ('kidney-health','renal'), ('kidney-health','creatinine'), ('kidney-health','egfr'),
  ('blood-tests','full blood count'), ('blood-tests','fbc'), ('blood-tests','haematology'), ('blood-tests','blood count'),
  ('genetic-testing','genetic'), ('genetic-testing','dna'), ('genetic-testing','genome'), ('genetic-testing','hereditary'),
  ('longevity-tests','longevity'), ('longevity-tests','biological age'), ('longevity-tests','healthy ageing'),
  ('weight-loss-tests','weight loss'), ('weight-loss-tests','weight management'), ('weight-loss-tests','metabolic health'),
  ('sports-performance-tests','sports performance'), ('sports-performance-tests','athletic'), ('sports-performance-tests','athlete')
) AS v(slug, alias) ON v.slug = c.slug
ON CONFLICT DO NOTHING;

-- 3. Slug-redirect table for legacy nav links.
CREATE TABLE IF NOT EXISTS public.category_slug_redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_slug text UNIQUE NOT NULL,
  to_slug   text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.category_slug_redirects TO anon, authenticated;
GRANT ALL ON public.category_slug_redirects TO service_role;

ALTER TABLE public.category_slug_redirects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Slug redirects are public read" ON public.category_slug_redirects;
CREATE POLICY "Slug redirects are public read"
  ON public.category_slug_redirects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage slug redirects" ON public.category_slug_redirects;
CREATE POLICY "Admins manage slug redirects"
  ON public.category_slug_redirects FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.category_slug_redirects (from_slug, to_slug) VALUES
  ('female-hormones',  'hormones'),
  ('male-hormones',    'hormones'),
  ('testosterone',     'hormones'),
  ('female-fertility', 'fertility'),
  ('male-fertility',   'fertility'),
  ('amh',              'fertility'),
  ('pcos',             'womens-health'),
  ('menopause',        'womens-health'),
  ('prostate',         'mens-health')
ON CONFLICT (from_slug) DO UPDATE SET to_slug = EXCLUDED.to_slug;

-- 4. Re-fire autoclassify trigger on all active provider_tests.
UPDATE public.provider_tests
   SET updated_at = now()
 WHERE is_active = true;


-- Phase 1: Taxonomy completion
-- The bulk of the requested categories already exist under at-home and sports-fitness.
-- This migration: adds saliva-tests, fixes overlap aliases, consolidates the
-- empty sports-performance-tests top-level into sports-fitness via a redirect,
-- and registers slug redirects for nav variants.

-- 1. Add saliva-tests as a sibling under at-home (separate from bowel-tests)
DO $$
DECLARE
  v_athome uuid;
  v_saliva uuid;
BEGIN
  SELECT id INTO v_athome FROM public.categories WHERE slug='at-home';

  INSERT INTO public.categories (slug, name, parent_id, is_active)
  VALUES ('saliva-tests', 'Saliva Tests', v_athome, true)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id
  RETURNING id INTO v_saliva;

  IF v_saliva IS NULL THEN
    SELECT id INTO v_saliva FROM public.categories WHERE slug='saliva-tests';
  END IF;

  INSERT INTO public.category_aliases (category_id, alias, match_type)
  VALUES
    (v_saliva, 'saliva', 'contains'),
    (v_saliva, 'oral swab', 'contains'),
    (v_saliva, 'buccal swab', 'contains')
  ON CONFLICT DO NOTHING;
END $$;

-- 2. Fix overlap: 'gut' should route to gut-health, NOT bowel-tests
DELETE FROM public.category_aliases ca
USING public.categories c
WHERE ca.category_id = c.id
  AND c.slug = 'bowel-tests'
  AND ca.alias = 'gut';

-- Ensure gut-health captures gut aliases
INSERT INTO public.category_aliases (category_id, alias, match_type)
SELECT id, x.alias, 'contains' FROM public.categories,
  (VALUES ('gut'), ('microbiome'), ('digestive')) AS x(alias)
WHERE slug='gut-health'
ON CONFLICT DO NOTHING;

-- 3. Consolidate empty sports-performance-tests top-level into sports-fitness
DO $$
DECLARE
  v_old uuid;
  v_new uuid;
BEGIN
  SELECT id INTO v_old FROM public.categories WHERE slug='sports-performance-tests' AND parent_id IS NULL;
  SELECT id INTO v_new FROM public.categories WHERE slug='sports-fitness';

  IF v_old IS NOT NULL AND v_new IS NOT NULL THEN
    -- Move any test mappings over (idempotent)
    UPDATE public.category_test_mapping
       SET category_id = v_new
     WHERE category_id = v_old
       AND NOT EXISTS (
         SELECT 1 FROM public.category_test_mapping m2
         WHERE m2.provider_test_id = category_test_mapping.provider_test_id
           AND m2.category_id = v_new
       );
    DELETE FROM public.category_test_mapping WHERE category_id = v_old;
    DELETE FROM public.category_aliases WHERE category_id = v_old;
    DELETE FROM public.categories WHERE id = v_old;
  END IF;
END $$;

-- 4. Slug redirects for nav variants the user requested + legacy nav-only slugs
INSERT INTO public.category_slug_redirects (from_slug, to_slug)
VALUES
  ('at-home-tests',            'at-home'),
  ('finger-prick-tests',       'finger-prick'),
  ('sports-performance-tests', 'sports-fitness'),
  ('sports-performance',       'sports-fitness'),
  ('bowel',                    'bowel-tests'),
  ('saliva',                   'saliva-tests'),
  ('urine',                    'urine-tests'),
  ('cervical',                 'cancer-screening'),
  ('lung',                     'cancer-screening'),
  ('womens',                   'womens-health'),
  ('mens',                     'mens-health'),
  ('general',                  'general-health'),
  ('allergy',                  'allergy-testing'),
  ('kidney',                   'kidney-health'),
  ('heart',                    'heart-health'),
  ('gut',                      'gut-health')
ON CONFLICT (from_slug) DO UPDATE SET to_slug = EXCLUDED.to_slug;

-- 5. Backfill: re-run the autoclassifier across all active tests so new
-- aliases (saliva, fixed gut/bowel split) take effect immediately.
UPDATE public.provider_tests
   SET updated_at = now()
 WHERE is_active = true;

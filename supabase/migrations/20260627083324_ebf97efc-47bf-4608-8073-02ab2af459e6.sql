INSERT INTO public.category_slug_redirects (from_slug, to_slug) VALUES
  ('heart',  'heart-health'),
  ('cancer', 'cancer-screening'),
  ('gut',    'gut-health')
ON CONFLICT (from_slug) DO UPDATE SET to_slug = EXCLUDED.to_slug;
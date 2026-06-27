-- Tighten over-greedy short aliases by converting to regex with word boundaries.
-- Postgres POSIX regex word boundary is \y (since aliases are matched via `~`).
UPDATE public.category_aliases ca
SET match_type = 'regex',
    alias = '\y' || alias || '\y'
FROM public.categories c
WHERE ca.category_id = c.id
  AND ca.match_type = 'contains'
  AND (
        (c.slug = 'liver'           AND ca.alias IN ('alt','ast'))
     OR (c.slug = 'kidney-health'   AND ca.alias IN ('renal','egfr'))
     OR (c.slug = 'blood-tests'     AND ca.alias IN ('fbc'))
     OR (c.slug = 'genetic-testing' AND ca.alias IN ('dna'))
     OR (c.slug = 'diabetes'        AND ca.alias IN ('hba1c'))
  );

-- Re-run classification for affected tests so over-matched mappings get cleaned up.
-- Remove existing crawl-sourced mappings to liver/kidney-health/blood-tests/genetic-testing/diabetes,
-- then re-trigger the autoclassifier.
DELETE FROM public.category_test_mapping ctm
USING public.categories c
WHERE ctm.category_id = c.id
  AND ctm.source = 'crawl'
  AND c.slug IN ('liver','kidney-health','blood-tests','genetic-testing','diabetes');

-- Re-fire trigger for active provider_tests so resolve_categories_for_text repopulates mappings.
UPDATE public.provider_tests SET updated_at = now() WHERE is_active = true;

-- Per-provider explicit category mapping; remove generic regex fallback

CREATE OR REPLACE FUNCTION public.resolve_canonical_category(_provider_id text, _source_section text)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result text;
  norm text;
BEGIN
  IF _source_section IS NULL OR _source_section = '' THEN
    RETURN NULL;
  END IF;
  norm := regexp_replace(lower(_source_section), '[^a-z0-9-]+', '-', 'g');
  norm := regexp_replace(norm, '^-+|-+$', '', 'g');
  IF norm = '' THEN RETURN NULL; END IF;

  SELECT canonical_category INTO result
  FROM public.provider_section_category_map
  WHERE provider_id = _provider_id AND source_section = norm
  LIMIT 1;

  RETURN result;
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
    IF (NEW.canonical_category IS NULL OR NEW.canonical_category = '')
       AND NEW.category IS NOT NULL AND NEW.category <> '' THEN
      NEW.canonical_category := public.resolve_canonical_category(NEW.provider_id, NEW.category);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Seed per-provider mapping from existing well-aligned data so every active
-- (provider_id, normalised category) pair has an explicit rule.
WITH agg AS (
  SELECT
    provider_id,
    regexp_replace(
      regexp_replace(lower(COALESCE(source_section, category)), '[^a-z0-9-]+', '-', 'g'),
      '^-+|-+$', '', 'g'
    ) AS norm_section,
    canonical_category,
    COUNT(*) AS n
  FROM public.provider_tests
  WHERE is_active = true
    AND COALESCE(source_section, category) IS NOT NULL
    AND canonical_category IS NOT NULL
  GROUP BY 1, 2, 3
),
ranked AS (
  SELECT *,
         row_number() OVER (PARTITION BY provider_id, norm_section ORDER BY n DESC) AS rn
  FROM agg
)
INSERT INTO public.provider_section_category_map (provider_id, source_section, canonical_category, needs_review)
SELECT provider_id, norm_section, canonical_category, false
FROM ranked
WHERE rn = 1 AND norm_section <> ''
ON CONFLICT (provider_id, source_section) DO NOTHING;

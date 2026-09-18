-- Populate in priority order: the first method that resolves a label wins.
-- Every source list item becomes exactly one row here, matched or not.

WITH items AS (
  SELECT pt.id AS provider_test_id, item AS raw_label,
         lower(trim(item)) AS n,
         lower(trim(both '*' from trim(regexp_replace(item, '^#{1,6}\s*', '')))) AS md_stripped,
         lower(trim(substring(item from '\(([^)]+)\)$'))) AS paren_content,
         lower(trim(regexp_replace(item, '\s*\([^)]*\)\s*$', ''))) AS pre_paren
  FROM public.provider_tests pt, jsonb_array_elements_text(pt.biomarkers_list) item
  WHERE pt.biomarkers_list IS NOT NULL
),
resolved AS (
  SELECT i.provider_test_id, i.raw_label,
    COALESCE(
      (SELECT h.id FROM public.biomarker_hub h WHERE h.status<>'duplicate' AND lower(trim(h.name)) = i.n LIMIT 1),
      (SELECT h.id FROM public.biomarker_hub h, unnest(h.synonyms) s WHERE h.status<>'duplicate' AND lower(trim(s)) = i.n LIMIT 1),
      (SELECT h.id FROM public.biomarker_hub h WHERE h.status<>'duplicate' AND lower(trim(h.abbreviation)) = i.n LIMIT 1),
      (SELECT h.id FROM public.biomarker_hub h WHERE h.status<>'duplicate' AND lower(trim(h.name)) = i.md_stripped LIMIT 1),
      (SELECT h.id FROM public.biomarker_hub h WHERE h.status<>'duplicate' AND lower(trim(h.abbreviation)) = i.md_stripped LIMIT 1),
      (SELECT h.id FROM public.biomarker_hub h WHERE i.paren_content IS NOT NULL AND h.status<>'duplicate' AND lower(trim(h.abbreviation)) = i.paren_content LIMIT 1),
      (SELECT h.id FROM public.biomarker_hub h WHERE i.paren_content IS NOT NULL AND h.status<>'duplicate' AND lower(trim(h.name)) = i.paren_content LIMIT 1),
      (SELECT h.id FROM public.biomarker_hub h WHERE i.pre_paren <> i.n AND h.status<>'duplicate' AND lower(trim(h.name)) = i.pre_paren LIMIT 1),
      (SELECT h.id FROM public.biomarker_hub h, unnest(h.synonyms) s WHERE i.pre_paren <> i.n AND h.status<>'duplicate' AND lower(trim(s)) = i.pre_paren LIMIT 1)
    ) AS biomarker_id,
    CASE
      WHEN EXISTS (SELECT 1 FROM public.biomarker_hub h WHERE h.status<>'duplicate' AND lower(trim(h.name)) = i.n) THEN 'exact_name'
      WHEN EXISTS (SELECT 1 FROM public.biomarker_hub h, unnest(h.synonyms) s WHERE h.status<>'duplicate' AND lower(trim(s)) = i.n) THEN 'exact_synonym'
      WHEN EXISTS (SELECT 1 FROM public.biomarker_hub h WHERE h.status<>'duplicate' AND lower(trim(h.abbreviation)) = i.n) THEN 'exact_abbreviation'
      WHEN EXISTS (SELECT 1 FROM public.biomarker_hub h WHERE h.status<>'duplicate' AND (lower(trim(h.name)) = i.md_stripped OR lower(trim(h.abbreviation)) = i.md_stripped)) THEN 'markdown_stripped'
      WHEN i.paren_content IS NOT NULL AND EXISTS (SELECT 1 FROM public.biomarker_hub h WHERE h.status<>'duplicate' AND (lower(trim(h.abbreviation)) = i.paren_content OR lower(trim(h.name)) = i.paren_content)) THEN 'parenthetical_content'
      WHEN i.pre_paren <> i.n AND EXISTS (SELECT 1 FROM public.biomarker_hub h WHERE h.status<>'duplicate' AND lower(trim(h.name)) = i.pre_paren) THEN 'pre_parenthetical'
      WHEN i.pre_paren <> i.n AND EXISTS (SELECT 1 FROM public.biomarker_hub h, unnest(h.synonyms) s WHERE h.status<>'duplicate' AND lower(trim(s)) = i.pre_paren) THEN 'pre_parenthetical'
      ELSE 'unmatched'
    END AS match_method
  FROM items i
)
INSERT INTO public.provider_test_biomarkers (provider_test_id, biomarker_id, raw_label, match_method)
SELECT provider_test_id, biomarker_id, raw_label, match_method
FROM resolved
ON CONFLICT (provider_test_id, raw_label) DO NOTHING;
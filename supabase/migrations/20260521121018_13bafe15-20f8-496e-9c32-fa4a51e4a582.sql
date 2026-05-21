UPDATE public.provider_tests
SET image_url = NULL, updated_at = now()
WHERE provider_id = 'randox'
  AND (
    lower(image_url) LIKE '%/gb.png'
    OR (lower(image_url) LIKE '%rdxhealthfrontdoor%' AND lower(image_url) LIKE '%/image/gb%')
  );
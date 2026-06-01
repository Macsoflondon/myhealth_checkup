
UPDATE public.provider_tests
SET description = trim(regexp_replace(description, '\s*Buy Online[^.]*\.?\s*$', '', 'i'))
WHERE provider_id = 'goodbody-clinic' AND description ~* 'Buy Online';

-- "Cholesterol" (4 providers) and "Total Cholesterol" (7 providers) are the
-- same measurement. Without this, compare_biomarker?biomarker=cholesterol
-- answered from the smaller row. Same approach as
-- 20260927200639_public_api_v1_correctness_pass: canonical_id only, status
-- stays active, so the site's biomarker library is unchanged.
UPDATE public.biomarker_hub
   SET canonical_id = '6a9939ca-3442-46ff-bad0-2c7ffb93c24c'::uuid
 WHERE id = '53be27e1-05c5-4eeb-8530-f7840458dbe0'::uuid
   AND status <> 'duplicate'
   AND canonical_id IS NULL;

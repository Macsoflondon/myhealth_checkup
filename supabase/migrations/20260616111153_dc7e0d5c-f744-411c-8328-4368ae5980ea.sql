-- 1) Add structured columns to provider_test_mapping
ALTER TABLE public.provider_test_mapping
  ADD COLUMN IF NOT EXISTS sample_type            text,
  ADD COLUMN IF NOT EXISTS collection_method      text,
  ADD COLUMN IF NOT EXISTS collection_fee_type    text,
  ADD COLUMN IF NOT EXISTS collection_fee_amount  numeric(6,2),
  ADD COLUMN IF NOT EXISTS clinical_review_type   text,
  ADD COLUMN IF NOT EXISTS clinical_review_fee    numeric(6,2);

-- Mirror new columns on provider_tests (existing sample_type left untouched)
ALTER TABLE public.provider_tests
  ADD COLUMN IF NOT EXISTS collection_method      text,
  ADD COLUMN IF NOT EXISTS collection_fee_type    text,
  ADD COLUMN IF NOT EXISTS collection_fee_amount  numeric(6,2),
  ADD COLUMN IF NOT EXISTS clinical_review_type   text,
  ADD COLUMN IF NOT EXISTS clinical_review_fee    numeric(6,2);

-- 2) CHECK constraints on curated mapping table only
ALTER TABLE public.provider_test_mapping DROP CONSTRAINT IF EXISTS ptm_sample_type_chk;
ALTER TABLE public.provider_test_mapping
  ADD CONSTRAINT ptm_sample_type_chk
  CHECK (sample_type IS NULL OR sample_type IN
    ('finger_prick','venous','saliva','urine','stool','buccal_swab','multiple'));

ALTER TABLE public.provider_test_mapping DROP CONSTRAINT IF EXISTS ptm_collection_method_chk;
ALTER TABLE public.provider_test_mapping
  ADD CONSTRAINT ptm_collection_method_chk
  CHECK (collection_method IS NULL OR collection_method IN
    ('home_kit','clinic','home_visit','mobile_phleb','third_party_phleb','self_arranged','multiple'));

ALTER TABLE public.provider_test_mapping DROP CONSTRAINT IF EXISTS ptm_collection_fee_type_chk;
ALTER TABLE public.provider_test_mapping
  ADD CONSTRAINT ptm_collection_fee_type_chk
  CHECK (collection_fee_type IS NULL OR collection_fee_type IN
    ('none','fixed','from','varies','self_arranged'));

ALTER TABLE public.provider_test_mapping DROP CONSTRAINT IF EXISTS ptm_clinical_review_type_chk;
ALTER TABLE public.provider_test_mapping
  ADD CONSTRAINT ptm_clinical_review_type_chk
  CHECK (clinical_review_type IS NULL OR clinical_review_type IN
    ('included','optional','gp_included','consultant_included','clinician_included','not_included','not_available'));

-- 3) Backfill from legacy free-text sample_collection_method
UPDATE public.provider_test_mapping
SET sample_type = CASE
  WHEN sample_type IS NOT NULL THEN sample_type
  WHEN sample_collection_method IS NULL THEN NULL
  WHEN lower(sample_collection_method) ~ 'finger|capillary' THEN 'finger_prick'
  WHEN lower(sample_collection_method) ~ 'venous|venepuncture|phlebotom|blood draw' THEN 'venous'
  WHEN lower(sample_collection_method) ~ 'saliva' THEN 'saliva'
  WHEN lower(sample_collection_method) ~ 'urine' THEN 'urine'
  WHEN lower(sample_collection_method) ~ 'stool|faecal|fecal' THEN 'stool'
  WHEN lower(sample_collection_method) ~ 'swab|buccal' THEN 'buccal_swab'
  ELSE NULL
END,
collection_method = CASE
  WHEN collection_method IS NOT NULL THEN collection_method
  WHEN sample_collection_method IS NULL THEN NULL
  WHEN lower(sample_collection_method) ~ 'home.*kit|at.?home|finger' THEN 'home_kit'
  WHEN lower(sample_collection_method) ~ 'clinic|in.?clinic' THEN 'clinic'
  WHEN lower(sample_collection_method) ~ 'home visit|mobile' THEN 'home_visit'
  WHEN lower(sample_collection_method) ~ 'self.?arrang|own phlebotom' THEN 'self_arranged'
  WHEN lower(sample_collection_method) ~ 'third.?party|3rd' THEN 'third_party_phleb'
  ELSE NULL
END
WHERE sample_type IS NULL OR collection_method IS NULL;

-- 4) Indexes for filtering
CREATE INDEX IF NOT EXISTS idx_ptm_sample_type ON public.provider_test_mapping(sample_type);
CREATE INDEX IF NOT EXISTS idx_ptm_collection_method ON public.provider_test_mapping(collection_method);
CREATE INDEX IF NOT EXISTS idx_ptm_clinical_review ON public.provider_test_mapping(clinical_review_type);
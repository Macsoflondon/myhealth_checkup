ALTER TABLE public.provider_tests
  ADD COLUMN IF NOT EXISTS measurement_type text NOT NULL DEFAULT 'biomarkers';

ALTER TABLE public.provider_tests
  DROP CONSTRAINT IF EXISTS provider_tests_measurement_type_check;

ALTER TABLE public.provider_tests
  ADD CONSTRAINT provider_tests_measurement_type_check
  CHECK (measurement_type IN ('biomarkers', 'cancers', 'allergens', 'conditions'));

COMMENT ON COLUMN public.provider_tests.measurement_type IS
  'What biomarker_count/biomarkers_list actually enumerates: individual biomarkers, cancer types screened, allergens tested, or conditions screened.';
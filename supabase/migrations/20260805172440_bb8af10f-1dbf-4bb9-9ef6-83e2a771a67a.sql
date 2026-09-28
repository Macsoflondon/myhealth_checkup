-- Replay adaptation (2026-09-28): production had already gained these six columns
-- outside any migration when this ran; its column order puts them immediately before
-- measurement_type. Adding them here reproduces production exactly on a fresh
-- database. No-op wherever they exist. See docs/MIGRATION_RECONCILIATION.md.
ALTER TABLE public.provider_tests
  ADD COLUMN IF NOT EXISTS home_phlebotomy_option boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS home_phlebotomy_cost numeric(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS clinic_phlebotomy_cost numeric(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS gp_review_included boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS test_type text DEFAULT 'Blood'::text,
  ADD COLUMN IF NOT EXISTS purchase_notes text;

ALTER TABLE public.provider_tests
  ADD COLUMN IF NOT EXISTS measurement_type text NOT NULL DEFAULT 'biomarkers';

ALTER TABLE public.provider_tests
  DROP CONSTRAINT IF EXISTS provider_tests_measurement_type_check;

ALTER TABLE public.provider_tests
  ADD CONSTRAINT provider_tests_measurement_type_check
  CHECK (measurement_type IN ('biomarkers', 'cancers', 'allergens', 'conditions'));

COMMENT ON COLUMN public.provider_tests.measurement_type IS
  'What biomarker_count/biomarkers_list actually enumerates: individual biomarkers, cancer types screened, allergens tested, or conditions screened.';
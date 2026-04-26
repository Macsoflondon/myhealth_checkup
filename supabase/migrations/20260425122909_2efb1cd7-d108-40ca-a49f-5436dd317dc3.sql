-- Hot-path composite & partial indexes (audit C4 + D1)
-- All idempotent; safe to re-run.

CREATE INDEX IF NOT EXISTS idx_provider_tests_active_category
  ON public.provider_tests (category)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_provider_tests_popular
  ON public.provider_tests (popularity_rank)
  WHERE is_active = true AND is_popular = true;

CREATE INDEX IF NOT EXISTS idx_provider_tests_provider_active
  ON public.provider_tests (provider_id)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_biomarkers_library_category_name
  ON public.biomarkers_library (category, biomarker_name);

CREATE INDEX IF NOT EXISTS idx_provider_test_mapping_provider_test
  ON public.provider_test_mapping (provider_id, test_master_id);

CREATE INDEX IF NOT EXISTS idx_provider_test_mapping_available
  ON public.provider_test_mapping (test_master_id)
  WHERE availability_status = 'available';

CREATE INDEX IF NOT EXISTS idx_price_history_test_provider_date
  ON public.price_history (test_id, provider, changed_at DESC);

CREATE INDEX IF NOT EXISTS idx_tests_master_category
  ON public.tests_master (category)
  WHERE is_active = true;

ANALYZE public.provider_tests;
ANALYZE public.biomarkers_library;
ANALYZE public.provider_test_mapping;
ANALYZE public.price_history;
ANALYZE public.tests_master;

-- =====================================================================
-- Stage 1 Part A: Scraper completeness + longitudinal history foundation
-- Additive / non-destructive only. Safe to re-run (IF NOT EXISTS).
-- =====================================================================

-- ---------- A1. Extend provider_tests -------------------------------
ALTER TABLE public.provider_tests
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS handle text,
  ADD COLUMN IF NOT EXISTS was_price numeric,
  ADD COLUMN IF NOT EXISTS collection_fee numeric,
  ADD COLUMN IF NOT EXISTS gp_review_fee numeric,
  ADD COLUMN IF NOT EXISTS home_visit_fee numeric,
  ADD COLUMN IF NOT EXISTS sample_type text,
  ADD COLUMN IF NOT EXISTS collection_method text,
  ADD COLUMN IF NOT EXISTS home_kit_available boolean,
  ADD COLUMN IF NOT EXISTS clinic_visit_available boolean,
  ADD COLUMN IF NOT EXISTS location_options jsonb,
  ADD COLUMN IF NOT EXISTS turnaround_raw text,
  ADD COLUMN IF NOT EXISTS turnaround_hours integer,
  ADD COLUMN IF NOT EXISTS turnaround_days integer,
  ADD COLUMN IF NOT EXISTS turnaround_unit text,
  ADD COLUMN IF NOT EXISTS description_scraped text,
  ADD COLUMN IF NOT EXISTS who_should_test text,
  ADD COLUMN IF NOT EXISTS gender_specific text,
  ADD COLUMN IF NOT EXISTS lab_ukas_accredited boolean,
  ADD COLUMN IF NOT EXISTS lab_cqc_regulated boolean,
  ADD COLUMN IF NOT EXISTS lab_iso15189 boolean,
  ADD COLUMN IF NOT EXISTS trustpilot_rating numeric,
  ADD COLUMN IF NOT EXISTS trustpilot_review_count integer,
  ADD COLUMN IF NOT EXISTS trustpilot_last_checked timestamptz,
  ADD COLUMN IF NOT EXISTS in_stock boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS last_validated_at timestamptz,
  ADD COLUMN IF NOT EXISTS scrape_source_url text,
  ADD COLUMN IF NOT EXISTS field_completeness_score numeric,
  ADD COLUMN IF NOT EXISTS data_status text DEFAULT 'partial',
  ADD COLUMN IF NOT EXISTS price_not_stated boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS biomarkers_not_stated boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS turnaround_not_stated boolean DEFAULT false;

-- Generated column: total_expected_cost = price + collection_fee + gp_review_fee
-- Add only if missing (generated columns can't use IF NOT EXISTS in older PG,
-- so guard with a DO block).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'provider_tests'
      AND column_name = 'total_expected_cost'
  ) THEN
    EXECUTE $sql$
      ALTER TABLE public.provider_tests
        ADD COLUMN total_expected_cost numeric
        GENERATED ALWAYS AS (
          COALESCE(price, 0)
          + COALESCE(collection_fee, 0)
          + COALESCE(gp_review_fee, 0)
        ) STORED
    $sql$;
  END IF;
END $$;

-- CHECK constraints (add-if-missing pattern)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'provider_tests_turnaround_unit_check'
  ) THEN
    ALTER TABLE public.provider_tests
      ADD CONSTRAINT provider_tests_turnaround_unit_check
      CHECK (turnaround_unit IS NULL OR turnaround_unit IN ('hours','days','not_stated'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'provider_tests_gender_specific_check'
  ) THEN
    ALTER TABLE public.provider_tests
      ADD CONSTRAINT provider_tests_gender_specific_check
      CHECK (gender_specific IS NULL OR gender_specific IN ('male','female','any','not_stated'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'provider_tests_data_status_check'
  ) THEN
    ALTER TABLE public.provider_tests
      ADD CONSTRAINT provider_tests_data_status_check
      CHECK (data_status IS NULL OR data_status IN ('complete','partial','not_stated','stale'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_provider_tests_last_validated_at
  ON public.provider_tests (last_validated_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_provider_tests_data_status
  ON public.provider_tests (data_status);

-- ---------- A4. scrape_runs (create before history so we can FK) -----
CREATE TABLE IF NOT EXISTS public.scrape_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id text NOT NULL,
  scraper_function text,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running',
  tests_seen integer NOT NULL DEFAULT 0,
  tests_new integer NOT NULL DEFAULT 0,
  tests_updated integer NOT NULL DEFAULT 0,
  tests_deactivated integer NOT NULL DEFAULT 0,
  tests_unchanged integer NOT NULL DEFAULT 0,
  fields_populated integer NOT NULL DEFAULT 0,
  fields_not_stated integer NOT NULL DEFAULT 0,
  errors jsonb NOT NULL DEFAULT '[]'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.scrape_runs TO authenticated;
GRANT ALL ON public.scrape_runs TO service_role;

ALTER TABLE public.scrape_runs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='scrape_runs'
      AND policyname='Admins can view scrape runs'
  ) THEN
    CREATE POLICY "Admins can view scrape runs"
      ON public.scrape_runs FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_scrape_runs_provider_started
  ON public.scrape_runs (provider_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_scrape_runs_started_at
  ON public.scrape_runs (started_at DESC);

-- ---------- A2. provider_test_history (append-only snapshots) --------
CREATE TABLE IF NOT EXISTS public.provider_test_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_test_id uuid REFERENCES public.provider_tests(id) ON DELETE SET NULL,
  provider_id text NOT NULL,
  test_name text NOT NULL,
  snapshot_at timestamptz NOT NULL DEFAULT now(),
  scrape_run_id uuid REFERENCES public.scrape_runs(id) ON DELETE SET NULL,
  price numeric,
  was_price numeric,
  collection_fee numeric,
  gp_review_fee numeric,
  home_visit_fee numeric,
  total_expected_cost numeric,
  biomarker_count integer,
  biomarkers_list jsonb,
  turnaround_raw text,
  turnaround_hours integer,
  turnaround_days integer,
  turnaround_unit text,
  sample_type text,
  collection_method text,
  in_stock boolean,
  trustpilot_rating numeric,
  trustpilot_review_count integer,
  scrape_source_url text,
  raw_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.provider_test_history TO authenticated;
GRANT ALL ON public.provider_test_history TO service_role;

ALTER TABLE public.provider_test_history ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='provider_test_history'
      AND policyname='Admins can view provider test history'
  ) THEN
    CREATE POLICY "Admins can view provider test history"
      ON public.provider_test_history FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_pth_provider_test_snapshot
  ON public.provider_test_history (provider_test_id, snapshot_at DESC);
CREATE INDEX IF NOT EXISTS idx_pth_provider_snapshot
  ON public.provider_test_history (provider_id, snapshot_at DESC);
CREATE INDEX IF NOT EXISTS idx_pth_snapshot_at
  ON public.provider_test_history (snapshot_at DESC);
CREATE INDEX IF NOT EXISTS idx_pth_scrape_run
  ON public.provider_test_history (scrape_run_id);

-- ---------- A3. Extend scrape_change_events --------------------------
ALTER TABLE public.scrape_change_events
  ADD COLUMN IF NOT EXISTS field_name text,
  ADD COLUMN IF NOT EXISTS old_value jsonb,
  ADD COLUMN IF NOT EXISTS new_value jsonb,
  ADD COLUMN IF NOT EXISTS scrape_run_id uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'scrape_change_events_run_fk'
  ) THEN
    ALTER TABLE public.scrape_change_events
      ADD CONSTRAINT scrape_change_events_run_fk
      FOREIGN KEY (scrape_run_id) REFERENCES public.scrape_runs(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_sce_run
  ON public.scrape_change_events (scrape_run_id);
CREATE INDEX IF NOT EXISTS idx_sce_field
  ON public.scrape_change_events (field_name);

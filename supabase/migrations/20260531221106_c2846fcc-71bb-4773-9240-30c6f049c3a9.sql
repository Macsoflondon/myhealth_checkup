-- 1. Correct the Goodbody Male Hormone and Fertility row (6 biomarkers, not 100)
UPDATE public.provider_tests
SET
  biomarkers_list = '["Follicular Stimulating Hormone (FSH)","Free Androgen Index","Luteinizing Hormone (LH)","Prolactin","Sex Hormone Binding Globulin (SHBG)","Testosterone"]'::jsonb,
  biomarker_count = 6,
  collection_options = '[{"method":"At-home finger-prick kit","price":79},{"method":"In-clinic venous draw","price":109},{"method":"Home nurse visit","price":129}]'::jsonb,
  base_price = 79,
  price = 79,
  sample_type = 'Venous or finger-prick blood sample',
  updated_at = now()
WHERE id = '2360757d-1e73-44d5-848b-cb9f95d3f8bf';

-- 2. Audit table to drive the platform-wide biomarker reconciliation
CREATE TABLE IF NOT EXISTS public.biomarker_audit_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL,
  provider_id text NOT NULL,
  provider_test_id text,
  test_name text NOT NULL,
  url text,
  stored_list jsonb,
  stored_count integer,
  scraped_biomarkers jsonb,
  scraped_count integer,
  delta text NOT NULL,
  notes text,
  approved boolean NOT NULL DEFAULT false,
  approved_at timestamptz,
  approved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.biomarker_audit_runs TO authenticated;
GRANT ALL ON public.biomarker_audit_runs TO service_role;

ALTER TABLE public.biomarker_audit_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read biomarker audit runs"
  ON public.biomarker_audit_runs
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can approve biomarker audit runs"
  ON public.biomarker_audit_runs
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS biomarker_audit_runs_run_id_idx
  ON public.biomarker_audit_runs (run_id);
CREATE INDEX IF NOT EXISTS biomarker_audit_runs_delta_idx
  ON public.biomarker_audit_runs (delta);
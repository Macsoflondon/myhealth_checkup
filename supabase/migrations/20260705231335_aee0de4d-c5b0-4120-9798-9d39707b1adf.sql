-- Async FHIR export job tracker
CREATE TABLE public.fhir_export_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'accepted' CHECK (status IN ('accepted','in-progress','completed','error','cancelled')),
  output jsonb,
  error_message text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  request_params jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.fhir_export_jobs TO authenticated;
GRANT ALL ON public.fhir_export_jobs TO service_role;

ALTER TABLE public.fhir_export_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fhir_jobs_own_read" ON public.fhir_export_jobs
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "fhir_jobs_own_insert" ON public.fhir_export_jobs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "fhir_jobs_own_update" ON public.fhir_export_jobs
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX fhir_export_jobs_user_status_idx ON public.fhir_export_jobs (user_id, status, requested_at DESC);
CREATE INDEX fhir_export_jobs_expires_idx ON public.fhir_export_jobs (expires_at);

CREATE TRIGGER update_fhir_export_jobs_updated_at
  BEFORE UPDATE ON public.fhir_export_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Consent-based data sharing grants
CREATE TABLE public.data_sharing_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  recipient_email text NOT NULL,
  recipient_org text,
  scope jsonb NOT NULL DEFAULT '{"resources":["Patient","DiagnosticReport","Observation"]}'::jsonb,
  purpose text NOT NULL,
  access_token_hash text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','revoked','expired','consumed')),
  granted_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  revoked_at timestamptz,
  revoked_reason text,
  last_accessed_at timestamptz,
  access_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.data_sharing_grants TO authenticated;
GRANT ALL ON public.data_sharing_grants TO service_role;

ALTER TABLE public.data_sharing_grants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sharing_grants_own_read" ON public.data_sharing_grants
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "sharing_grants_own_insert" ON public.data_sharing_grants
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sharing_grants_own_update" ON public.data_sharing_grants
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX data_sharing_grants_user_idx ON public.data_sharing_grants (user_id, status);
CREATE INDEX data_sharing_grants_token_idx ON public.data_sharing_grants (access_token_hash) WHERE status = 'active';
CREATE INDEX data_sharing_grants_expires_idx ON public.data_sharing_grants (expires_at) WHERE status = 'active';

CREATE TRIGGER update_data_sharing_grants_updated_at
  BEFORE UPDATE ON public.data_sharing_grants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
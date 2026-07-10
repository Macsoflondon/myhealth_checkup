-- 1. Purpose binding on audit_logs
ALTER TABLE public.audit_logs
  ADD COLUMN IF NOT EXISTS reason_code text,
  ADD COLUMN IF NOT EXISTS purpose text,
  ADD COLUMN IF NOT EXISTS data_classification text,
  ADD COLUMN IF NOT EXISTS siem_exported_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_audit_logs_siem_pending
  ON public.audit_logs (created_at)
  WHERE siem_exported_at IS NULL;

CREATE OR REPLACE FUNCTION public.log_data_access_with_reason(
  _table_name text,
  _record_id uuid,
  _reason_code text,
  _purpose text DEFAULT NULL,
  _classification text DEFAULT 'C2'
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'authentication required';
  END IF;
  IF _reason_code IS NULL OR length(btrim(_reason_code)) < 3 THEN
    RAISE EXCEPTION 'reason_code is required (>= 3 chars)';
  END IF;
  IF _classification NOT IN ('C0','C1','C2','C3','C4') THEN
    RAISE EXCEPTION 'invalid data_classification';
  END IF;
  INSERT INTO public.audit_logs (
    user_id, action, table_name, record_id,
    reason_code, purpose, data_classification
  ) VALUES (
    auth.uid(), 'READ', _table_name, _record_id,
    _reason_code, _purpose, _classification
  ) RETURNING id INTO _id;
  RETURN _id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_data_access_with_reason(text, uuid, text, text, text) TO authenticated;

-- 2. Encryption key registry
CREATE TABLE IF NOT EXISTS public.encryption_keys (
  kid text PRIMARY KEY,
  alg text NOT NULL DEFAULT 'AES-256-GCM',
  purpose text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','rotating','retired','compromised')),
  created_at timestamptz NOT NULL DEFAULT now(),
  activated_at timestamptz,
  retired_at timestamptz,
  rotated_from text REFERENCES public.encryption_keys(kid),
  notes text
);

CREATE INDEX IF NOT EXISTS idx_encryption_keys_purpose_status
  ON public.encryption_keys (purpose, status);

GRANT SELECT ON public.encryption_keys TO authenticated;
GRANT ALL ON public.encryption_keys TO service_role;

ALTER TABLE public.encryption_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read encryption keys" ON public.encryption_keys;
CREATE POLICY "Admins read encryption keys" ON public.encryption_keys
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Service role manages encryption keys" ON public.encryption_keys;
CREATE POLICY "Service role manages encryption keys" ON public.encryption_keys
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 3. SIEM export cursor
CREATE TABLE IF NOT EXISTS public.siem_export_cursor (
  source text PRIMARY KEY,
  last_exported_at timestamptz NOT NULL DEFAULT '1970-01-01T00:00:00Z',
  last_exported_id uuid,
  last_run_at timestamptz,
  last_batch_size int,
  last_error text
);

GRANT SELECT ON public.siem_export_cursor TO authenticated;
GRANT ALL ON public.siem_export_cursor TO service_role;

ALTER TABLE public.siem_export_cursor ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read SIEM cursor" ON public.siem_export_cursor;
CREATE POLICY "Admins read SIEM cursor" ON public.siem_export_cursor
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Service role manages SIEM cursor" ON public.siem_export_cursor;
CREATE POLICY "Service role manages SIEM cursor" ON public.siem_export_cursor
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

INSERT INTO public.siem_export_cursor (source) VALUES
  ('audit_logs'),
  ('role_audit_log'),
  ('edge_function_logs'),
  ('csp_reports')
ON CONFLICT (source) DO NOTHING;

-- 4. Seed an initial active KEK identifier for user-pii (value lives in Vault/KMS, only kid is public)
INSERT INTO public.encryption_keys (kid, alg, purpose, status, activated_at, notes)
VALUES ('mhc-pii-2026-01', 'AES-256-GCM', 'user-pii', 'active', now(),
        'Initial KEK identifier. Actual key material lives in Vault under VITE_ENCRYPTION_KEY / NEW_VITE_ENCRYPTION_KEY.')
ON CONFLICT (kid) DO NOTHING;
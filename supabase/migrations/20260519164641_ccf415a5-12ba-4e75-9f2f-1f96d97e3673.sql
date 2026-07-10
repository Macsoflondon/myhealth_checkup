
-- Audit table for automated provider image verification
CREATE TABLE IF NOT EXISTS public.provider_image_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL,
  provider_id TEXT NOT NULL,
  category TEXT,
  provider_test_id TEXT,
  test_name TEXT,
  image_url TEXT,
  status TEXT NOT NULL,           -- 'ok' | 'missing' | 'placeholder' | 'unreachable' | 'wrong_type' | 'wrong_host'
  http_status INTEGER,
  content_type TEXT,
  issue TEXT,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pia_run ON public.provider_image_audit(run_id);
CREATE INDEX IF NOT EXISTS idx_pia_provider_status ON public.provider_image_audit(provider_id, status);
CREATE INDEX IF NOT EXISTS idx_pia_checked_at ON public.provider_image_audit(checked_at DESC);

ALTER TABLE public.provider_image_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view image audit"
  ON public.provider_image_audit FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Summary view of latest run per provider/category
CREATE OR REPLACE VIEW public.provider_image_audit_latest AS
WITH latest AS (
  SELECT run_id FROM public.provider_image_audit ORDER BY checked_at DESC LIMIT 1
)
SELECT
  a.provider_id,
  a.category,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE a.status = 'ok')          AS ok,
  COUNT(*) FILTER (WHERE a.status = 'missing')     AS missing,
  COUNT(*) FILTER (WHERE a.status = 'placeholder') AS placeholder,
  COUNT(*) FILTER (WHERE a.status = 'unreachable') AS unreachable,
  COUNT(*) FILTER (WHERE a.status = 'wrong_type')  AS wrong_type,
  COUNT(*) FILTER (WHERE a.status = 'wrong_host')  AS wrong_host,
  ROUND(100.0 * COUNT(*) FILTER (WHERE a.status = 'ok') / NULLIF(COUNT(*), 0), 1) AS pct_ok,
  MAX(a.checked_at) AS checked_at
FROM public.provider_image_audit a
JOIN latest l ON l.run_id = a.run_id
GROUP BY a.provider_id, a.category
ORDER BY a.provider_id, a.category;

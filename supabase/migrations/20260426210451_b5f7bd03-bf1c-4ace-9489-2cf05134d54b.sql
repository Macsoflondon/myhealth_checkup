
CREATE TABLE IF NOT EXISTS public.security_scan_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_findings INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0,
  warn_count INTEGER NOT NULL DEFAULT 0,
  findings JSONB NOT NULL DEFAULT '[]'::jsonb,
  added_findings JSONB NOT NULL DEFAULT '[]'::jsonb,
  removed_findings JSONB NOT NULL DEFAULT '[]'::jsonb,
  modified_findings JSONB NOT NULL DEFAULT '[]'::jsonb,
  has_diff BOOLEAN NOT NULL DEFAULT false,
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sec_scan_snapshots_scanned_at ON public.security_scan_snapshots (scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_sec_scan_snapshots_has_diff ON public.security_scan_snapshots (has_diff) WHERE has_diff = true;

ALTER TABLE public.security_scan_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view scan snapshots"
  ON public.security_scan_snapshots
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can acknowledge scan snapshots"
  ON public.security_scan_snapshots
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Block public inserts"
  ON public.security_scan_snapshots
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (false);

CREATE POLICY "Block public deletes"
  ON public.security_scan_snapshots
  FOR DELETE
  TO authenticated, anon
  USING (false);

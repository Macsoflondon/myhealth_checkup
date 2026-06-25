CREATE TABLE IF NOT EXISTS public.csp_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  report JSONB NOT NULL,
  document_uri TEXT,
  violated_directive TEXT,
  blocked_uri TEXT
);

GRANT ALL ON public.csp_reports TO service_role;
GRANT SELECT ON public.csp_reports TO authenticated;

ALTER TABLE public.csp_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read CSP reports"
  ON public.csp_reports FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS csp_reports_received_at_idx ON public.csp_reports (received_at DESC);
CREATE INDEX IF NOT EXISTS csp_reports_directive_idx ON public.csp_reports (violated_directive);

CREATE OR REPLACE FUNCTION public.cleanup_csp_reports()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.csp_reports WHERE received_at < now() - INTERVAL '30 days';
END;
$$;
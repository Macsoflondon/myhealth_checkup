CREATE TABLE public.admin_recovery_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  target_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_email TEXT NOT NULL,
  issued_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  redeemed_ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_recovery_tokens_expires_at ON public.admin_recovery_tokens (expires_at);

-- Service role only: never exposed through the Data API.
GRANT ALL ON public.admin_recovery_tokens TO service_role;

ALTER TABLE public.admin_recovery_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No direct client access to admin recovery tokens"
ON public.admin_recovery_tokens
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);
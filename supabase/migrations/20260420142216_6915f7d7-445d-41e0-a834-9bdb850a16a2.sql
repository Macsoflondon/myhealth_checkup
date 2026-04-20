-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'footer',
  status TEXT NOT NULL DEFAULT 'active',
  consent_ip INET,
  consent_user_agent TEXT,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- No public read; only admins can view subscribers (PII protection)
CREATE POLICY "Admins can view all subscribers"
  ON public.newsletter_subscribers FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update subscribers"
  ON public.newsletter_subscribers FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete subscribers"
  ON public.newsletter_subscribers FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- No client INSERT policy: signups only allowed via the edge function (service role)

CREATE TRIGGER set_newsletter_subscribers_updated_at
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON public.newsletter_subscribers(status);
-- Optional retest reminders: one email, 3, 6 or 12 months later, nudging a
-- visitor to look again at a test or biomarker. No account needed.
-- Data minimisation: email, interest, interval, due date, status, consent
-- record and unsubscribe token only. Nothing health related is stored.
-- Service role only: RLS on, no anon/authenticated policies.

CREATE TABLE IF NOT EXISTS public.retest_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (email = lower(email)),
  interest_type text NOT NULL CHECK (interest_type IN ('test', 'biomarker')),
  interest_slug text NOT NULL,
  interest_label text NOT NULL,
  interval_months smallint NOT NULL CHECK (interval_months IN (3, 6, 12)),
  remind_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'unsubscribed')),
  consent_text text NOT NULL,
  consent_at timestamptz NOT NULL DEFAULT now(),
  consent_ip text,
  unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  CONSTRAINT retest_reminders_email_slug_interval_key
    UNIQUE (email, interest_slug, interval_months)
);

REVOKE ALL ON public.retest_reminders FROM anon, authenticated;
GRANT ALL ON public.retest_reminders TO service_role;

ALTER TABLE public.retest_reminders ENABLE ROW LEVEL SECURITY;
-- Deliberately no policies: only the service role (bypasses RLS) can read or write.

CREATE INDEX IF NOT EXISTS retest_reminders_status_remind_at_idx
  ON public.retest_reminders (status, remind_at);

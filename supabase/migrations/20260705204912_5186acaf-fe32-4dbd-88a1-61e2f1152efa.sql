-- web_vitals lockdown: only service_role writes (via web-vitals-ingest), only admins read.
REVOKE INSERT, UPDATE, DELETE ON public.web_vitals FROM anon, authenticated;
REVOKE SELECT ON public.web_vitals FROM anon, authenticated;
GRANT ALL ON public.web_vitals TO service_role;
-- Existing admin SELECT policy stays. No public INSERT policy → direct client inserts blocked.
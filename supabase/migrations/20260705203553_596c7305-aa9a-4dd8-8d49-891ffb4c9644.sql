
-- Tighten web_vitals inserts to service_role only (ingest goes through an edge function)
DROP POLICY IF EXISTS "Public can insert web vitals" ON public.web_vitals;
REVOKE INSERT ON public.web_vitals FROM anon, authenticated;

-- Lock down trigger function from direct execution
REVOKE ALL ON FUNCTION public.notify_soc_incident_created() FROM PUBLIC, anon, authenticated;

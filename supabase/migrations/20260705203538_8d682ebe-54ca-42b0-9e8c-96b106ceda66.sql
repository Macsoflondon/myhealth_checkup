
-- ============ web_vitals (P3/P4 RUM) ============
CREATE TABLE public.web_vitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric text NOT NULL CHECK (metric IN ('LCP','CLS','INP','FCP','TTFB','FID')),
  value double precision NOT NULL,
  rating text CHECK (rating IN ('good','needs-improvement','poor')),
  route text,
  device_type text CHECK (device_type IN ('mobile','tablet','desktop','unknown')),
  connection_type text,
  session_hash text,
  navigation_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX web_vitals_metric_created_idx ON public.web_vitals (metric, created_at DESC);
CREATE INDEX web_vitals_route_idx ON public.web_vitals (route, created_at DESC) WHERE route IS NOT NULL;

GRANT INSERT ON public.web_vitals TO anon, authenticated;
GRANT SELECT ON public.web_vitals TO authenticated;
GRANT ALL ON public.web_vitals TO service_role;

ALTER TABLE public.web_vitals ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (edge function forwards, no PII stored)
CREATE POLICY "Public can insert web vitals"
  ON public.web_vitals FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only admins read
CREATE POLICY "Admins view web vitals"
  ON public.web_vitals FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 90-day retention
INSERT INTO public.audit_retention_policy (source, time_column, retention_days)
VALUES ('web_vitals', 'created_at', 90)
ON CONFLICT DO NOTHING;

-- ============ soc_incidents notification trigger ============
CREATE OR REPLACE FUNCTION public.notify_soc_incident_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'vault'
AS $function$
DECLARE
  _payload jsonb;
  _key text;
BEGIN
  -- Only alert on freshly-opened critical/high incidents
  IF NEW.status <> 'open' OR NEW.severity NOT IN ('critical','high') THEN
    RETURN NEW;
  END IF;

  SELECT decrypted_secret INTO _key
  FROM vault.decrypted_secrets
  WHERE name = 'service_role_key'
  LIMIT 1;

  IF _key IS NULL OR length(_key) = 0 THEN
    RAISE WARNING 'notify_soc_incident_created: missing Vault secret service_role_key; skipping alert';
    RETURN NEW;
  END IF;

  _payload := jsonb_build_object(
    'alert_type', 'soc_incident_opened',
    'subject', format('[MHC SOC] %s incident: %s', upper(NEW.severity), NEW.title),
    'incident_id', NEW.id,
    'severity', NEW.severity,
    'source', NEW.source,
    'entity', NEW.entity,
    'title', NEW.title,
    'summary', NEW.summary,
    'signal_count', NEW.signal_count,
    'first_seen_at', NEW.first_seen_at,
    'cluster_key', NEW.cluster_key
  );

  PERFORM net.http_post(
    url := 'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/security-alert-notify',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', _key,
      'Authorization', 'Bearer ' || _key
    ),
    body := _payload
  );

  RETURN NEW;
END;
$function$;

CREATE TRIGGER soc_incidents_notify
  AFTER INSERT ON public.soc_incidents
  FOR EACH ROW EXECUTE FUNCTION public.notify_soc_incident_created();

-- ============ P1 indices ============
CREATE INDEX IF NOT EXISTS protected_call_log_denied_caller_idx
  ON public.protected_call_log (caller_id, created_at DESC)
  WHERE status = 'denied';

CREATE INDEX IF NOT EXISTS edge_function_logs_errors_idx
  ON public.edge_function_logs (function_name, created_at DESC)
  WHERE status = 'error';

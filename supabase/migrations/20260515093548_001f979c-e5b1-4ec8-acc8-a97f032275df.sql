
-- 1. Lock down EXECUTE on all internal SECURITY DEFINER maintenance/trigger functions.
REVOKE ALL ON FUNCTION public.sanitize_protected_call_log() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cleanup_protected_call_log() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cleanup_role_audit_log() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cleanup_old_health_queries() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cleanup_old_rate_limits() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.lov_tables_without_policies() FROM PUBLIC;

-- Be explicit about every Supabase-exposed role too (defence-in-depth in case PUBLIC inheritance changes).
DO $$
DECLARE
  fn text;
  r  text;
BEGIN
  FOREACH fn IN ARRAY ARRAY[
    'public.sanitize_protected_call_log()',
    'public.cleanup_protected_call_log()',
    'public.cleanup_role_audit_log()',
    'public.cleanup_old_health_queries()',
    'public.cleanup_old_rate_limits()',
    'public.lov_tables_without_policies()'
  ] LOOP
    FOREACH r IN ARRAY ARRAY['anon','authenticated','service_role','dashboard_user'] LOOP
      BEGIN
        EXECUTE format('REVOKE ALL ON FUNCTION %s FROM %I', fn, r);
      EXCEPTION WHEN undefined_object THEN
        -- role may not exist in this environment; ignore
        NULL;
      END;
    END LOOP;
  END LOOP;
END $$;

-- 2. Abuse / misconfiguration alert: trigger after a denied protected_call_log insert.
CREATE OR REPLACE FUNCTION public.detect_protected_call_abuse()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  denied_count integer;
  recent_alert boolean;
  alert_key    text;
BEGIN
  IF NEW.status IS DISTINCT FROM 'denied' THEN
    RETURN NEW;
  END IF;

  -- Count denied calls in the last 15 min from the same caller_id OR ip_address.
  SELECT COUNT(*) INTO denied_count
  FROM public.protected_call_log
  WHERE status = 'denied'
    AND created_at > now() - INTERVAL '15 minutes'
    AND (
      (NEW.caller_id IS NOT NULL AND caller_id = NEW.caller_id)
      OR (NEW.ip_address IS NOT NULL AND ip_address = NEW.ip_address)
    );

  IF denied_count < 5 THEN
    RETURN NEW;
  END IF;

  alert_key := COALESCE('user:' || NEW.caller_id::text, 'ip:' || NEW.ip_address, 'unknown');

  -- Suppress duplicate alerts: only one per caller/ip per hour.
  SELECT EXISTS (
    SELECT 1 FROM public.scraper_alerts
    WHERE alert_type = 'denied_call_burst'
      AND provider_id = alert_key
      AND created_at > now() - INTERVAL '1 hour'
  ) INTO recent_alert;

  IF recent_alert THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.scraper_alerts (
    provider_id, alert_type, severity, message, current_count, expected_min
  ) VALUES (
    alert_key,
    'denied_call_burst',
    CASE WHEN denied_count >= 20 THEN 'critical' ELSE 'warning' END,
    format('%s denied protected calls in 15 min from %s (function=%s)',
           denied_count, alert_key, NEW.function_name),
    denied_count,
    5
  );

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.detect_protected_call_abuse() FROM PUBLIC;
DO $$
DECLARE r text;
BEGIN
  FOREACH r IN ARRAY ARRAY['anon','authenticated','service_role','dashboard_user'] LOOP
    BEGIN
      EXECUTE format('REVOKE ALL ON FUNCTION public.detect_protected_call_abuse() FROM %I', r);
    EXCEPTION WHEN undefined_object THEN NULL;
    END;
  END LOOP;
END $$;

DROP TRIGGER IF EXISTS trg_detect_protected_call_abuse ON public.protected_call_log;
CREATE TRIGGER trg_detect_protected_call_abuse
AFTER INSERT ON public.protected_call_log
FOR EACH ROW EXECUTE FUNCTION public.detect_protected_call_abuse();

-- Helpful index for the abuse-detection scan.
CREATE INDEX IF NOT EXISTS idx_protected_call_log_status_recent
  ON public.protected_call_log (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_protected_call_log_caller_recent
  ON public.protected_call_log (caller_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_protected_call_log_ip_recent
  ON public.protected_call_log (ip_address, created_at DESC);

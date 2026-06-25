
-- Sanitise PII / secrets out of protected_call_log details + user_agent before insert/update
CREATE OR REPLACE FUNCTION public.sanitize_protected_call_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  txt text;
BEGIN
  -- Redact details jsonb by serialising, scrubbing, and reparsing
  IF NEW.details IS NOT NULL THEN
    txt := NEW.details::text;
    txt := regexp_replace(txt, '(?i)(bearer\s+)[A-Za-z0-9._\-]+', '\1[REDACTED]', 'g');
    txt := regexp_replace(txt, '(?i)("?(api[_-]?key|authorization|token|password|secret|cookie|set-cookie|x-api-key)"?\s*[:=]\s*")[^"\\]+(")', '\1[REDACTED]\3', 'g');
    txt := regexp_replace(txt, '(?i)(eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{5,})', '[REDACTED_JWT]', 'g');
    txt := regexp_replace(txt, 'sk-[A-Za-z0-9]{20,}', '[REDACTED_KEY]', 'g');
    -- Cap serialised size at 8KB
    IF length(txt) > 8192 THEN
      txt := substring(txt FROM 1 FOR 8192);
      -- Fallback to a safe jsonb when truncation broke JSON
      BEGIN
        NEW.details := txt::jsonb;
      EXCEPTION WHEN others THEN
        NEW.details := jsonb_build_object('truncated', true, 'preview', substring(txt FROM 1 FOR 1024));
      END;
    ELSE
      BEGIN
        NEW.details := txt::jsonb;
      EXCEPTION WHEN others THEN
        NEW.details := jsonb_build_object('sanitized', true, 'preview', substring(txt FROM 1 FOR 1024));
      END;
    END IF;
  END IF;

  -- Redact user_agent (rarely sensitive but cap length + scrub bearer-style strings)
  IF NEW.user_agent IS NOT NULL THEN
    NEW.user_agent := regexp_replace(NEW.user_agent, '(?i)(bearer\s+)[A-Za-z0-9._\-]+', '\1[REDACTED]', 'g');
    IF length(NEW.user_agent) > 512 THEN
      NEW.user_agent := substring(NEW.user_agent FROM 1 FOR 512);
    END IF;
  END IF;

  -- Truncate IP if obviously oversized junk
  IF NEW.ip_address IS NOT NULL AND length(NEW.ip_address) > 64 THEN
    NEW.ip_address := substring(NEW.ip_address FROM 1 FOR 64);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sanitize_protected_call_log ON public.protected_call_log;
CREATE TRIGGER trg_sanitize_protected_call_log
BEFORE INSERT OR UPDATE ON public.protected_call_log
FOR EACH ROW EXECUTE FUNCTION public.sanitize_protected_call_log();

REVOKE EXECUTE ON FUNCTION public.sanitize_protected_call_log() FROM PUBLIC, anon, authenticated;

-- Retention: delete entries older than 90 days
CREATE OR REPLACE FUNCTION public.cleanup_protected_call_log()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.protected_call_log
  WHERE created_at < now() - INTERVAL '90 days';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.cleanup_protected_call_log() FROM PUBLIC, anon, authenticated;

-- Same retention for role_audit_log (1 year — security-sensitive, longer retention)
CREATE OR REPLACE FUNCTION public.cleanup_role_audit_log()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.role_audit_log
  WHERE created_at < now() - INTERVAL '365 days';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.cleanup_role_audit_log() FROM PUBLIC, anon, authenticated;

-- Schedule daily cleanup if pg_cron is available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule('cleanup-protected-call-log') WHERE EXISTS (
      SELECT 1 FROM cron.job WHERE jobname = 'cleanup-protected-call-log'
    );
    PERFORM cron.schedule(
      'cleanup-protected-call-log',
      '15 3 * * *',
      $cron$SELECT public.cleanup_protected_call_log();$cron$
    );
    PERFORM cron.unschedule('cleanup-role-audit-log') WHERE EXISTS (
      SELECT 1 FROM cron.job WHERE jobname = 'cleanup-role-audit-log'
    );
    PERFORM cron.schedule(
      'cleanup-role-audit-log',
      '30 3 * * *',
      $cron$SELECT public.cleanup_role_audit_log();$cron$
    );
  END IF;
END $$;

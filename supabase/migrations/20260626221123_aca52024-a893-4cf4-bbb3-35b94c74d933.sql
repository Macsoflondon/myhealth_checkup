
CREATE OR REPLACE FUNCTION public.notify_cron_run_failure()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'vault'
AS $function$
DECLARE
  _payload jsonb;
  _key     text;
BEGIN
  IF NEW.status <> 'error' THEN
    RETURN NEW;
  END IF;

  SELECT decrypted_secret INTO _key
  FROM vault.decrypted_secrets
  WHERE name = 'service_role_key'
  LIMIT 1;

  IF _key IS NULL OR length(_key) = 0 THEN
    RAISE WARNING 'notify_cron_run_failure: missing Vault secret service_role_key; skipping alert';
    RETURN NEW;
  END IF;

  _payload := jsonb_build_object(
    'alert_type',     'cron_failure',
    'subject',        format('[MHC] Cron failure: %s', NEW.job_name),
    'job_name',       NEW.job_name,
    'started_at',     NEW.started_at,
    'finished_at',    NEW.finished_at,
    'duration_ms',    NEW.duration_ms,
    'error_message',  NEW.error_message,
    'evidence_path',  format('evidence/cron/%s/  (run export-cron-evidence.sh to materialise)', to_char(now(), 'YYYY"-Q"Q')),
    'log_row_id',     NEW.id
  );

  PERFORM net.http_post(
    url     := 'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/security-alert-notify',
    headers := jsonb_build_object(
                 'Content-Type',  'application/json',
                 'apikey',        _key,
                 'Authorization', 'Bearer ' || _key
               ),
    body    := _payload
  );

  RETURN NEW;
END;
$function$;

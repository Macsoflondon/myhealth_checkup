
-- Recipients config
CREATE TABLE IF NOT EXISTS public.security_alert_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  label text,
  alert_types text[] NOT NULL DEFAULT ARRAY['cron_failure','rls_failure','backup_restore_failure']::text[],
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.security_alert_recipients TO authenticated;
GRANT ALL ON public.security_alert_recipients TO service_role;

ALTER TABLE public.security_alert_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage alert recipients"
  ON public.security_alert_recipients
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER security_alert_recipients_set_updated_at
  BEFORE UPDATE ON public.security_alert_recipients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- pg_net for outbound HTTP from triggers
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Trigger fn: post failed cron runs to the alert edge function
CREATE OR REPLACE FUNCTION public.notify_cron_run_failure()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _payload jsonb;
BEGIN
  IF NEW.status <> 'error' THEN
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
                 'Content-Type', 'application/json',
                 'apikey',       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdnVpb2Fnc2dmYWR5bnV2b2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQ1MDcsImV4cCI6MjA2ODA4MDUwN30.N_ddGrc6YhEYnINwofAI-SNOtsxZr5D-dLVuA5TZEBM'
               ),
    body    := _payload
  );

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.notify_cron_run_failure() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_cron_run_log_notify_failure ON public.cron_run_log;
CREATE TRIGGER trg_cron_run_log_notify_failure
  AFTER INSERT OR UPDATE OF status ON public.cron_run_log
  FOR EACH ROW
  WHEN (NEW.status = 'error')
  EXECUTE FUNCTION public.notify_cron_run_failure();

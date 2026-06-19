
-- 1. Log table
CREATE TABLE IF NOT EXISTS public.cron_run_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  duration_ms integer,
  status text NOT NULL CHECK (status IN ('running','success','error')),
  rows_affected integer,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cron_run_log_job_started_idx
  ON public.cron_run_log(job_name, started_at DESC);

GRANT SELECT ON public.cron_run_log TO authenticated;
GRANT ALL ON public.cron_run_log TO service_role;

ALTER TABLE public.cron_run_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read cron run log"
  ON public.cron_run_log
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Logged wrapper
CREATE OR REPLACE FUNCTION public.run_logged_cleanup(_job_name text, _sql text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _log_id uuid;
  _start  timestamptz := clock_timestamp();
  _rows   integer;
  _err    text;
BEGIN
  INSERT INTO public.cron_run_log(job_name, started_at, status)
  VALUES (_job_name, _start, 'running')
  RETURNING id INTO _log_id;

  BEGIN
    EXECUTE _sql;
    GET DIAGNOSTICS _rows = ROW_COUNT;

    UPDATE public.cron_run_log
       SET finished_at  = clock_timestamp(),
           duration_ms  = EXTRACT(MILLISECONDS FROM (clock_timestamp() - _start))::integer,
           status       = 'success',
           rows_affected= _rows
     WHERE id = _log_id;

  EXCEPTION WHEN OTHERS THEN
    _err := SQLERRM;

    UPDATE public.cron_run_log
       SET finished_at = clock_timestamp(),
           duration_ms = EXTRACT(MILLISECONDS FROM (clock_timestamp() - _start))::integer,
           status      = 'error',
           error_message = _err
     WHERE id = _log_id;

    -- Alert via existing scraper_alerts surface (admin dashboard already watches it)
    INSERT INTO public.scraper_alerts(provider_id, alert_type, severity, message, current_count, expected_min)
    VALUES ('cron:' || _job_name, 'cron_job_failure', 'critical',
            format('Cron job %s failed: %s', _job_name, _err), 0, 1);
  END;

  RETURN _log_id;
END;
$$;

-- 3. 30-day retention on the log itself
CREATE OR REPLACE FUNCTION public.cleanup_cron_run_log()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.cron_run_log WHERE started_at < now() - INTERVAL '90 days';
END;
$$;

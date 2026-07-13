
-- C1: Unified audit view + retention policy

-- Ensure out-of-band production tables exist for preview environments.
-- These tables are created directly on production and are not in any migration file.
-- CREATE TABLE IF NOT EXISTS is idempotent and safe to run when the real table already exists.
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  admin_user_id uuid,
  action      text,
  resource_type text,
  resource_id text,
  resource_name text,
  old_value   jsonb,
  new_value   jsonb,
  success     boolean DEFAULT true,
  error_message text,
  session_id  text,
  ip_address  text,
  user_agent  text
);
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.admin_activity_log TO authenticated;
GRANT ALL ON public.admin_activity_log TO service_role;

CREATE TABLE IF NOT EXISTS public.edge_function_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  function_name text,
  invocation_id text,
  status        text,
  http_status   integer,
  duration_ms   integer,
  memory_mb     numeric,
  error_message text,
  triggered_by  text
);
ALTER TABLE public.edge_function_logs ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.edge_function_logs TO authenticated;
GRANT ALL ON public.edge_function_logs TO service_role;

CREATE TABLE IF NOT EXISTS public.ai_operation_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  user_id         uuid,
  job_type        text,
  entity_type     text,
  entity_id       text,
  model           text,
  prompt_version  text,
  input_tokens    integer,
  output_tokens   integer,
  latency_ms      integer,
  cost_usd        numeric,
  success         boolean DEFAULT true,
  cache_hit       boolean,
  error_message   text,
  metadata        jsonb
);
ALTER TABLE public.ai_operation_logs ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.ai_operation_logs TO authenticated;
GRANT ALL ON public.ai_operation_logs TO service_role;

CREATE TABLE IF NOT EXISTS public.audit_retention_policy (
  source text PRIMARY KEY,
  retention_days integer NOT NULL CHECK (retention_days > 0),
  time_column text NOT NULL DEFAULT 'created_at',
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_retention_policy TO authenticated;
GRANT ALL ON public.audit_retention_policy TO service_role;
ALTER TABLE public.audit_retention_policy ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read retention policy" ON public.audit_retention_policy
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage retention policy" ON public.audit_retention_policy
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.audit_retention_policy(source, retention_days, time_column, notes) VALUES
  ('audit_logs',          400, 'created_at',  'GDPR data-access log; keep >12mo for annual reviews'),
  ('role_audit_log',      365, 'created_at',  'Role grants/revokes'),
  ('admin_activity_log',  400, 'created_at',  'Admin console actions'),
  ('edge_function_logs',   90, 'created_at',  'Function runtime telemetry'),
  ('protected_call_log',   90, 'created_at',  'Protected fn calls incl. denies'),
  ('csp_reports',          30, 'received_at', 'CSP violation reports'),
  ('cron_run_log',         90, 'started_at',  'Cron job runs'),
  ('ai_operation_logs',   730, 'created_at',  'AI cost/latency; partitioned by year')
ON CONFLICT (source) DO NOTHING;

-- Supporting indices (idempotent)
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON public.audit_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_role_audit_log_created_at ON public.role_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON public.admin_activity_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_edge_function_logs_created_at ON public.edge_function_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_protected_call_log_created_at ON public.protected_call_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_csp_reports_received_at ON public.csp_reports (received_at DESC);
CREATE INDEX IF NOT EXISTS idx_cron_run_log_started_at ON public.cron_run_log (started_at DESC);

-- Unified normalised view across every audit source
CREATE OR REPLACE VIEW public.unified_audit_log
WITH (security_invoker = true) AS
SELECT
  'audit_logs'::text AS source,
  id,
  created_at AS event_time,
  user_id AS actor_id,
  action,
  table_name AS target_table,
  record_id::text AS target_id,
  host(ip_address) AS ip_address,
  user_agent,
  COALESCE(data_classification,'C2') AS severity,
  jsonb_build_object('old', old_data, 'new', new_data, 'reason', reason_code, 'purpose', purpose) AS payload
FROM public.audit_logs
UNION ALL
SELECT
  'role_audit_log', id, created_at, actor_id, action,
  'user_roles', target_user_id::text, NULL, NULL, 'C3',
  jsonb_build_object('role', role, 'metadata', metadata)
FROM public.role_audit_log
UNION ALL
SELECT
  'admin_activity_log', id, created_at, admin_user_id, action,
  resource_type, resource_id, ip_address, user_agent,
  CASE WHEN success THEN 'C2' ELSE 'C3' END,
  jsonb_build_object('resource_name', resource_name, 'old', old_value, 'new', new_value, 'success', success, 'error', error_message, 'session_id', session_id)
FROM public.admin_activity_log
UNION ALL
SELECT
  'edge_function_logs', id, created_at, NULL, status,
  function_name, invocation_id, NULL, NULL,
  CASE WHEN http_status >= 500 THEN 'C3' WHEN http_status >= 400 THEN 'C2' ELSE 'C1' END,
  jsonb_build_object('http_status', http_status, 'duration_ms', duration_ms, 'memory_mb', memory_mb, 'error', error_message, 'triggered_by', triggered_by)
FROM public.edge_function_logs
UNION ALL
SELECT
  'protected_call_log', id, created_at, caller_id, status,
  function_name, NULL, ip_address, user_agent,
  CASE status WHEN 'denied' THEN 'C3' WHEN 'error' THEN 'C3' ELSE 'C1' END,
  COALESCE(details, '{}'::jsonb)
FROM public.protected_call_log
UNION ALL
SELECT
  'csp_reports', id, received_at, NULL, 'csp_violation',
  violated_directive, blocked_uri, ip_address, user_agent, 'C2',
  jsonb_build_object('document_uri', document_uri, 'report', report)
FROM public.csp_reports
UNION ALL
SELECT
  'cron_run_log', id, started_at, NULL, status,
  'cron', job_name, NULL, NULL,
  CASE status WHEN 'error' THEN 'C3' WHEN 'success' THEN 'C1' ELSE 'C2' END,
  jsonb_build_object('finished_at', finished_at, 'duration_ms', duration_ms, 'rows_affected', rows_affected, 'error', error_message)
FROM public.cron_run_log
UNION ALL
SELECT
  'ai_operation_logs', id, created_at, user_id, job_type,
  entity_type, entity_id, NULL, NULL,
  CASE WHEN success THEN 'C1' ELSE 'C2' END,
  jsonb_build_object('model', model, 'prompt_version', prompt_version, 'input_tokens', input_tokens, 'output_tokens', output_tokens, 'latency_ms', latency_ms, 'cost_usd', cost_usd, 'cache_hit', cache_hit, 'error', error_message, 'metadata', metadata)
FROM public.ai_operation_logs;

REVOKE ALL ON public.unified_audit_log FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.unified_audit_log TO authenticated;
GRANT SELECT ON public.unified_audit_log TO service_role;

COMMENT ON VIEW public.unified_audit_log IS
  'C1 consolidation: normalised read-only view across every audit source. Admin-gated via underlying RLS. Do NOT write here — write to the specific source table so sanitiser triggers, RLS, and SIEM export continue to work.';

-- Retention runner: applies audit_retention_policy per source
CREATE OR REPLACE FUNCTION public.apply_audit_retention()
RETURNS TABLE(source text, rows_deleted integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pol record;
  n integer;
BEGIN
  FOR pol IN SELECT * FROM public.audit_retention_policy LOOP
    -- ai_operation_logs is partitioned by year; skip row-level delete, handled by partition drops
    IF pol.source = 'ai_operation_logs' THEN
      CONTINUE;
    END IF;
    EXECUTE format(
      'DELETE FROM public.%I WHERE %I < now() - ($1 || '' days'')::interval',
      pol.source, pol.time_column
    ) USING pol.retention_days::text;
    GET DIAGNOSTICS n = ROW_COUNT;
    source := pol.source; rows_deleted := n; RETURN NEXT;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.apply_audit_retention() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_audit_retention() TO service_role;

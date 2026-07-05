
-- ============ soc_incidents ============
CREATE TABLE public.soc_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_key text NOT NULL,
  source text NOT NULL,
  entity text,
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('critical','high','medium','low','info')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','acknowledged','resolved','suppressed')),
  title text NOT NULL,
  summary text,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  signal_count integer NOT NULL DEFAULT 1,
  sample_signal_ids text[] NOT NULL DEFAULT '{}',
  assignee_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  acknowledged_at timestamptz,
  acknowledged_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- one active incident per cluster
CREATE UNIQUE INDEX soc_incidents_active_cluster_uq
  ON public.soc_incidents (cluster_key)
  WHERE status IN ('open','acknowledged');

CREATE INDEX soc_incidents_status_idx ON public.soc_incidents (status, last_seen_at DESC);
CREATE INDEX soc_incidents_severity_idx ON public.soc_incidents (severity, last_seen_at DESC);
CREATE INDEX soc_incidents_source_idx ON public.soc_incidents (source, last_seen_at DESC);
CREATE INDEX soc_incidents_assignee_idx ON public.soc_incidents (assignee_id) WHERE assignee_id IS NOT NULL;

GRANT SELECT, INSERT, UPDATE ON public.soc_incidents TO authenticated;
GRANT ALL ON public.soc_incidents TO service_role;

ALTER TABLE public.soc_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view incidents"
  ON public.soc_incidents FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update incidents"
  ON public.soc_incidents FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert incidents"
  ON public.soc_incidents FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER soc_incidents_updated_at
  BEFORE UPDATE ON public.soc_incidents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ soc_incident_events ============
CREATE TABLE public.soc_incident_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid NOT NULL REFERENCES public.soc_incidents(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL CHECK (event_type IN ('created','signal_added','acknowledged','assigned','unassigned','resolved','reopened','suppressed','note','severity_changed')),
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX soc_incident_events_incident_idx
  ON public.soc_incident_events (incident_id, created_at DESC);

GRANT SELECT, INSERT ON public.soc_incident_events TO authenticated;
GRANT ALL ON public.soc_incident_events TO service_role;

ALTER TABLE public.soc_incident_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view incident events"
  ON public.soc_incident_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert incident events"
  ON public.soc_incident_events FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND actor_id = auth.uid());

-- ============ retention: 180 days for resolved incidents ============
INSERT INTO public.audit_retention_policy (source, time_column, retention_days)
VALUES ('soc_incident_events', 'created_at', 365)
ON CONFLICT DO NOTHING;

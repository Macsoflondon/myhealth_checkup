-- operational_alerts is created out-of-band on production; guard for preview environments.
DO $$ BEGIN
  ALTER TABLE public.operational_alerts REPLICA IDENTITY FULL;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

ALTER TABLE public.audit_logs REPLICA IDENTITY FULL;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.operational_alerts;
EXCEPTION WHEN undefined_table OR undefined_object THEN NULL;
END $$;

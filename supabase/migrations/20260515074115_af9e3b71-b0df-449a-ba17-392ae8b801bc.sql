
-- Audit log for role changes
CREATE TABLE IF NOT EXISTS public.role_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  target_user_id uuid NOT NULL,
  role app_role NOT NULL,
  action text NOT NULL CHECK (action IN ('granted','revoked')),
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read role audit log"
  ON public.role_audit_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Block client writes; only triggers (SECURITY DEFINER) and service_role insert.
CREATE POLICY "No client inserts to role audit log"
  ON public.role_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE INDEX IF NOT EXISTS idx_role_audit_target ON public.role_audit_log(target_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_role_audit_actor ON public.role_audit_log(actor_id, created_at DESC);

-- Trigger: capture every role grant/revoke
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.role_audit_log(actor_id, target_user_id, role, action, metadata)
    VALUES (auth.uid(), NEW.user_id, NEW.role, 'granted',
            jsonb_build_object('row_id', NEW.id));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.role_audit_log(actor_id, target_user_id, role, action, metadata)
    VALUES (auth.uid(), OLD.user_id, OLD.role, 'revoked',
            jsonb_build_object('row_id', OLD.id));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.role IS DISTINCT FROM OLD.role OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
      INSERT INTO public.role_audit_log(actor_id, target_user_id, role, action, metadata)
      VALUES (auth.uid(), OLD.user_id, OLD.role, 'revoked',
              jsonb_build_object('row_id', OLD.id, 'reason', 'updated'));
      INSERT INTO public.role_audit_log(actor_id, target_user_id, role, action, metadata)
      VALUES (auth.uid(), NEW.user_id, NEW.role, 'granted',
              jsonb_build_object('row_id', NEW.id, 'reason', 'updated'));
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_role_change ON public.user_roles;
CREATE TRIGGER trg_log_role_change
AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.log_role_change();

-- Generic protected-function call log (for edge functions / RPCs)
CREATE TABLE IF NOT EXISTS public.protected_call_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caller_id uuid,
  function_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('allowed','denied','error')),
  ip_address text,
  user_agent text,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.protected_call_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read protected call log"
  ON public.protected_call_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "No client writes to protected call log"
  ON public.protected_call_log FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE INDEX IF NOT EXISTS idx_protected_call_fn ON public.protected_call_log(function_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_protected_call_caller ON public.protected_call_log(caller_id, created_at DESC);

-- Create a trigger function to automatically set user_id from auth.uid() on audit_logs INSERT
-- This provides database-level security instead of relying solely on application layer

CREATE OR REPLACE FUNCTION public.set_audit_log_user_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Always set user_id from the authenticated user
  -- This prevents application-level manipulation of the user_id field
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the trigger
DROP TRIGGER IF EXISTS audit_logs_set_user_id ON public.audit_logs;
CREATE TRIGGER audit_logs_set_user_id
  BEFORE INSERT ON public.audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_audit_log_user_id();
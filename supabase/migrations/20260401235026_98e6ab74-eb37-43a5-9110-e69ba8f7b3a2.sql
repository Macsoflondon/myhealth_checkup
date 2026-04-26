-- Remove orphan audit rows with no user
DELETE FROM public.audit_logs WHERE user_id IS NULL;

-- Now safely enforce NOT NULL
ALTER TABLE public.audit_logs ALTER COLUMN user_id SET NOT NULL;

-- Recreate the SELECT policy restricted to authenticated
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;
CREATE POLICY "Users can view their own audit logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
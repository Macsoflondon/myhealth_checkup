-- Fix: Remove client-side INSERT policy on audit_logs
-- Audit logs should only be written by triggers/service role, not by clients
DROP POLICY IF EXISTS "Users can insert their own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can create their own audit logs" ON public.audit_logs;

-- Add admin-only SELECT policy for scraping_jobs so admins can monitor
DROP POLICY IF EXISTS "No access to scraping jobs" ON public.scraping_jobs;
CREATE POLICY "Admins can view scraping jobs"
  ON public.scraping_jobs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
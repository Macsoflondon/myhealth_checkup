
-- Fix 1: Remove sensitive tables from Realtime publications (guarded — tables may not be in publication on fresh DBs)
DO $$ BEGIN ALTER PUBLICATION supabase_realtime DROP TABLE public.audit_logs; EXCEPTION WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime DROP TABLE public.scraping_jobs; EXCEPTION WHEN undefined_object THEN NULL; END $$;

-- Fix 2: Consolidate user_roles SELECT policies - remove duplicate
DROP POLICY IF EXISTS "user_roles_owner_select" ON public.user_roles;

-- Fix 3: Add user_health_scores UPDATE and DELETE policies for GDPR
CREATE POLICY "Users can delete their own health scores"
  ON public.user_health_scores FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own health scores"
  ON public.user_health_scores FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

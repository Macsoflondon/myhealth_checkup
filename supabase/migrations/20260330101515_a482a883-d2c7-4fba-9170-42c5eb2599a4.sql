-- Fix 4: Remove user-specific tables from Realtime (separate statements)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.biomarker_readings;
  EXCEPTION WHEN undefined_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.price_alert_preferences;
  EXCEPTION WHEN undefined_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.saved_comparisons;
  EXCEPTION WHEN undefined_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.saved_providers;
  EXCEPTION WHEN undefined_object THEN NULL;
  END;
END $$;

-- Fix 6: Remove overly broad lola_health_products SELECT
DROP POLICY IF EXISTS "lola_products_viewable_by_dashboard_users" ON public.lola_health_products;

-- Fix 7: Videos bucket — enforce ownership on INSERT
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'videos'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );
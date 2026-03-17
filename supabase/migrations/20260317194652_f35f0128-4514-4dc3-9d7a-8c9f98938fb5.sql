-- Clean up duplicate RLS policies on user_profiles
DROP POLICY IF EXISTS "user_profiles_owner_delete" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_owner_insert" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_owner_select" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_owner_update" ON public.user_profiles;

-- Clean up duplicate RLS policies on user_consents
DROP POLICY IF EXISTS "user_consents_owner_delete" ON public.user_consents;
DROP POLICY IF EXISTS "user_consents_owner_insert" ON public.user_consents;
DROP POLICY IF EXISTS "user_consents_owner_select" ON public.user_consents;
DROP POLICY IF EXISTS "user_consents_owner_update" ON public.user_consents;

-- Clean up duplicate RLS policies on user_health_data
DROP POLICY IF EXISTS "user_health_data_owner_delete" ON public.user_health_data;
DROP POLICY IF EXISTS "user_health_data_owner_insert" ON public.user_health_data;
DROP POLICY IF EXISTS "user_health_data_owner_select" ON public.user_health_data;
DROP POLICY IF EXISTS "user_health_data_owner_update" ON public.user_health_data;

-- Clean up duplicate RLS policies on user_health_scores
DROP POLICY IF EXISTS "user_health_scores_owner_delete" ON public.user_health_scores;
DROP POLICY IF EXISTS "user_health_scores_owner_insert" ON public.user_health_scores;
DROP POLICY IF EXISTS "user_health_scores_owner_select" ON public.user_health_scores;
DROP POLICY IF EXISTS "user_health_scores_owner_update" ON public.user_health_scores;

-- Clean up duplicate RLS policies on user_preferences
DROP POLICY IF EXISTS "user_preferences_owner_delete" ON public.user_preferences;
DROP POLICY IF EXISTS "user_preferences_owner_insert" ON public.user_preferences;
DROP POLICY IF EXISTS "user_preferences_owner_select" ON public.user_preferences;
DROP POLICY IF EXISTS "user_preferences_owner_update" ON public.user_preferences;
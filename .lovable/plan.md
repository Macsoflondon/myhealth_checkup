

# Security Review — Fix Plan

## Scan Results: 7 Findings

| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| 1 | error | Audit logs SELECT policy on `public` role — NULL user_id rows readable by unauthenticated users | Change policy to `authenticated` role |
| 2 | error | `user_consents` policies on `public` role — unauthenticated access possible | Change all policies to `authenticated` role |
| 3 | error | `notification_history` policies on `public` role | Change policies to `authenticated` role |
| 4 | error | `biomarker_readings`, `price_alert_preferences`, `saved_comparisons`, `saved_providers` in Realtime publication — private data broadcast | Remove these 4 tables from `supabase_realtime` publication |
| 5 | error | No RLS on `realtime.messages` — any user can subscribe to any channel | Cannot add RLS to `realtime.messages` (reserved schema). Mitigation: remove sensitive tables from Realtime (fix 4) |
| 6 | warn | `lola_health_products` has permissive SELECT for all authenticated users | Remove the overly broad `lola_products_viewable_by_dashboard_users` policy |
| 7 | warn | Videos bucket INSERT policy lacks ownership path check | Update INSERT policy to require `auth.uid()::text = (storage.foldername(name))[1]` |
| 8 | warn | Leaked Password Protection disabled | Manual: enable in Supabase Dashboard → Auth → Password Protection |
| 9 | warn | `user_roles` privilege escalation via `has_role` recursion | Verify no triggers/functions allow non-admin INSERT — the `handle_new_user_profile` trigger inserts default `'user'` role only, which is safe. Mark as reviewed. |

## Single Migration

One SQL migration covering fixes 1–4, 6–7:

```sql
-- Fix 1: audit_logs — restrict SELECT to authenticated only
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;
CREATE POLICY "Users can view their own audit logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Fix 2: user_consents — restrict all policies to authenticated
DROP POLICY IF EXISTS "Users can view their own consents" ON public.user_consents;
CREATE POLICY "Users can view their own consents"
  ON public.user_consents FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own consents" ON public.user_consents;
CREATE POLICY "Users can create their own consents"
  ON public.user_consents FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own consents" ON public.user_consents;
CREATE POLICY "Users can update their own consents"
  ON public.user_consents FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Fix 3: notification_history — restrict to authenticated
DROP POLICY IF EXISTS "Users can view their own notification history" ON public.notification_history;
CREATE POLICY "Users can view their own notification history"
  ON public.notification_history FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own notification history" ON public.notification_history;
CREATE POLICY "Users can insert their own notification history"
  ON public.notification_history FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Notification history cannot be deleted" ON public.notification_history;
CREATE POLICY "Notification history cannot be deleted"
  ON public.notification_history FOR DELETE TO authenticated
  USING (false);

DROP POLICY IF EXISTS "Notification history cannot be updated" ON public.notification_history;
CREATE POLICY "Notification history cannot be updated"
  ON public.notification_history FOR UPDATE TO authenticated
  USING (false) WITH CHECK (false);

-- Fix 4: Remove user-specific tables from Realtime
ALTER PUBLICATION supabase_realtime
  DROP TABLE IF EXISTS public.biomarker_readings,
  DROP TABLE IF EXISTS public.price_alert_preferences,
  DROP TABLE IF EXISTS public.saved_comparisons,
  DROP TABLE IF EXISTS public.saved_providers;

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
```

## Manual Steps (cannot be done via code)

- **Leaked Password Protection**: Enable in Supabase Dashboard → Authentication → Providers → Email → "Password HIBP Check"

## Finding 5 & 9 — No code fix needed

- **Realtime messages RLS**: Cannot modify `realtime` schema (reserved). Removing sensitive tables from the publication (fix 4) eliminates the data leak vector.
- **user_roles privilege escalation**: The only non-admin INSERT path is the `handle_new_user_profile` trigger which hardcodes `'user'` role. No escalation vector exists. Will mark as reviewed.

## Files affected
- One new SQL migration file


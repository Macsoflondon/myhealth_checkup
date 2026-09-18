-- These tables store per-user convenience/consent data with a NOT NULL user_id
-- column but no foreign key to auth.users, so a deleted auth account leaves
-- orphaned rows behind silently (confirmed: saved_providers already has 11/11
-- rows orphaned this way — excluded here pending manual cleanup, see audit notes).
-- Verified zero existing orphans in each table below before adding the constraint,
-- so it validates immediately with no data changes. ON DELETE CASCADE matches the
-- existing convention for equivalent user-owned tables (user_preferences,
-- user_health_data, user_consents, uploaded_test_results, etc.).

ALTER TABLE public.favorites
  ADD CONSTRAINT favorites_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.saved_comparisons
  ADD CONSTRAINT saved_comparisons_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.price_alert_preferences
  ADD CONSTRAINT price_alert_preferences_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.data_sharing_grants
  ADD CONSTRAINT data_sharing_grants_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
-- =====================================================================
-- Phase 0 / W1 / P0.08 — retire the dead duplicate profile table.
--
-- PREFLIGHT EVIDENCE (live, 14 September 2026, read-only):
--   row_count            = 0
--   table grants         = 0  (PostgREST cannot reach it at all)
--   triggers             = 0
--   inbound foreign keys = 0
--   dependent views      = 0
--   functions referencing bare `profiles` = 0
--   realtime publications = 0
--   policies             = 3 (dropped with the table)
--   code references      = 0 outside historical migration files
--
-- public.handle_new_user_profile() writes to public.user_profiles,
-- public.user_preferences and public.user_roles. It does NOT reference
-- public.profiles. The auth.users trigger `on_auth_user_created_profile`
-- therefore continues to work unchanged; the auth schema is not touched.
--
-- user_profiles is canonical and is NOT modified by this migration.
--
-- ROLLBACK (restores the exact observed state — no grants, RLS on, 3 policies):
--   CREATE TABLE public.profiles (
--     id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
--     email text,
--     display_name text,
--     created_at timestamptz NOT NULL DEFAULT now()
--   );
--   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
--   CREATE POLICY "profiles self read"   ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
--   CREATE POLICY "profiles self insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
--   CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
--
-- NOTE: no point-in-time-recovery position was verifiable from this session
-- (dashboard-only). The operation is safe without one because the table is
-- provably empty and unreachable, and the rollback above is complete.
-- =====================================================================

DROP TABLE IF EXISTS public.profiles;

-- The function name is historical and misleading. It is NOT renamed: it is
-- bound to the auth.users trigger `on_auth_user_created_profile`, and the auth
-- schema is reserved and must not be modified. A comment records the truth
-- without touching either object.
COMMENT ON FUNCTION public.handle_new_user_profile() IS
  'Signup handler. Despite the name, this inserts into public.user_profiles (canonical), public.user_preferences and public.user_roles. It has never written to the retired public.profiles table. Bound to auth.users trigger on_auth_user_created_profile — do not rename (auth schema is reserved).';
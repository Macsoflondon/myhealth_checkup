
-- Profiles (new, separate from existing user_profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles self read"   ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles self insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Engine tables
CREATE TABLE public.engine_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  command TEXT NOT NULL,
  skill TEXT NOT NULL,
  scope TEXT,
  notes TEXT,
  parser TEXT NOT NULL DEFAULT 'deterministic',
  status TEXT NOT NULL DEFAULT 'pending',
  current_stage TEXT NOT NULL DEFAULT 'INIT',
  stages JSONB NOT NULL DEFAULT '[]'::jsonb,
  result JSONB,
  created_by UUID,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.engine_runs TO authenticated;
GRANT ALL ON public.engine_runs TO service_role;
ALTER TABLE public.engine_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "runs read auth"   ON public.engine_runs FOR SELECT TO authenticated USING (true);
CREATE POLICY "runs write admin" ON public.engine_runs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.engine_freezes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unfrozen_at TIMESTAMPTZ,
  unfrozen_by UUID,
  unfreeze_reason TEXT
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.engine_freezes TO authenticated;
GRANT ALL ON public.engine_freezes TO service_role;
ALTER TABLE public.engine_freezes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "freezes read auth"   ON public.engine_freezes FOR SELECT TO authenticated USING (true);
CREATE POLICY "freezes write admin" ON public.engine_freezes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.engine_checkpoints (
  id TEXT PRIMARY KEY,
  note TEXT NOT NULL,
  files JSONB NOT NULL DEFAULT '[]'::jsonb,
  snapshot JSONB,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.engine_checkpoints TO authenticated;
GRANT ALL ON public.engine_checkpoints TO service_role;
ALTER TABLE public.engine_checkpoints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cp read auth"    ON public.engine_checkpoints FOR SELECT TO authenticated USING (true);
CREATE POLICY "cp write admin"  ON public.engine_checkpoints FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.engine_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES public.engine_runs(id) ON DELETE SET NULL,
  skill TEXT NOT NULL,
  stage TEXT NOT NULL,
  status TEXT NOT NULL,
  scope TEXT,
  message TEXT,
  metadata JSONB,
  actor UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.engine_audit_log TO authenticated;
GRANT ALL ON public.engine_audit_log TO service_role;
ALTER TABLE public.engine_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit read auth"     ON public.engine_audit_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "audit insert admin"  ON public.engine_audit_log FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Realtime
ALTER TABLE public.engine_audit_log REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.engine_audit_log;

-- First user auto-admin promotion (supplements existing handle_new_user_profile trigger)
CREATE OR REPLACE FUNCTION public.promote_first_user_to_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users;
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created_engine ON auth.users;
CREATE TRIGGER on_auth_user_created_engine
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.promote_first_user_to_admin();

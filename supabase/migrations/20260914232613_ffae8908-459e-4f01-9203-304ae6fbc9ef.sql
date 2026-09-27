-- Remediation for linter 0028/0029: the three helpers introduced with the
-- Health Intelligence groundwork were reachable over the exposed API. Move
-- them into a `private` schema, which PostgREST does not expose, and rebuild
-- the policies that reference them. Behaviour is unchanged.

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM public, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.owns_health_profile(_profile_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.health_profiles hp
    WHERE hp.id = _profile_id AND hp.user_id = auth.uid()
  )
$$;

CREATE OR REPLACE FUNCTION private.is_org_member(_org_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organisation_members m
    WHERE m.organisation_id = _org_id AND m.user_id = auth.uid() AND m.is_active
  )
$$;

CREATE OR REPLACE FUNCTION private.observations_guard()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.source_value IS DISTINCT FROM OLD.source_value
       OR NEW.source_unit IS DISTINCT FROM OLD.source_unit
       OR NEW.source_reference_low IS DISTINCT FROM OLD.source_reference_low
       OR NEW.source_reference_high IS DISTINCT FROM OLD.source_reference_high
       OR NEW.source_document_id IS DISTINCT FROM OLD.source_document_id
       OR NEW.diagnostic_report_id IS DISTINCT FROM OLD.diagnostic_report_id THEN
      RAISE EXCEPTION 'Observation provenance is immutable. Supersede the observation instead.';
    END IF;
  END IF;
  IF NEW.verification_status = 'confirmed' AND NEW.verified_at IS NULL THEN
    NEW.verified_at := now();
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.owns_health_profile(uuid) FROM public, anon;
REVOKE ALL ON FUNCTION private.is_org_member(uuid) FROM public, anon;
REVOKE ALL ON FUNCTION private.observations_guard() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.owns_health_profile(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_org_member(uuid) TO authenticated, service_role;

-- Re-point the trigger.
DROP TRIGGER observations_guard_trg ON public.observations;
CREATE TRIGGER observations_guard_trg
  BEFORE INSERT OR UPDATE ON public.observations
  FOR EACH ROW EXECUTE FUNCTION private.observations_guard();

-- Re-point the policies.
DROP POLICY "source_documents owner read" ON public.source_documents;
CREATE POLICY "source_documents owner read" ON public.source_documents
  FOR SELECT TO authenticated USING (private.owns_health_profile(health_profile_id));
DROP POLICY "source_documents owner insert" ON public.source_documents;
CREATE POLICY "source_documents owner insert" ON public.source_documents
  FOR INSERT TO authenticated WITH CHECK (private.owns_health_profile(health_profile_id));

DROP POLICY "diagnostic_reports owner read released" ON public.diagnostic_reports;
CREATE POLICY "diagnostic_reports owner read released" ON public.diagnostic_reports
  FOR SELECT TO authenticated
  USING (private.owns_health_profile(health_profile_id) AND status = 'released');

DROP POLICY "specimens owner read" ON public.specimens;
CREATE POLICY "specimens owner read" ON public.specimens
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.diagnostic_reports r
    WHERE r.id = diagnostic_report_id
      AND private.owns_health_profile(r.health_profile_id)
      AND r.status = 'released'));

DROP POLICY "observations owner read released" ON public.observations;
CREATE POLICY "observations owner read released" ON public.observations
  FOR SELECT TO authenticated
  USING (private.owns_health_profile(health_profile_id) AND EXISTS (
    SELECT 1 FROM public.diagnostic_reports r
    WHERE r.id = diagnostic_report_id AND r.status = 'released'));

DROP POLICY "observation_reference_ranges owner read" ON public.observation_reference_ranges;
CREATE POLICY "observation_reference_ranges owner read"
  ON public.observation_reference_ranges FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.observations o
    WHERE o.id = observation_id AND private.owns_health_profile(o.health_profile_id)));

DROP POLICY "result_release_events owner read" ON public.result_release_events;
CREATE POLICY "result_release_events owner read" ON public.result_release_events
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.diagnostic_reports r
    WHERE r.id = diagnostic_report_id
      AND private.owns_health_profile(r.health_profile_id)
      AND r.status = 'released'));

DROP POLICY "clinical_review_comments subject read" ON public.clinical_review_comments;
CREATE POLICY "clinical_review_comments subject read"
  ON public.clinical_review_comments FOR SELECT TO authenticated
  USING (is_released AND (
    (diagnostic_report_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.diagnostic_reports r
      WHERE r.id = diagnostic_report_id AND private.owns_health_profile(r.health_profile_id)))
    OR (observation_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.observations o
      WHERE o.id = observation_id AND private.owns_health_profile(o.health_profile_id)))));

DROP POLICY "organisations member read" ON public.organisations;
CREATE POLICY "organisations member read" ON public.organisations
  FOR SELECT TO authenticated
  USING (private.is_org_member(id) OR public.has_role(auth.uid(),'admin'));

-- Retire the now-unreferenced public copies.
DROP FUNCTION IF EXISTS public.owns_health_profile(uuid);
DROP FUNCTION IF EXISTS public.is_org_member(uuid);
DROP FUNCTION IF EXISTS public.observations_guard();
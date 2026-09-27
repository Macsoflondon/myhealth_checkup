-- =====================================================================
-- Health Intelligence groundwork. ADDITIVE ONLY.
-- Nothing existing is dropped, renamed or altered. All tables start empty.
-- Canonical decisions honoured: biomarker_hub is the biomarker catalogue,
-- audit_logs is the audit table, clinical_consent_records is the consent
-- foundation, clinical_reference_ranges remains the range DEFINITIONS table.
-- No Forth-specific column exists anywhere: Forth is one optional adapter row.
-- =====================================================================

-- ---------- enumerations -------------------------------------------------
CREATE TYPE public.hi_report_status AS ENUM
  ('draft','awaiting_review','reviewed','released','superseded','cancelled');
CREATE TYPE public.hi_release_policy AS ENUM
  ('immediate','clinician_review','manual');
CREATE TYPE public.hi_validation_status AS ENUM
  ('pending','passed','failed','overridden');
CREATE TYPE public.hi_verification_status AS ENUM
  ('unverified','confirmed','corrected','rejected');
CREATE TYPE public.hi_value_type AS ENUM
  ('quantitative','qualitative','ratio','titre','text');
CREATE TYPE public.hi_extraction_method AS ENUM
  ('manual_entry','api','fhir','pdf_extraction','ocr','adapter');
CREATE TYPE public.hi_cycle_phase AS ENUM
  ('unknown','menstrual','follicular','ovulatory','luteal','not_applicable');
CREATE TYPE public.hi_menstrual_status AS ENUM
  ('unknown','regular_cycling','irregular_cycling','pregnant','postpartum',
   'perimenopausal','postmenopausal','hormonal_contraception','hrt','not_applicable');
CREATE TYPE public.hi_org_role AS ENUM ('owner','admin','practitioner','support');
CREATE TYPE public.hi_notification_channel AS ENUM ('email','sms','push','in_app');
CREATE TYPE public.hi_notification_status AS ENUM
  ('pending','queued','sent','delivered','failed','suppressed');
CREATE TYPE public.hi_adapter_kind AS ENUM
  ('laboratory_api','partner_platform','fhir','document_upload','manual_entry');
CREATE TYPE public.hi_adapter_status AS ENUM ('planned','sandbox','disabled','live');

-- ---------- 1. health profiles ------------------------------------------
CREATE TABLE public.health_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  display_name text,
  date_of_birth date,
  sex_at_birth text,
  gender_identity text,
  relationship text NOT NULL DEFAULT 'self',
  is_primary boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.health_profiles IS
  'A person whose health record we hold. Deliberately separate from auth.users so a dependant profile can exist without an account. Follows the user_profiles key convention (surrogate id + user_id).';
CREATE UNIQUE INDEX health_profiles_one_primary_per_user
  ON public.health_profiles (user_id) WHERE is_primary;
CREATE INDEX health_profiles_user_idx ON public.health_profiles (user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.health_profiles TO authenticated;
GRANT ALL ON public.health_profiles TO service_role;
ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "health_profiles owner all" ON public.health_profiles
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Ownership helper. SECURITY DEFINER so child-table policies never recurse
-- back through health_profiles' own policy.
CREATE OR REPLACE FUNCTION public.owns_health_profile(_profile_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.health_profiles hp
    WHERE hp.id = _profile_id AND hp.user_id = auth.uid()
  )
$$;

-- ---------- 2. source documents -----------------------------------------
CREATE TABLE public.source_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  health_profile_id uuid NOT NULL REFERENCES public.health_profiles(id) ON DELETE CASCADE,
  storage_bucket text NOT NULL DEFAULT 'test-results',
  storage_path text NOT NULL,
  original_filename text,
  mime_type text,
  byte_size bigint,
  checksum_sha256 text,
  page_count integer,
  uploaded_by uuid,
  clinical_patient_upload_id uuid REFERENCES public.clinical_patient_uploads(id) ON DELETE SET NULL,
  retained_until date,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.source_documents IS
  'The original laboratory document. This is the source evidence; every trusted observation must be traceable back to a row here. Never expose storage_path through a public URL.';
CREATE INDEX source_documents_profile_idx ON public.source_documents (health_profile_id);

GRANT SELECT, INSERT ON public.source_documents TO authenticated;
GRANT ALL ON public.source_documents TO service_role;
ALTER TABLE public.source_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "source_documents owner read" ON public.source_documents
  FOR SELECT TO authenticated USING (public.owns_health_profile(health_profile_id));
CREATE POLICY "source_documents owner insert" ON public.source_documents
  FOR INSERT TO authenticated WITH CHECK (public.owns_health_profile(health_profile_id));

-- ---------- 3. ingestion adapters ---------------------------------------
CREATE TABLE public.ingestion_adapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adapter_key text NOT NULL UNIQUE,
  display_name text NOT NULL,
  kind public.hi_adapter_kind NOT NULL,
  status public.hi_adapter_status NOT NULL DEFAULT 'planned',
  supports_source_document boolean NOT NULL DEFAULT false,
  supports_bulk_export boolean NOT NULL DEFAULT false,
  default_release_policy public.hi_release_policy NOT NULL DEFAULT 'manual',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.ingestion_adapters IS
  'Every inbound route converges here: laboratory APIs, partner platforms, FHIR, document upload and manual entry. No adapter is privileged in the canonical schema. supports_source_document and supports_bulk_export encode the two hard partner requirements (original document retained, full export on demand and on exit).';

GRANT SELECT ON public.ingestion_adapters TO authenticated;
GRANT ALL ON public.ingestion_adapters TO service_role;
ALTER TABLE public.ingestion_adapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ingestion_adapters admin manage" ON public.ingestion_adapters
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ---------- 4. organisations and practitioners --------------------------
CREATE TABLE public.organisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  registration_body text,
  registration_number text,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.organisation_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role public.hi_org_role NOT NULL DEFAULT 'practitioner',
  professional_registration text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organisation_id, user_id)
);
COMMENT ON TABLE public.organisation_members IS
  'Practitioner roles inside a clinic. Deliberately grants NO access to any health data: the practitioner console is not enabled until permissions and clinical governance are complete.';

CREATE OR REPLACE FUNCTION public.is_org_member(_org_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organisation_members m
    WHERE m.organisation_id = _org_id AND m.user_id = auth.uid() AND m.is_active
  )
$$;

GRANT SELECT ON public.organisations TO authenticated;
GRANT ALL ON public.organisations TO service_role;
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "organisations member read" ON public.organisations
  FOR SELECT TO authenticated
  USING (public.is_org_member(id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "organisations admin manage" ON public.organisations
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

GRANT SELECT ON public.organisation_members TO authenticated;
GRANT ALL ON public.organisation_members TO service_role;
ALTER TABLE public.organisation_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "organisation_members self read" ON public.organisation_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "organisation_members admin manage" ON public.organisation_members
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ---------- 5. diagnostic reports ---------------------------------------
CREATE TABLE public.diagnostic_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  health_profile_id uuid NOT NULL REFERENCES public.health_profiles(id) ON DELETE CASCADE,
  source_document_id uuid REFERENCES public.source_documents(id) ON DELETE SET NULL,
  adapter_id uuid REFERENCES public.ingestion_adapters(id) ON DELETE SET NULL,
  ordering_organisation_id uuid REFERENCES public.organisations(id) ON DELETE SET NULL,
  external_id text,
  laboratory_name text,
  panel_name text,
  report_date date,
  collected_at timestamptz,
  resulted_at timestamptz,
  status public.hi_report_status NOT NULL DEFAULT 'draft',
  release_policy public.hi_release_policy NOT NULL DEFAULT 'manual',
  released_at timestamptz,
  superseded_by uuid REFERENCES public.diagnostic_reports(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (adapter_id, external_id)
);
COMMENT ON TABLE public.diagnostic_reports IS
  'Report-level context (FHIR DiagnosticReport). Atomic measurements live in observations. status is the release state machine; released_at is set only by a recorded release event.';
CREATE INDEX diagnostic_reports_profile_idx ON public.diagnostic_reports (health_profile_id, report_date DESC);

GRANT SELECT ON public.diagnostic_reports TO authenticated;
GRANT ALL ON public.diagnostic_reports TO service_role;
ALTER TABLE public.diagnostic_reports ENABLE ROW LEVEL SECURITY;
-- The owner can only see a report once it has actually been released. Drafts
-- and awaiting-review reports are invisible until release, by design.
CREATE POLICY "diagnostic_reports owner read released" ON public.diagnostic_reports
  FOR SELECT TO authenticated
  USING (public.owns_health_profile(health_profile_id) AND status = 'released');

-- ---------- 6. specimens -------------------------------------------------
CREATE TABLE public.specimens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnostic_report_id uuid NOT NULL REFERENCES public.diagnostic_reports(id) ON DELETE CASCADE,
  specimen_type text,
  collection_method text,
  collected_at timestamptz,
  received_at timestamptz,
  fasting boolean,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.specimens TO authenticated;
GRANT ALL ON public.specimens TO service_role;
ALTER TABLE public.specimens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "specimens owner read" ON public.specimens
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.diagnostic_reports r
    WHERE r.id = diagnostic_report_id
      AND public.owns_health_profile(r.health_profile_id)
      AND r.status = 'released'));

-- ---------- 7. observations (authoritative result table) -----------------
CREATE TABLE public.observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  health_profile_id uuid NOT NULL REFERENCES public.health_profiles(id) ON DELETE CASCADE,
  diagnostic_report_id uuid NOT NULL REFERENCES public.diagnostic_reports(id) ON DELETE CASCADE,
  biomarker_id uuid REFERENCES public.biomarker_hub(id) ON DELETE RESTRICT,
  specimen_id uuid REFERENCES public.specimens(id) ON DELETE SET NULL,

  -- source, exactly as the laboratory reported it. Never overwritten.
  source_biomarker_label text,
  source_value text NOT NULL,
  source_value_numeric numeric,
  source_unit text,
  source_reference_low numeric,
  source_reference_high numeric,
  source_reference_text text,
  source_flag text,

  -- canonical, derived by deterministic conversion only.
  canonical_value numeric,
  canonical_unit text,
  value_type public.hi_value_type NOT NULL DEFAULT 'quantitative',

  collected_at timestamptz,
  resulted_at timestamptz,
  laboratory_name text,
  method text,

  -- provenance
  source_document_id uuid REFERENCES public.source_documents(id) ON DELETE SET NULL,
  source_page integer,
  source_text text,
  extraction_method public.hi_extraction_method NOT NULL DEFAULT 'manual_entry',
  extraction_confidence numeric CHECK (extraction_confidence IS NULL
    OR (extraction_confidence >= 0 AND extraction_confidence <= 1)),

  -- trust
  validation_status public.hi_validation_status NOT NULL DEFAULT 'pending',
  verification_status public.hi_verification_status NOT NULL DEFAULT 'unverified',
  verified_by uuid,
  verified_at timestamptz,
  supersedes_observation_id uuid REFERENCES public.observations(id) ON DELETE SET NULL,

  -- physiological context
  cycle_day integer CHECK (cycle_day IS NULL OR (cycle_day >= 1 AND cycle_day <= 60)),
  cycle_phase public.hi_cycle_phase NOT NULL DEFAULT 'unknown',
  menstrual_status public.hi_menstrual_status NOT NULL DEFAULT 'unknown',
  hormone_medication_context text,

  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.observations IS
  'The authoritative atomic result. Deliberately carries NO interpretation, trend or AI-derived field: trend mathematics is derived at query time and clinician opinion lives in clinical_review_comments. An observation is trusted only when verification_status = confirmed. Source value, unit and range are immutable after insert.';
CREATE INDEX observations_series_idx
  ON public.observations (health_profile_id, biomarker_id, collected_at DESC);
CREATE INDEX observations_report_idx ON public.observations (diagnostic_report_id);

-- Provenance is immutable, and trust cannot be self-awarded by an end user.
CREATE OR REPLACE FUNCTION public.observations_guard()
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
CREATE TRIGGER observations_guard_trg
  BEFORE INSERT OR UPDATE ON public.observations
  FOR EACH ROW EXECUTE FUNCTION public.observations_guard();

GRANT SELECT ON public.observations TO authenticated;
GRANT ALL ON public.observations TO service_role;
ALTER TABLE public.observations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "observations owner read released" ON public.observations
  FOR SELECT TO authenticated
  USING (public.owns_health_profile(health_profile_id) AND EXISTS (
    SELECT 1 FROM public.diagnostic_reports r
    WHERE r.id = diagnostic_report_id AND r.status = 'released'));

-- ---------- 8. per-observation historical reference range ---------------
CREATE TABLE public.observation_reference_ranges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  observation_id uuid NOT NULL REFERENCES public.observations(id) ON DELETE CASCADE,
  range_low numeric,
  range_high numeric,
  range_text text,
  unit text,
  applies_to text,
  cycle_phase public.hi_cycle_phase,
  source text NOT NULL DEFAULT 'laboratory',
  captured_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.observation_reference_ranges IS
  'The reference range as it stood when the result was produced, frozen against the observation. Definitions for current ranges stay in clinical_reference_ranges; this table exists so a historical result is never re-judged against a range that did not apply to it.';
CREATE INDEX observation_reference_ranges_obs_idx
  ON public.observation_reference_ranges (observation_id);

GRANT SELECT ON public.observation_reference_ranges TO authenticated;
GRANT ALL ON public.observation_reference_ranges TO service_role;
ALTER TABLE public.observation_reference_ranges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "observation_reference_ranges owner read"
  ON public.observation_reference_ranges FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.observations o
    WHERE o.id = observation_id AND public.owns_health_profile(o.health_profile_id)));

-- ---------- 9. context-specific range definitions -----------------------
CREATE TABLE public.reference_range_contexts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinical_reference_range_id uuid REFERENCES public.clinical_reference_ranges(id) ON DELETE CASCADE,
  biomarker_id uuid REFERENCES public.biomarker_hub(id) ON DELETE CASCADE,
  cycle_phase public.hi_cycle_phase,
  cycle_day_min integer,
  cycle_day_max integer,
  menstrual_status public.hi_menstrual_status,
  hormone_medication_context text,
  min_value numeric,
  max_value numeric,
  unit text,
  evidence_source text,
  jurisdiction text NOT NULL DEFAULT 'UK',
  governance_status text NOT NULL DEFAULT 'draft',
  effective_from date,
  review_due date,
  version integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (clinical_reference_range_id IS NOT NULL OR biomarker_id IS NOT NULL)
);
COMMENT ON TABLE public.reference_range_contexts IS
  'Context-specific reference ranges (cycle phase, cycle day window, menstrual status, hormone medication). Versioned, evidence-sourced and governance-gated: is_active stays false until a range is clinically signed off. No proprietary third-party scoring model is reproduced here.';

GRANT SELECT ON public.reference_range_contexts TO authenticated;
GRANT SELECT ON public.reference_range_contexts TO anon;
GRANT ALL ON public.reference_range_contexts TO service_role;
ALTER TABLE public.reference_range_contexts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reference_range_contexts public read active"
  ON public.reference_range_contexts FOR SELECT TO anon, authenticated
  USING (is_active AND governance_status = 'approved');
CREATE POLICY "reference_range_contexts admin manage"
  ON public.reference_range_contexts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ---------- 10. release events (append-only audit) ----------------------
CREATE TABLE public.result_release_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnostic_report_id uuid NOT NULL REFERENCES public.diagnostic_reports(id) ON DELETE CASCADE,
  from_status public.hi_report_status,
  to_status public.hi_report_status NOT NULL,
  actor_user_id uuid,
  actor_kind text NOT NULL DEFAULT 'system',
  reason text,
  policy_applied public.hi_release_policy,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.result_release_events IS
  'Append-only release state machine audit. A report status may only be understood through this log. Rows are never updated or deleted — no grant exists for either operation.';
CREATE INDEX result_release_events_report_idx
  ON public.result_release_events (diagnostic_report_id, occurred_at);

GRANT SELECT ON public.result_release_events TO authenticated;
GRANT ALL ON public.result_release_events TO service_role;
ALTER TABLE public.result_release_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "result_release_events owner read" ON public.result_release_events
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.diagnostic_reports r
    WHERE r.id = diagnostic_report_id
      AND public.owns_health_profile(r.health_profile_id)
      AND r.status = 'released'));

-- ---------- 11. clinician commentary ------------------------------------
CREATE TABLE public.clinical_review_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnostic_report_id uuid REFERENCES public.diagnostic_reports(id) ON DELETE CASCADE,
  observation_id uuid REFERENCES public.observations(id) ON DELETE CASCADE,
  organisation_id uuid REFERENCES public.organisations(id) ON DELETE SET NULL,
  author_user_id uuid NOT NULL,
  author_display_name text,
  author_registration text,
  body text NOT NULL,
  is_released boolean NOT NULL DEFAULT false,
  released_at timestamptz,
  superseded_by uuid REFERENCES public.clinical_review_comments(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (diagnostic_report_id IS NOT NULL OR observation_id IS NOT NULL)
);
COMMENT ON TABLE public.clinical_review_comments IS
  'Clinician commentary attached to a report or a single result. Explicitly NOT clinical truth and never merged into an observation. Corrections are made by superseding, never by editing — no UPDATE grant exists.';

GRANT SELECT, INSERT ON public.clinical_review_comments TO authenticated;
GRANT ALL ON public.clinical_review_comments TO service_role;
ALTER TABLE public.clinical_review_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clinical_review_comments subject read"
  ON public.clinical_review_comments FOR SELECT TO authenticated
  USING (is_released AND (
    (diagnostic_report_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.diagnostic_reports r
      WHERE r.id = diagnostic_report_id AND public.owns_health_profile(r.health_profile_id)))
    OR (observation_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.observations o
      WHERE o.id = observation_id AND public.owns_health_profile(o.health_profile_id)))));
CREATE POLICY "clinical_review_comments author read"
  ON public.clinical_review_comments FOR SELECT TO authenticated
  USING (author_user_id = auth.uid());

-- ---------- 12. curated test profiles -----------------------------------
CREATE TABLE public.curated_test_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  summary text,
  clinical_rationale text,
  is_published boolean NOT NULL DEFAULT false,
  version integer NOT NULL DEFAULT 1,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.curated_test_profiles IS
  'Internally curated biomarker bundles. A clinical-rule entity, deliberately separate from the commercial catalogue: it carries no price, no provider ranking and no commission field, and must never be ordered by affiliate value.';

CREATE TABLE public.curated_test_profile_biomarkers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  curated_test_profile_id uuid NOT NULL REFERENCES public.curated_test_profiles(id) ON DELETE CASCADE,
  biomarker_id uuid NOT NULL REFERENCES public.biomarker_hub(id) ON DELETE RESTRICT,
  is_core boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (curated_test_profile_id, biomarker_id)
);

GRANT SELECT ON public.curated_test_profiles TO anon, authenticated;
GRANT ALL ON public.curated_test_profiles TO service_role;
ALTER TABLE public.curated_test_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "curated_test_profiles public read published"
  ON public.curated_test_profiles FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "curated_test_profiles admin manage"
  ON public.curated_test_profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

GRANT SELECT ON public.curated_test_profile_biomarkers TO anon, authenticated;
GRANT ALL ON public.curated_test_profile_biomarkers TO service_role;
ALTER TABLE public.curated_test_profile_biomarkers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "curated_test_profile_biomarkers public read"
  ON public.curated_test_profile_biomarkers FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.curated_test_profiles p
    WHERE p.id = curated_test_profile_id AND p.is_published));
CREATE POLICY "curated_test_profile_biomarkers admin manage"
  ON public.curated_test_profile_biomarkers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ---------- 13. notifications -------------------------------------------
CREATE TABLE public.notification_channel_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  channel public.hi_notification_channel NOT NULL,
  event_type text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT false,
  consent_record_id uuid REFERENCES public.clinical_consent_records(id) ON DELETE SET NULL,
  destination_hint text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, channel, event_type)
);
COMMENT ON TABLE public.notification_channel_preferences IS
  'Per-person, per-channel, per-event consent. Defaults to off. destination_hint is a masked display value only — never a full phone number or address.';

CREATE TABLE public.notification_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  health_profile_id uuid REFERENCES public.health_profiles(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  channel public.hi_notification_channel NOT NULL,
  status public.hi_notification_status NOT NULL DEFAULT 'pending',
  subject text,
  suppression_reason text,
  provider_message_id text,
  dispatched_at timestamptz,
  delivered_at timestamptz,
  failed_at timestamptz,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.notification_events IS
  'Delivery audit for outbound notifications. Deliberately carries no result value, biomarker or clinical content: a notification says a result is ready, never what it says. Never forwarded to analytics or advertising.';
CREATE INDEX notification_events_user_idx ON public.notification_events (user_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE ON public.notification_channel_preferences TO authenticated;
GRANT ALL ON public.notification_channel_preferences TO service_role;
ALTER TABLE public.notification_channel_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notification_channel_preferences own all"
  ON public.notification_channel_preferences FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

GRANT SELECT ON public.notification_events TO authenticated;
GRANT ALL ON public.notification_events TO service_role;
ALTER TABLE public.notification_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notification_events own read" ON public.notification_events
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- ---------- 14. inbound adapter events / webhooks -----------------------
CREATE TABLE public.ingestion_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adapter_id uuid NOT NULL REFERENCES public.ingestion_adapters(id) ON DELETE CASCADE,
  external_event_id text,
  event_type text NOT NULL,
  signature_verified boolean NOT NULL DEFAULT false,
  processing_status text NOT NULL DEFAULT 'received',
  diagnostic_report_id uuid REFERENCES public.diagnostic_reports(id) ON DELETE SET NULL,
  error_message text,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  UNIQUE (adapter_id, external_event_id)
);
COMMENT ON TABLE public.ingestion_events IS
  'Inbound webhook/event log for every adapter. Deliberately stores no payload body: raw partner payloads may contain special-category data and belong in the source document, not an event log. signature_verified must be true before any write is derived from an event.';

GRANT ALL ON public.ingestion_events TO service_role;
ALTER TABLE public.ingestion_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ingestion_events admin read" ON public.ingestion_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ---------- 15. benchmark governance (off by default) -------------------
CREATE TABLE public.benchmark_cohort_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_key text NOT NULL UNIQUE,
  description text,
  dimensions text[] NOT NULL DEFAULT ARRAY['age_band','sex_at_birth'],
  minimum_cohort_size integer NOT NULL DEFAULT 100,
  small_cell_suppression_threshold integer NOT NULL DEFAULT 10,
  requires_explicit_consent boolean NOT NULL DEFAULT true,
  statistical_governance_signed_off boolean NOT NULL DEFAULT false,
  clinical_governance_signed_off boolean NOT NULL DEFAULT false,
  is_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT benchmark_requires_governance CHECK (
    NOT is_enabled OR (statistical_governance_signed_off
                       AND clinical_governance_signed_off
                       AND minimum_cohort_size >= 100
                       AND small_cell_suppression_threshold >= 10))
);
COMMENT ON TABLE public.benchmark_cohort_policies IS
  'Peer benchmarking is OFF by default and cannot be switched on without both governance sign-offs and safe minimum cohort sizes — enforced by a database constraint, not by application code. No identifiable or small-cell data may ever be exposed.';

GRANT SELECT ON public.benchmark_cohort_policies TO authenticated;
GRANT ALL ON public.benchmark_cohort_policies TO service_role;
ALTER TABLE public.benchmark_cohort_policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "benchmark_cohort_policies admin manage"
  ON public.benchmark_cohort_policies FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ---------- updated_at triggers -----------------------------------------
CREATE TRIGGER health_profiles_updated_at BEFORE UPDATE ON public.health_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER ingestion_adapters_updated_at BEFORE UPDATE ON public.ingestion_adapters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER organisations_updated_at BEFORE UPDATE ON public.organisations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER organisation_members_updated_at BEFORE UPDATE ON public.organisation_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER diagnostic_reports_updated_at BEFORE UPDATE ON public.diagnostic_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER reference_range_contexts_updated_at BEFORE UPDATE ON public.reference_range_contexts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER curated_test_profiles_updated_at BEFORE UPDATE ON public.curated_test_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER notification_channel_preferences_updated_at BEFORE UPDATE ON public.notification_channel_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER benchmark_cohort_policies_updated_at BEFORE UPDATE ON public.benchmark_cohort_policies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- Bulk loader so an official release file can be ingested in one call rather
-- than hand-written INSERTs. Admin or service role only.

CREATE OR REPLACE FUNCTION public.import_terminology_codes(
  p_system  text,          -- 'loinc' or 'snomed'
  p_payload jsonb,         -- array of objects, see notes below
  p_source  text DEFAULT NULL,
  p_release text DEFAULT NULL
)
RETURNS TABLE(inserted integer, linked integer, unlinked integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_inserted integer := 0;
  v_linked   integer := 0;
BEGIN
  IF p_system NOT IN ('loinc','snomed') THEN
    RAISE EXCEPTION 'p_system must be loinc or snomed';
  END IF;

  IF p_system = 'loinc' THEN
    -- expects: [{"loinc_code":"","long_name":"","short_name":"","component":"",
    --            "common_units":["mmol/L"],"biomarker_name":"Ferritin"}, ...]
    WITH src AS (
      SELECT e ->> 'loinc_code'  AS loinc_code,
             e ->> 'long_name'   AS long_name,
             e ->> 'short_name'  AS short_name,
             e ->> 'component'   AS component,
             CASE WHEN e ? 'common_units'
                  THEN ARRAY(SELECT jsonb_array_elements_text(e -> 'common_units')) END AS common_units,
             lower(trim(e ->> 'biomarker_name')) AS biomarker_name
      FROM jsonb_array_elements(p_payload) e
    ),
    ins AS (
      INSERT INTO public.clinical_loinc_mappings (
        loinc_code, long_name, short_name, component, common_units,
        biomarker_id, biomarker_code, is_active, is_primary,
        verification_status, code_source, release_version
      )
      SELECT s.loinc_code, COALESCE(s.long_name, s.loinc_code), s.short_name,
             s.component, s.common_units, h.id, h.biomarker_code, true, false,
             'unverified', p_source, p_release
      FROM src s
      LEFT JOIN public.biomarker_hub h
        ON lower(trim(h.name)) = s.biomarker_name AND h.status <> 'duplicate'
      ON CONFLICT (loinc_code) DO UPDATE
        SET long_name       = EXCLUDED.long_name,
            short_name      = COALESCE(EXCLUDED.short_name, clinical_loinc_mappings.short_name),
            component       = COALESCE(EXCLUDED.component, clinical_loinc_mappings.component),
            common_units    = COALESCE(EXCLUDED.common_units, clinical_loinc_mappings.common_units),
            biomarker_id    = COALESCE(EXCLUDED.biomarker_id, clinical_loinc_mappings.biomarker_id),
            release_version = COALESCE(EXCLUDED.release_version, clinical_loinc_mappings.release_version),
            updated_at      = now()
      RETURNING biomarker_id
    )
    SELECT count(*), count(biomarker_id) INTO v_inserted, v_linked FROM ins;
  ELSE
    -- expects: [{"snomed_concept_id":"","preferred_term":"","biomarker_name":"Ferritin"}, ...]
    WITH src AS (
      SELECT e ->> 'snomed_concept_id' AS concept_id,
             e ->> 'preferred_term'    AS preferred_term,
             lower(trim(e ->> 'biomarker_name')) AS biomarker_name
      FROM jsonb_array_elements(p_payload) e
    ),
    ins AS (
      INSERT INTO public.clinical_snomed_mappings (
        snomed_concept_id, preferred_term, biomarker_id, biomarker_code,
        biomarker_name, category, is_active, is_primary,
        verification_status, code_source, release_version
      )
      SELECT s.concept_id, COALESCE(s.preferred_term, s.concept_id), h.id,
             h.biomarker_code, h.name, h.category_clinical, true, false,
             'unverified', p_source, p_release
      FROM src s
      LEFT JOIN public.biomarker_hub h
        ON lower(trim(h.name)) = s.biomarker_name AND h.status <> 'duplicate'
      ON CONFLICT (snomed_concept_id) DO UPDATE
        SET preferred_term  = EXCLUDED.preferred_term,
            biomarker_id    = COALESCE(EXCLUDED.biomarker_id, clinical_snomed_mappings.biomarker_id),
            release_version = COALESCE(EXCLUDED.release_version, clinical_snomed_mappings.release_version),
            updated_at      = now()
      RETURNING biomarker_id
    )
    SELECT count(*), count(biomarker_id) INTO v_inserted, v_linked FROM ins;
  END IF;

  RETURN QUERY SELECT v_inserted, v_linked, v_inserted - v_linked;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.import_terminology_codes(text, jsonb, text, text) FROM PUBLIC, anon, authenticated;

COMMENT ON FUNCTION public.import_terminology_codes IS
  'Bulk-loads LOINC or SNOMED codes from a JSON array and links each to biomarker_hub by name. Everything lands as unverified and non-primary by design.';

-- what still needs a human eye
CREATE OR REPLACE VIEW public.terminology_verification_queue
WITH (security_invoker = on) AS
SELECT 'loinc' AS code_system, m.id, m.loinc_code AS code, m.long_name AS term,
       h.name AS biomarker_name, h.category_clinical, m.verification_status,
       m.code_source, m.release_version, m.updated_at
FROM public.clinical_loinc_mappings m
LEFT JOIN public.biomarker_hub h ON h.id = m.biomarker_id
WHERE m.verification_status = 'unverified'
UNION ALL
SELECT 'snomed', m.id, m.snomed_concept_id, m.preferred_term,
       h.name, h.category_clinical, m.verification_status,
       m.code_source, m.release_version, m.updated_at
FROM public.clinical_snomed_mappings m
LEFT JOIN public.biomarker_hub h ON h.id = m.biomarker_id
WHERE m.verification_status = 'unverified';

COMMENT ON VIEW public.terminology_verification_queue IS
  'Every terminology code awaiting sign-off. A code cannot be marked primary, and so cannot reach a FHIR export, until it leaves this queue.';

-- coverage, so the gap is visible rather than assumed
CREATE OR REPLACE VIEW public.biomarker_terminology_coverage
WITH (security_invoker = on) AS
SELECT
  h.id, h.name, h.category_clinical, h.category_consumer,
  (l.id IS NOT NULL)                        AS has_loinc_candidate,
  (l.verification_status = 'verified')      AS loinc_verified,
  (s.id IS NOT NULL)                        AS has_snomed_candidate,
  (s.verification_status = 'verified')      AS snomed_verified
FROM public.biomarker_hub h
LEFT JOIN LATERAL (
  SELECT id, verification_status FROM public.clinical_loinc_mappings
  WHERE biomarker_id = h.id ORDER BY is_primary DESC, updated_at DESC LIMIT 1
) l ON true
LEFT JOIN LATERAL (
  SELECT id, verification_status FROM public.clinical_snomed_mappings
  WHERE biomarker_id = h.id ORDER BY is_primary DESC, updated_at DESC LIMIT 1
) s ON true
WHERE h.status <> 'duplicate';

GRANT SELECT ON public.terminology_verification_queue, public.biomarker_terminology_coverage TO authenticated;
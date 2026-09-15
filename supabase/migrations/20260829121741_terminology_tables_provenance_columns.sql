-- Make the terminology tables fit to be used in anger. Codes in a clinical
-- mapping table are only safe if you can tell, per row, where the code came
-- from and whether anyone has checked it against the official release.

ALTER TABLE public.clinical_loinc_mappings
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS code_source         text,
  ADD COLUMN IF NOT EXISTS release_version     text,
  ADD COLUMN IF NOT EXISTS verified_at         timestamptz,
  ADD COLUMN IF NOT EXISTS verified_by         text,
  ADD COLUMN IF NOT EXISTS notes               text,
  ADD COLUMN IF NOT EXISTS updated_at          timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.clinical_snomed_mappings
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS code_source         text,
  ADD COLUMN IF NOT EXISTS release_version     text,
  ADD COLUMN IF NOT EXISTS verified_at         timestamptz,
  ADD COLUMN IF NOT EXISTS verified_by         text,
  ADD COLUMN IF NOT EXISTS notes               text,
  ADD COLUMN IF NOT EXISTS updated_at          timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.clinical_loinc_mappings
  DROP CONSTRAINT IF EXISTS clinical_loinc_verification_status_check,
  ADD CONSTRAINT clinical_loinc_verification_status_check
  CHECK (verification_status IN ('unverified','verified','rejected','superseded'));

ALTER TABLE public.clinical_snomed_mappings
  DROP CONSTRAINT IF EXISTS clinical_snomed_verification_status_check,
  ADD CONSTRAINT clinical_snomed_verification_status_check
  CHECK (verification_status IN ('unverified','verified','rejected','superseded'));

-- a code may only be marked primary once a human has verified it
CREATE OR REPLACE FUNCTION public.guard_primary_terminology_code()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.is_primary AND NEW.verification_status <> 'verified' THEN
    RAISE EXCEPTION 'A terminology code must be verified before it can be marked primary (%).',
      COALESCE(NEW.verification_status, 'null');
  END IF;
  RETURN NEW;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.guard_primary_terminology_code() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_guard_loinc_primary ON public.clinical_loinc_mappings;
CREATE TRIGGER trg_guard_loinc_primary
  BEFORE INSERT OR UPDATE ON public.clinical_loinc_mappings
  FOR EACH ROW EXECUTE FUNCTION public.guard_primary_terminology_code();

DROP TRIGGER IF EXISTS trg_guard_snomed_primary ON public.clinical_snomed_mappings;
CREATE TRIGGER trg_guard_snomed_primary
  BEFORE INSERT OR UPDATE ON public.clinical_snomed_mappings
  FOR EACH ROW EXECUTE FUNCTION public.guard_primary_terminology_code();

COMMENT ON COLUMN public.clinical_loinc_mappings.verification_status IS
  'unverified until checked against the official LOINC release. Only a verified code can be marked primary, which is what the FHIR export and the hub denormalised code will use.';
COMMENT ON COLUMN public.clinical_snomed_mappings.verification_status IS
  'unverified until checked against the NHS TRUD SNOMED CT UK Edition release. Only a verified code can be marked primary.';
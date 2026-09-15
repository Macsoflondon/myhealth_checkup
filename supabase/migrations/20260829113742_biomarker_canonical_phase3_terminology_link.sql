-- Phase 3. LOINC and SNOMED stay as separate reference tables, which is the
-- correct normalised design. What changes is that they now point at the
-- canonical biomarker row by id, instead of at a biomarker_code that only
-- existed in biomarkers_library. Both tables are empty, so there is nothing
-- to migrate. Their existing biomarker_code columns are left in place.

ALTER TABLE public.clinical_loinc_mappings
  ADD COLUMN IF NOT EXISTS biomarker_id uuid REFERENCES public.biomarker_hub(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_primary boolean NOT NULL DEFAULT false;

ALTER TABLE public.clinical_snomed_mappings
  ADD COLUMN IF NOT EXISTS biomarker_id uuid REFERENCES public.biomarker_hub(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_primary boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_loinc_biomarker_id  ON public.clinical_loinc_mappings (biomarker_id);
CREATE INDEX IF NOT EXISTS idx_snomed_biomarker_id ON public.clinical_snomed_mappings (biomarker_id);

-- one primary code per biomarker per code system
CREATE UNIQUE INDEX IF NOT EXISTS clinical_loinc_primary_per_biomarker
  ON public.clinical_loinc_mappings (biomarker_id) WHERE is_primary;
CREATE UNIQUE INDEX IF NOT EXISTS clinical_snomed_primary_per_biomarker
  ON public.clinical_snomed_mappings (biomarker_id) WHERE is_primary;

COMMENT ON COLUMN public.clinical_loinc_mappings.biomarker_id IS
  'Canonical link to biomarker_hub. Replaces the biomarker_code text join, which only resolved against biomarkers_library.';
COMMENT ON COLUMN public.clinical_snomed_mappings.biomarker_id IS
  'Canonical link to biomarker_hub. Replaces the biomarker_code text join, which only resolved against biomarkers_library.';

-- keep biomarker_hub.loinc_code / snomed_code in step with the primary
-- mapping rows, so the denormalised codes on the hub cannot drift
CREATE OR REPLACE FUNCTION public.sync_primary_terminology_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.biomarker_id IS NOT NULL AND NEW.is_primary THEN
    IF TG_TABLE_NAME = 'clinical_loinc_mappings' THEN
      UPDATE public.biomarker_hub
         SET loinc_code = NEW.loinc_code, last_updated = now()
       WHERE id = NEW.biomarker_id;
    ELSE
      UPDATE public.biomarker_hub
         SET snomed_code = NEW.snomed_concept_id, last_updated = now()
       WHERE id = NEW.biomarker_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_sync_loinc_primary ON public.clinical_loinc_mappings;
CREATE TRIGGER trg_sync_loinc_primary
  AFTER INSERT OR UPDATE ON public.clinical_loinc_mappings
  FOR EACH ROW EXECUTE FUNCTION public.sync_primary_terminology_code();

DROP TRIGGER IF EXISTS trg_sync_snomed_primary ON public.clinical_snomed_mappings;
CREATE TRIGGER trg_sync_snomed_primary
  AFTER INSERT OR UPDATE ON public.clinical_snomed_mappings
  FOR EACH ROW EXECUTE FUNCTION public.sync_primary_terminology_code();
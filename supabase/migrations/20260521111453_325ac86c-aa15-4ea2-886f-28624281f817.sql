
ALTER TABLE public.biomarkers_library
  ADD COLUMN IF NOT EXISTS synonyms text[],
  ADD COLUMN IF NOT EXISTS biomaterial text,
  ADD COLUMN IF NOT EXISTS body_system text,
  ADD COLUMN IF NOT EXISTS reference_ranges jsonb,
  ADD COLUMN IF NOT EXISTS alternate_units jsonb,
  ADD COLUMN IF NOT EXISTS what_it_measures text,
  ADD COLUMN IF NOT EXISTS why_it_matters text,
  ADD COLUMN IF NOT EXISTS what_affects_it text,
  ADD COLUMN IF NOT EXISTS when_to_retest text,
  ADD COLUMN IF NOT EXISTS related_articles jsonb,
  ADD COLUMN IF NOT EXISTS last_reviewed_at date,
  ADD COLUMN IF NOT EXISTS reviewed_by text;

CREATE INDEX IF NOT EXISTS idx_biomarkers_library_body_system ON public.biomarkers_library (body_system);
CREATE INDEX IF NOT EXISTS idx_biomarkers_library_biomaterial ON public.biomarkers_library (biomaterial);
CREATE INDEX IF NOT EXISTS idx_biomarkers_library_synonyms ON public.biomarkers_library USING GIN (synonyms);

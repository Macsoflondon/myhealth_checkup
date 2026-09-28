-- Restored verbatim from supabase_migrations.schema_migrations (version 20260521111451).
-- md5 of the recorded statements: 12009430bd0c8f4c13ec2650221202bb
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


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

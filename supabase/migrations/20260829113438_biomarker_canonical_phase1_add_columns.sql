-- Restored from supabase_migrations.schema_migrations (version 20260829113438, name biomarker_canonical_phase1_add_columns).
-- md5 of the recorded statements: 77ebed7d2c78c186b865dcfa4fdd6e9b
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.
--
-- Replay adaptation: biomarker_hub was created directly in production, outside the
-- migration system, before this migration ran. No applied migration creates it,
-- so a fresh database failed here. The CREATE TABLE block below reproduces the
-- table exactly as it stood before this migration: production's current
-- definition minus every column, index and constraint that later migrations add
-- (columns 1 to 15 in production order, primary key, UNIQUE (name), RLS and the
-- "Public Read Access Hub" policy). IF NOT EXISTS makes it a no-op wherever the
-- table already exists.

-- Pre-existing base table (see replay adaptation note above).
CREATE TABLE IF NOT EXISTS public.biomarker_hub (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  legacy_description text,
  symptoms_linked text[],
  embedding extensions.vector(1536),
  category text,
  created_at timestamp with time zone DEFAULT now(),
  icon text,
  description_what text,
  description_why text,
  unit text,
  reference_ranges jsonb,
  clinical_tips text[],
  related_tests text[],
  abbreviation text,
  CONSTRAINT biomarker_hub_pkey PRIMARY KEY (id),
  CONSTRAINT biomarker_hub_name_key UNIQUE (name)
);
ALTER TABLE public.biomarker_hub ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'biomarker_hub' AND policyname = 'Public Read Access Hub') THEN
    CREATE POLICY "Public Read Access Hub" ON public.biomarker_hub FOR SELECT USING (true);
  END IF;
END $$;

-- Phase 1 of the biomarker consolidation.
-- biomarker_hub becomes the canonical biomarker entity. Every column added
-- here is additive: no existing column is altered, renamed or dropped, and
-- biomarkers_library / biomarker_knowledge_hub remain untouched and readable.

ALTER TABLE public.biomarker_hub
  -- canonical identity
  ADD COLUMN IF NOT EXISTS biomarker_code      text,
  ADD COLUMN IF NOT EXISTS legacy_codes        text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS source_systems      text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS status              text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS last_updated        timestamptz DEFAULT now(),

  -- terminology codes (single home; the mapping tables remain authoritative
  -- for full code metadata, these are the denormalised primary codes)
  ADD COLUMN IF NOT EXISTS loinc_code          text,
  ADD COLUMN IF NOT EXISTS snomed_code         text,

  -- clinical layer carried over from biomarker_knowledge_hub
  ADD COLUMN IF NOT EXISTS clinical_description text,
  ADD COLUMN IF NOT EXISTS legacy_embedding     extensions.vector(1536),

  -- dual taxonomy, preserving both vocabularies without touching `category`
  ADD COLUMN IF NOT EXISTS category_clinical   text,
  ADD COLUMN IF NOT EXISTS category_consumer   text,

  -- structured clinical layer carried over from biomarkers_library
  ADD COLUMN IF NOT EXISTS synonyms            text[],
  ADD COLUMN IF NOT EXISTS biomaterial         text,
  ADD COLUMN IF NOT EXISTS body_system         text,
  ADD COLUMN IF NOT EXISTS clinical_significance text,
  ADD COLUMN IF NOT EXISTS interpretation_guide  jsonb,
  ADD COLUMN IF NOT EXISTS normal_range_male   text,
  ADD COLUMN IF NOT EXISTS normal_range_female text,
  ADD COLUMN IF NOT EXISTS alternate_units     jsonb,
  ADD COLUMN IF NOT EXISTS related_conditions  text[],
  ADD COLUMN IF NOT EXISTS lifestyle_factors   text[],

  -- editorial layer carried over from biomarkers_library
  ADD COLUMN IF NOT EXISTS what_it_measures    text,
  ADD COLUMN IF NOT EXISTS why_it_matters      text,
  ADD COLUMN IF NOT EXISTS what_affects_it     text,
  ADD COLUMN IF NOT EXISTS when_to_retest      text,
  ADD COLUMN IF NOT EXISTS related_articles    jsonb,
  ADD COLUMN IF NOT EXISTS last_reviewed_at    date,
  ADD COLUMN IF NOT EXISTS reviewed_by         text;

COMMENT ON TABLE public.biomarker_hub IS
  'Canonical biomarker entity. Consolidates biomarker_knowledge_hub (clinical/RAG layer) and biomarkers_library (structured + editorial layer). legacy_description and clinical_description are both retained: nothing is overwritten.';

COMMENT ON COLUMN public.biomarker_hub.biomarker_code IS
  'Stable human-readable key, sourced from biomarkers_library. Superseded codes are kept in legacy_codes.';
COMMENT ON COLUMN public.biomarker_hub.legacy_embedding IS
  'Embedding as held in biomarker_knowledge_hub where it differed from the hub embedding. Retained so no vector is lost.';
COMMENT ON COLUMN public.biomarker_hub.category_clinical IS
  'Clinical taxonomy (snake_case, e.g. endocrinology). Populated from biomarker_knowledge_hub.';
COMMENT ON COLUMN public.biomarker_hub.category_consumer IS
  'Consumer-facing taxonomy (Title Case, e.g. Iron and Nutrients). The legacy `category` column is left untouched for existing front-end queries.';

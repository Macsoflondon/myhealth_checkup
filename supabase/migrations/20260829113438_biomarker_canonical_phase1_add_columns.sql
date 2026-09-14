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
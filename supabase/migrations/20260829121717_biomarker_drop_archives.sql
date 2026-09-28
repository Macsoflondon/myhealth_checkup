-- Restored verbatim from supabase_migrations.schema_migrations (version 20260829121717, name biomarker_drop_archives).
-- md5 of the recorded statements: c4826008a874badfb91b5fe51823149c
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- Archives dropped at Nathanial's instruction, after field-level verification
-- confirmed every value they held is present either on the canonical row or
-- in biomarker_hub.variant_content. The compatibility views biomarkers_library
-- and biomarker_knowledge_hub are unaffected: they read biomarker_hub, not
-- these tables.

DROP TABLE IF EXISTS public.biomarkers_library_archive;
DROP TABLE IF EXISTS public.biomarker_knowledge_hub_archive;

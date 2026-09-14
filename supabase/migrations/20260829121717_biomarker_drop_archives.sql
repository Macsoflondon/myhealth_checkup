-- Archives dropped at Nathanial's instruction, after field-level verification
-- confirmed every value they held is present either on the canonical row or
-- in biomarker_hub.variant_content. The compatibility views biomarkers_library
-- and biomarker_knowledge_hub are unaffected: they read biomarker_hub, not
-- these tables.

DROP TABLE IF EXISTS public.biomarkers_library_archive;
DROP TABLE IF EXISTS public.biomarker_knowledge_hub_archive;
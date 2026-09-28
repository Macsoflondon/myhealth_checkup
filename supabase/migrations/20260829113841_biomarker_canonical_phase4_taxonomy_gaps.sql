-- Restored verbatim from supabase_migrations.schema_migrations (version 20260829113841, name biomarker_canonical_phase4_taxonomy_gaps).
-- md5 of the recorded statements: dacf99214084c3fc0f65f144f56534fe
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- Close the remaining taxonomy gaps. Two clinical groups are added because
-- the consumer side had biomarkers with no clinical equivalent at all.

INSERT INTO public.biomarker_category_map (clinical_category, consumer_category) VALUES
  ('immunology', 'Immunology'),
  ('neurology',  'Neurology & Mental Health'),
  ('respiratory','Pulmonary & Respiratory'),
  ('other',      'Other'),
  ('other',      'Specialist')
ON CONFLICT DO NOTHING;

UPDATE public.biomarker_hub h
SET category_clinical = m.clinical_category
FROM public.biomarker_category_map m
WHERE h.category_clinical IS NULL
  AND h.category_consumer = m.consumer_category;

UPDATE public.biomarker_hub h
SET category_consumer = 'Other'
WHERE h.category_consumer IS NULL
  AND h.category_clinical = 'other';

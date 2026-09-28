-- Restored verbatim from supabase_migrations.schema_migrations (version 20260829113703, name biomarker_canonical_phase1_flag_duplicates_and_key).
-- md5 of the recorded statements: 3047b7cf218a9b132c121ea5a4e5617f
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- 2. flag the superseded rows and point them at their canonical row
WITH ranked AS (
  SELECT id, lower(trim(name)) AS n,
         row_number() OVER (
           PARTITION BY lower(trim(name))
           ORDER BY (description_what IS NOT NULL) DESC,
                    (unit IS NOT NULL) DESC,
                    created_at DESC
         ) AS rn
  FROM public.biomarker_hub
  WHERE lower(trim(name)) IN (
    SELECT lower(trim(name)) FROM public.biomarker_hub GROUP BY 1 HAVING count(*) > 1
  )
),
keeper AS (SELECT id, n FROM ranked WHERE rn = 1)
UPDATE public.biomarker_hub h
SET status = 'duplicate',
    canonical_id = k.id,
    last_updated = now()
FROM ranked r
JOIN keeper k ON k.n = r.n
WHERE h.id = r.id AND r.rn > 1;

-- 3. the canonical key can now be enforced across live rows only
CREATE UNIQUE INDEX IF NOT EXISTS biomarker_hub_biomarker_code_key
  ON public.biomarker_hub (biomarker_code)
  WHERE biomarker_code IS NOT NULL AND status <> 'duplicate';

CREATE UNIQUE INDEX IF NOT EXISTS biomarker_hub_name_ci_key
  ON public.biomarker_hub (lower(trim(name)))
  WHERE status <> 'duplicate';

CREATE INDEX IF NOT EXISTS idx_biomarker_hub_status ON public.biomarker_hub (status);
CREATE INDEX IF NOT EXISTS idx_biomarker_hub_category_clinical ON public.biomarker_hub (category_clinical);
CREATE INDEX IF NOT EXISTS idx_biomarker_hub_category_consumer ON public.biomarker_hub (category_consumer);
CREATE INDEX IF NOT EXISTS idx_biomarker_hub_canonical_id ON public.biomarker_hub (canonical_id);

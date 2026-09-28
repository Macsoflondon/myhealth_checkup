-- Restored verbatim from supabase_migrations.schema_migrations (version 20260730222437, name add_clean_wellness_subcategories).
-- md5 of the recorded statements: 93a4e7e81a467deb54dc533c885d2bb7
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

INSERT INTO categories (slug, name, level, sort_order, color, is_active, description)
VALUES
  ('longevity', 'Longevity Tests', 0, 160, '#22c0d4', true, 'Comprehensive health markers for longevity and preventive care'),
  ('energy-fatigue', 'Energy & Fatigue Tests', 0, 170, '#22c0d4', true, 'Fatigue, tiredness and energy level testing'),
  ('gp-monitoring', 'GP Monitoring Tests', 0, 180, '#22c0d4', true, 'Routine health checks and general practitioner monitoring'),
  ('antibody', 'Antibody Tests', 0, 190, '#22c0d4', true, 'Antibody screening and detection'),
  ('infection', 'Infection Tests', 0, 200, '#22c0d4', true, 'Infectious disease screening and pathogen detection'),
  ('immunity', 'Immunity Tests', 0, 210, '#22c0d4', true, 'Immune system function and defence assessment'),
  ('autoimmunity', 'Autoimmunity Tests', 0, 220, '#22c0d4', true, 'Autoimmune condition screening and monitoring')
ON CONFLICT (slug) DO NOTHING;

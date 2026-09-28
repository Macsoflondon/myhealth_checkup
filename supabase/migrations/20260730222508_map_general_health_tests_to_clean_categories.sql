-- Restored verbatim from supabase_migrations.schema_migrations (version 20260730222508, name map_general_health_tests_to_clean_categories).
-- md5 of the recorded statements: 95f677e432b0dc5f4d301247d48ce0e4
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

WITH base AS (
  SELECT id AS provider_test_id,
    coalesce(test_name,'') || ' ' || coalesce(description,'') || ' ' || coalesce(biomarkers_list::text,'') AS haystack
  FROM provider_tests
  WHERE is_active = true AND canonical_category = 'general-health'
),
matches AS (
  SELECT provider_test_id, 'longevity' AS slug FROM base WHERE haystack ~* 'longevity|advanced well|full body|complete|ultimate'
  UNION ALL
  SELECT provider_test_id, 'energy-fatigue' FROM base WHERE haystack ~* 'energy|fatigue|tired|\yb12\y|ferritin'
  UNION ALL
  SELECT provider_test_id, 'gp-monitoring' FROM base WHERE haystack ~* 'monitor|check|profile|routine|\ygp\y'
  UNION ALL
  SELECT provider_test_id, 'antibody' FROM base WHERE haystack ~* 'antibod'
  UNION ALL
  SELECT provider_test_id, 'infection' FROM base WHERE haystack ~* 'infection|hepatitis|\yhiv\y|syphilis|virus'
  UNION ALL
  SELECT provider_test_id, 'immunity' FROM base WHERE haystack ~* 'immun'
  UNION ALL
  SELECT provider_test_id, 'autoimmunity' FROM base WHERE haystack ~* 'autoimmun|coeliac|celiac|rheumatoid|\yana\y'
)
INSERT INTO category_test_mapping (category_id, provider_test_id, source, confidence)
SELECT c.id, m.provider_test_id, 'backfill', 0.8
FROM matches m
JOIN categories c ON c.slug = m.slug
ON CONFLICT DO NOTHING;

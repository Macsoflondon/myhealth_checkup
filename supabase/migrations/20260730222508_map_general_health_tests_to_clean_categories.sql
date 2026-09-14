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
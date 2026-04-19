-- Promote 4 standout Lola Health panels to the homepage "Most Popular" rail
UPDATE provider_tests
SET is_popular = true,
    popularity_rank = CASE provider_test_id
      WHEN 'peak-insights'             THEN 11   -- 70-biomarker flagship
      WHEN 'core-health'               THEN 12   -- 45-biomarker entry
      WHEN 'female-hormones-clarity'   THEN 13   -- 31-biomarker women's hormone panel
      WHEN 'cardiovascular-health'     THEN 14   -- 8-biomarker heart panel
    END,
    updated_at = now()
WHERE provider_id = 'lola-health'
  AND provider_test_id IN ('peak-insights','core-health','female-hormones-clarity','cardiovascular-health');
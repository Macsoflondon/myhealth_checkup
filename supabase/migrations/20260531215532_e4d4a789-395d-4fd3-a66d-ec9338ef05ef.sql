WITH updated_list AS (
  SELECT 
    id,
    jsonb_agg(
      CASE 
        WHEN elem = 'What is a Male Hormone and Fertility Blood Test?' THEN '"\u200b"'::jsonb
        WHEN elem = 'including Vitamin D' THEN '"\u200b"'::jsonb
        ELSE to_jsonb(elem)
      END
    ) as new_biomarkers
  FROM provider_tests, jsonb_array_elements_text(biomarkers_list) AS elem
  WHERE id = '2360757d-1e73-44d5-848b-cb9f95d3f8bf'
  GROUP BY id
)
UPDATE provider_tests
SET biomarkers_list = updated_list.new_biomarkers
FROM updated_list
WHERE provider_tests.id = updated_list.id;
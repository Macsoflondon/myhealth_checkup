-- The actual deliverable: compare a biomarker across every provider that
-- tests for it, plus the two follow-up queues this pass surfaced.

CREATE VIEW public.biomarker_provider_comparison
WITH (security_invoker = on) AS
SELECT
  h.id AS biomarker_id,
  h.name AS biomarker_name,
  h.category_consumer,
  pt.id AS provider_test_id,
  pt.provider_id,
  pt.test_name,
  pt.price,
  pt.turnaround_days_text,
  pt.sample_type,
  pt.home_kit_available,
  pt.clinic_visit_available,
  pt.url
FROM public.provider_test_biomarkers ptb
JOIN public.biomarker_hub h ON h.id = ptb.biomarker_id
JOIN public.provider_tests pt ON pt.id = ptb.provider_test_id
WHERE h.status <> 'duplicate'
  AND pt.is_active IS DISTINCT FROM false;

COMMENT ON VIEW public.biomarker_provider_comparison IS
  'The point of provider_test_biomarkers: filter by biomarker_id (or biomarker_name) to see every active test across every provider that includes it, with price and turnaround, for direct comparison.';

-- provider_tests rows whose biomarkers_list produced no real matches despite
-- claiming biomarkers exist — this is where the scrape needs redoing, not
-- where the matcher needs improving
CREATE VIEW public.provider_tests_needing_rescrape
WITH (security_invoker = on) AS
SELECT pt.id AS provider_test_id, pt.provider_id, pt.test_name, pt.biomarker_count,
       count(ptb.id) AS labels_scraped,
       count(ptb.id) FILTER (WHERE ptb.biomarker_id IS NOT NULL) AS labels_matched
FROM public.provider_tests pt
JOIN public.provider_test_biomarkers ptb ON ptb.provider_test_id = pt.id
WHERE pt.biomarker_count > 0
GROUP BY pt.id, pt.provider_id, pt.test_name, pt.biomarker_count
HAVING count(ptb.id) FILTER (WHERE ptb.biomarker_id IS NOT NULL) = 0;

COMMENT ON VIEW public.provider_tests_needing_rescrape IS
  'Tests that claim a biomarker count but resolved zero real biomarkers from biomarkers_list — the scrape captured page furniture instead of test content. 160 medichecks rows are the known case (navigation menu + clinician bios). Fix at the source and re-run the population query in this migration set, rather than patching around it here.';

-- distinct labels that are real content but did not resolve — candidates
-- for a new synonym on biomarker_hub, or a genuinely new biomarker
CREATE VIEW public.unresolved_biomarker_labels
WITH (security_invoker = on) AS
SELECT raw_label, count(*) AS times_seen,
       array_agg(DISTINCT pt.provider_id) AS seen_from_providers
FROM public.provider_test_biomarkers ptb
JOIN public.provider_tests pt ON pt.id = ptb.provider_test_id
WHERE ptb.match_method = 'unmatched'
  AND NOT (pt.provider_id = 'medichecks' AND pt.biomarkers_list @> '["Most popular tests"]'::jsonb)
GROUP BY raw_label
ORDER BY count(*) DESC;

COMMENT ON VIEW public.unresolved_biomarker_labels IS
  'Real (non-contaminated) biomarker labels that did not match biomarker_hub — mostly grouped labels ("Ferritin, Vitamins and Thyroid Hormones"), panel-size descriptors ("20 Individual Allergens"), or genuine synonyms not yet on biomarker_hub.synonyms. Editorial queue, not a bug list.';

GRANT SELECT ON public.biomarker_provider_comparison,
                public.provider_tests_needing_rescrape,
                public.unresolved_biomarker_labels
  TO anon, authenticated;
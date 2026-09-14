-- Round 2. The v1 stoplist only removed the mega-nav block; a second,
-- separate junk category — prep instructions, lifestyle/risk-factor bullet
-- points, and "results in N working days" strings — was still present on
-- some rows (confirmed on medichecks "Testosterone Blood Test", which had
-- zero real biomarker names, only 16 of these). Adding the exact strings,
-- copied byte-for-byte from the live data this time to avoid the
-- apostrophe/HTML-entity mismatches the first pass had, plus one narrow
-- regex for the "results in N working days" family so future day-count
-- variants are covered without enumerating each one.

INSERT INTO public.known_scrape_junk_labels (label, reason) VALUES
  ('An unhealthy BMI','medichecks.com risk-factor bullet list'),
  ('Avoid fatty foods for eight hours before your test, you do not need to fast.','medichecks.com prep instructions'),
  ('Avoid heavy exercise for 48 hours beforehand.','medichecks.com prep instructions'),
  ('Avoid nipple stimulation, as this can increase prolactin levels.','medichecks.com prep instructions'),
  (E'Bespoke doctor\u2019s report','medichecks.com marketing copy'),
  ('Cancer treatment','medichecks.com risk-factor bullet list'),
  ('Eating a healthy, nutritious diet','medichecks.com risk-factor bullet list'),
  ('Getting a good night&rsquo;s sleep','medichecks.com risk-factor bullet list (HTML-entity variant)'),
  ('High-stress levels','medichecks.com risk-factor bullet list'),
  ('If you take omega-3 supplements, wait until after your test to take them.','medichecks.com prep instructions'),
  ('Injury or damage to the testes','medichecks.com risk-factor bullet list'),
  ('Limiting your alcohol intake','medichecks.com risk-factor bullet list'),
  ('Losing weight if you&rsquo;re overweight','medichecks.com risk-factor bullet list (HTML-entity variant)'),
  ('Managing stress','medichecks.com risk-factor bullet list'),
  ('Poor sleep quality','medichecks.com risk-factor bullet list'),
  ('Quitting smoking if you smoke','medichecks.com risk-factor bullet list'),
  ('Stay well hydrated before your test.','medichecks.com prep instructions'),
  ('Steroid abuse','medichecks.com risk-factor bullet list'),
  ('Take this test when any symptoms of short-term illness have settled.','medichecks.com prep instructions'),
  ('Take your sample at least 24 hours after any vitamin or mineral supplements.','medichecks.com prep instructions'),
  ('Take your sample between 6am and 10am.','medichecks.com prep instructions'),
  ('Taking regular exercise','medichecks.com risk-factor bullet list'),
  ('Track testosterone over time','medichecks.com risk-factor bullet list'),
  ('Type 2 diabetes','medichecks.com risk-factor bullet list')
ON CONFLICT (label) DO NOTHING;

CREATE OR REPLACE FUNCTION public.strip_biomarker_junk()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  v_clean jsonb;
BEGIN
  IF NEW.biomarkers_list IS NULL OR jsonb_typeof(NEW.biomarkers_list) <> 'array' THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb)
    INTO v_clean
  FROM jsonb_array_elements(NEW.biomarkers_list) elem
  WHERE NOT EXISTS (
    SELECT 1 FROM public.known_scrape_junk_labels j
    WHERE j.label = trim(both '"' from elem::text)
  )
  AND trim(both '"' from elem::text) !~ '^#{1,6}\s'
  AND trim(both '"' from elem::text) NOT ILIKE '%is blocked%'
  AND trim(both '"' from elem::text) !~ '^Dr [A-Z][a-z]+ [A-Z][a-z]+ .*(Clinician|Director)$'
  -- "Results in 4 working days (estimated)" / "Results estimated in 8 working days" etc
  AND trim(both '"' from elem::text) !~* '^Results (in|estimated in) \d+ working days';

  IF v_clean IS DISTINCT FROM NEW.biomarkers_list THEN
    NEW.biomarkers_list := v_clean;
    NEW.biomarker_count := jsonb_array_length(v_clean);
  END IF;

  RETURN NEW;
END;
$function$;

-- re-apply to every row again now that the stoplist and pattern are complete
UPDATE public.provider_tests
SET biomarkers_list = biomarkers_list
WHERE provider_id = 'medichecks' AND biomarkers_list IS NOT NULL;
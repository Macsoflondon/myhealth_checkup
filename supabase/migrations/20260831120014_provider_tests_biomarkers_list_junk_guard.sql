-- Permanent guard against scraped navigation/marketing text landing in
-- biomarkers_list, regardless of which scraper writes it. This does not
-- depend on fixing any one scraper — it protects the column itself.
--
-- Root cause found: mhc-medichecks-sync (the function actually on cron)
-- never writes biomarkers_list at all, so it cannot be reintroducing this.
-- The contamination is a frozen leftover from an older, now-unscheduled
-- DOM scraper (medichecks-scraper / medichecks-firecrawl) that fell back to
-- harvesting page-wide nav links when a product's biomarker table selector
-- matched nothing (confirmed on medichecks "clinic-visit*" location pages,
-- which have an empty #detailsBiomarkers block). Since that scraper is not
-- on the current schedule it cannot recontaminate today's data, but if it
-- or anything like it ever runs again, this trigger stops the junk at the
-- column regardless of source.

CREATE TABLE public.known_scrape_junk_labels (
  label       text PRIMARY KEY,
  reason      text NOT NULL,
  added_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.known_scrape_junk_labels ENABLE ROW LEVEL SECURITY;
CREATE POLICY known_scrape_junk_labels_public_read ON public.known_scrape_junk_labels FOR SELECT USING (true);

COMMENT ON TABLE public.known_scrape_junk_labels IS
  'Exact strings that are site navigation/marketing chrome, not biomarker names, confirmed by manual inspection of scraped HTML. Enforced by trg_strip_biomarker_junk on provider_tests. Add to this table, never to a scraper-specific stoplist, so the protection applies no matter which scraper writes the row.';

INSERT INTO public.known_scrape_junk_labels (label, reason) VALUES
  ('Most popular tests','medichecks.com mega-nav'), ('At-home tests','medichecks.com mega-nav'),
  ('My results','medichecks.com mega-nav'), ('Home','medichecks.com mega-nav'),
  ('View all tests','medichecks.com mega-nav'), ('Sports Performance','medichecks.com mega-nav category'),
  ('Thyroid','medichecks.com mega-nav category'), ('Women''s Health Checks','medichecks.com mega-nav category'),
  ('Female Hormone Tests','medichecks.com mega-nav category'), ('Female Fertility Tests','medichecks.com mega-nav category'),
  ('Men''s Health Checks','medichecks.com mega-nav category'), ('Male Hormone Tests','medichecks.com mega-nav category'),
  ('Male Fertility Tests','medichecks.com mega-nav category'), ('Testosterone Tests','medichecks.com mega-nav category'),
  ('Longevity Tests','medichecks.com mega-nav category'), ('Heart Health Tests','medichecks.com mega-nav category'),
  ('Iron Tests','medichecks.com mega-nav category'), ('Energy Tests','medichecks.com mega-nav category'),
  ('Nutrition Tests','medichecks.com mega-nav category'), ('Allergy Tests','medichecks.com mega-nav category'),
  ('Sexual Health Tests','medichecks.com mega-nav category'), ('GP Monitoring Tests','medichecks.com mega-nav category'),
  ('Antibody Tests','medichecks.com mega-nav category'), ('Infection Tests','medichecks.com mega-nav category'),
  ('Immunity Tests','medichecks.com mega-nav category'), ('Autoimmunity Tests','medichecks.com mega-nav category'),
  ('Advanced Thyroid Function Blood Test','medichecks.com mega-nav featured product'),
  ('Thyroid Function Blood Test','medichecks.com mega-nav featured product'),
  ('Thyroid Function with Antibodies Test','medichecks.com mega-nav featured product'),
  ('Ultimate Performance Blood Test','medichecks.com mega-nav featured product'),
  ('Sports Hormone Blood Test','medichecks.com mega-nav featured product'),
  ('Advanced Sports Hormone Blood Test','medichecks.com mega-nav featured product'),
  ('Dr Natasha Fernando Medical Director','medichecks.com sitewide clinician footer'),
  ('Dr Asia Ahmed Digital Clinician','medichecks.com sitewide clinician footer'),
  ('Dr Susanna Hayter Digital Clinician','medichecks.com sitewide clinician footer'),
  ('Dr Tina Ghela Digital Clinician Lead','medichecks.com sitewide clinician footer'),
  ('Convenient testing options','medichecks.com marketing copy'),
  ('Bespoke doctor''s report','medichecks.com marketing copy'),
  ('Expert support','medichecks.com marketing copy'),
  ('Tailored recommendations','medichecks.com marketing copy'),
  ('Accredited lab testing','medichecks.com marketing copy'),
  ('Actionable next steps','medichecks.com marketing copy'),
  ('Choosing a selection results in a full page refresh.','Shopify variant-selector accessibility string')
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
  -- also reject the pattern class, not just the exact strings on file today
  AND trim(both '"' from elem::text) !~ '^#{1,6}\s'          -- markdown headings
  AND trim(both '"' from elem::text) NOT ILIKE '%is blocked%' -- scrape error pages
  AND trim(both '"' from elem::text) !~ '^Dr [A-Z][a-z]+ [A-Z][a-z]+ .*(Clinician|Director)$'; -- clinician bios

  IF v_clean IS DISTINCT FROM NEW.biomarkers_list THEN
    NEW.biomarkers_list := v_clean;
    NEW.biomarker_count := jsonb_array_length(v_clean);
  END IF;

  RETURN NEW;
END;
$function$;

COMMENT ON FUNCTION public.strip_biomarker_junk IS
  'Strips known scrape-junk labels (site nav, clinician bios, marketing copy, markdown headings, error pages) out of provider_tests.biomarkers_list before every write. Recalculates biomarker_count to match. Source-agnostic: protects the column no matter which scraper or manual update writes to it.';

DROP TRIGGER IF EXISTS trg_strip_biomarker_junk ON public.provider_tests;
CREATE TRIGGER trg_strip_biomarker_junk
  BEFORE INSERT OR UPDATE OF biomarkers_list ON public.provider_tests
  FOR EACH ROW EXECUTE FUNCTION public.strip_biomarker_junk();
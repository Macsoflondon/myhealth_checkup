-- Links each provider_tests row to the canonical biomarkers it actually
-- contains, via biomarker_hub. This is what makes biomarker-by-biomarker
-- comparison across providers possible. provider_tests.biomarkers_list is
-- left completely untouched — this is a new table built alongside it, not
-- a replacement.

CREATE TABLE public.provider_test_biomarkers (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_test_id uuid NOT NULL REFERENCES public.provider_tests(id) ON DELETE CASCADE,
  biomarker_id     uuid REFERENCES public.biomarker_hub(id) ON DELETE SET NULL,
  raw_label        text NOT NULL,
  match_method     text NOT NULL CHECK (match_method IN (
                     'exact_name','exact_synonym','exact_abbreviation',
                     'markdown_stripped','parenthetical_content','pre_parenthetical',
                     'unmatched'
                   )),
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider_test_id, raw_label)
);

COMMENT ON TABLE public.provider_test_biomarkers IS
  'One row per biomarker label found in provider_tests.biomarkers_list, resolved against biomarker_hub where possible. biomarker_id is null for labels that could not be matched (scrape contamination, grouped labels, panel-size descriptors) — raw_label is always kept so nothing scraped is lost. Enables biomarker-level comparison across providers.';
COMMENT ON COLUMN public.provider_test_biomarkers.match_method IS
  'How raw_label was resolved. unmatched means biomarker_id is null and the label needs either a data fix upstream (contaminated scrape) or a synonym added to biomarker_hub.';

CREATE INDEX idx_ptb_provider_test_id ON public.provider_test_biomarkers (provider_test_id);
CREATE INDEX idx_ptb_biomarker_id ON public.provider_test_biomarkers (biomarker_id);
CREATE INDEX idx_ptb_unmatched ON public.provider_test_biomarkers (provider_test_id) WHERE biomarker_id IS NULL;

ALTER TABLE public.provider_test_biomarkers ENABLE ROW LEVEL SECURITY;

CREATE POLICY provider_test_biomarkers_public_read
  ON public.provider_test_biomarkers FOR SELECT USING (true);
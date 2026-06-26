
-- =========================================================================
-- PHASE 1: Dynamic Taxonomy Foundation
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS ltree;

-- -------------------------------------------------------------------------
-- 1. categories: the tree
-- -------------------------------------------------------------------------
CREATE TABLE public.categories (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text NOT NULL UNIQUE,
  parent_id       uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  name            text NOT NULL,
  short_name      text,
  description     text,
  icon            text,
  color           text,
  sort_order      integer NOT NULL DEFAULT 0,
  level           integer NOT NULL DEFAULT 0,
  path            ltree,
  seo_title       text,
  seo_description text,
  is_active       boolean NOT NULL DEFAULT true,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX categories_parent_idx ON public.categories(parent_id);
CREATE INDEX categories_path_gist_idx ON public.categories USING GIST (path);
CREATE INDEX categories_active_idx ON public.categories(is_active) WHERE is_active = true;

GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Admins manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-maintain level + path from parent_id
CREATE OR REPLACE FUNCTION public.categories_set_path()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  parent_path ltree;
  parent_level integer;
  safe_slug text;
BEGIN
  safe_slug := regexp_replace(lower(NEW.slug), '[^a-z0-9_]+', '_', 'g');
  IF NEW.parent_id IS NULL THEN
    NEW.level := 0;
    NEW.path := safe_slug::ltree;
  ELSE
    SELECT path, level INTO parent_path, parent_level
    FROM public.categories WHERE id = NEW.parent_id;
    IF parent_path IS NULL THEN
      RAISE EXCEPTION 'Parent category % has no path', NEW.parent_id;
    END IF;
    NEW.level := parent_level + 1;
    NEW.path := parent_path || safe_slug::ltree;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER categories_set_path_trg
  BEFORE INSERT OR UPDATE OF parent_id, slug ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.categories_set_path();

-- -------------------------------------------------------------------------
-- 2. category_aliases: name/pattern matches for crawl auto-classification
-- -------------------------------------------------------------------------
CREATE TABLE public.category_aliases (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id  uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  alias        text NOT NULL,
  match_type   text NOT NULL DEFAULT 'contains' CHECK (match_type IN ('exact','contains','regex','biomarker')),
  weight       integer NOT NULL DEFAULT 1,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX category_aliases_alias_idx ON public.category_aliases (lower(alias));
CREATE INDEX category_aliases_category_idx ON public.category_aliases(category_id);

GRANT SELECT ON public.category_aliases TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.category_aliases TO authenticated;
GRANT ALL ON public.category_aliases TO service_role;

ALTER TABLE public.category_aliases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Aliases are publicly readable"
  ON public.category_aliases FOR SELECT USING (true);

CREATE POLICY "Admins manage aliases"
  ON public.category_aliases FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- -------------------------------------------------------------------------
-- 3. category_test_mapping: many-to-many tests <-> categories
-- -------------------------------------------------------------------------
CREATE TABLE public.category_test_mapping (
  category_id       uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  provider_test_id  uuid NOT NULL REFERENCES public.provider_tests(id) ON DELETE CASCADE,
  source            text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','crawl','backfill','alias')),
  confidence        numeric NOT NULL DEFAULT 1.0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (category_id, provider_test_id)
);

CREATE INDEX category_test_mapping_test_idx ON public.category_test_mapping(provider_test_id);

GRANT SELECT ON public.category_test_mapping TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.category_test_mapping TO authenticated;
GRANT ALL ON public.category_test_mapping TO service_role;

ALTER TABLE public.category_test_mapping ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mappings are publicly readable"
  ON public.category_test_mapping FOR SELECT USING (true);

CREATE POLICY "Admins manage mappings"
  ON public.category_test_mapping FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- -------------------------------------------------------------------------
-- 4. Denormalised array on provider_tests + sync trigger
-- -------------------------------------------------------------------------
ALTER TABLE public.provider_tests
  ADD COLUMN IF NOT EXISTS category_ids uuid[] NOT NULL DEFAULT '{}'::uuid[];

CREATE INDEX IF NOT EXISTS provider_tests_category_ids_gin
  ON public.provider_tests USING GIN (category_ids);

CREATE OR REPLACE FUNCTION public.sync_provider_test_categories()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_id uuid;
BEGIN
  target_id := COALESCE(NEW.provider_test_id, OLD.provider_test_id);
  UPDATE public.provider_tests
     SET category_ids = COALESCE((
       SELECT array_agg(DISTINCT category_id)
       FROM public.category_test_mapping
       WHERE provider_test_id = target_id
     ), '{}'::uuid[])
   WHERE id = target_id;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER category_test_mapping_sync
  AFTER INSERT OR UPDATE OR DELETE ON public.category_test_mapping
  FOR EACH ROW EXECUTE FUNCTION public.sync_provider_test_categories();

-- -------------------------------------------------------------------------
-- 5. Lola-style standalone biomarker products
-- -------------------------------------------------------------------------
CREATE TABLE public.provider_biomarker_products (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id        text NOT NULL,
  biomarker_slug     text NOT NULL,
  biomarker_name     text NOT NULL,
  display_name       text,
  description        text,
  price              numeric,
  currency           text NOT NULL DEFAULT 'GBP',
  sample_type        text,
  turnaround_days    integer,
  url                text,
  image_url          text,
  provider_product_id text,
  category_ids       uuid[] NOT NULL DEFAULT '{}'::uuid[],
  seo_title          text,
  seo_description    text,
  is_active          boolean NOT NULL DEFAULT true,
  metadata           jsonb NOT NULL DEFAULT '{}'::jsonb,
  scraped_at         timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider_id, biomarker_slug)
);

CREATE INDEX provider_biomarker_products_provider_idx ON public.provider_biomarker_products(provider_id);
CREATE INDEX provider_biomarker_products_active_idx ON public.provider_biomarker_products(is_active) WHERE is_active = true;
CREATE INDEX provider_biomarker_products_category_gin ON public.provider_biomarker_products USING GIN (category_ids);

GRANT SELECT ON public.provider_biomarker_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.provider_biomarker_products TO authenticated;
GRANT ALL ON public.provider_biomarker_products TO service_role;

ALTER TABLE public.provider_biomarker_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Biomarker products are publicly readable"
  ON public.provider_biomarker_products FOR SELECT USING (true);

CREATE POLICY "Admins manage biomarker products"
  ON public.provider_biomarker_products FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER provider_biomarker_products_updated_at
  BEFORE UPDATE ON public.provider_biomarker_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- -------------------------------------------------------------------------
-- 6. Helper: resolve categories from arbitrary text via aliases
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.resolve_categories_for_text(_text text)
RETURNS uuid[]
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result uuid[] := '{}'::uuid[];
  lower_text text;
BEGIN
  IF _text IS NULL OR _text = '' THEN RETURN result; END IF;
  lower_text := lower(_text);

  SELECT COALESCE(array_agg(DISTINCT category_id), '{}'::uuid[]) INTO result
  FROM public.category_aliases
  WHERE (match_type = 'exact'    AND lower(alias) = lower_text)
     OR (match_type = 'contains' AND lower_text LIKE '%' || lower(alias) || '%')
     OR (match_type = 'regex'    AND lower_text ~ alias);

  RETURN result;
END;
$$;

-- =========================================================================
-- SEED THE TAXONOMY TREE
-- =========================================================================

DO $$
DECLARE
  root_at_home     uuid;
  root_sports      uuid;
  root_general     uuid;
  root_womens      uuid;
  root_mens        uuid;
  root_hormones    uuid;
  root_thyroid     uuid;
  root_heart       uuid;
  root_vitamins    uuid;
  root_fertility   uuid;
  root_cancer      uuid;
  root_gut         uuid;
  root_allergy     uuid;
  root_sexual      uuid;
  root_biomarkers  uuid;

  -- at-home
  c_finger_prick   uuid;
  c_urine          uuid;
  c_bowel          uuid;

  -- sports
  c_bodybuilding   uuid;
  c_ath_perf       uuid;
  c_endurance      uuid;
  c_recovery       uuid;
  c_training       uuid;
  c_sports_nut     uuid;
  c_perf_opt       uuid;
BEGIN
  -- ---------- Top-level roots ----------
  INSERT INTO public.categories (slug, name, short_name, description, color, sort_order)
  VALUES
    ('at-home',          'At Home Tests',      'At Home',         'Tests you can take in the comfort of your own home.',                                  '#22c0d4', 10),
    ('sports-fitness',   'Sports & Fitness',   'Fitness',         'Biomarker testing for athletes, bodybuilders and fitness enthusiasts.',                '#e70d69', 20),
    ('general-health',   'General Health',     'General',         'Comprehensive health screening and wellness panels.',                                  '#22c0d4', 30),
    ('womens-health',    'Women''s Health',    'Women',           'Hormones, fertility, and wellness for women.',                                          '#e70d69', 40),
    ('mens-health',      'Men''s Health',      'Men',             'Hormones, prostate and wellness for men.',                                              '#081129', 50),
    ('hormones',         'Hormone Tests',      'Hormones',        'Thyroid, sex hormones, cortisol and reproductive hormone testing.',                    '#e70d69', 60),
    ('thyroid',          'Thyroid Tests',      'Thyroid',         'Thyroid function and antibody testing.',                                                '#22c0d4', 70),
    ('heart-health',     'Heart Health',       'Heart',           'Cholesterol, lipids and cardiovascular risk testing.',                                  '#e70d69', 80),
    ('vitamins',         'Vitamin & Mineral',  'Vitamins',        'Vitamin, mineral and nutrient deficiency screening.',                                   '#22c0d4', 90),
    ('fertility',        'Fertility',          'Fertility',       'Fertility, AMH, sperm and reproductive testing.',                                       '#e70d69', 100),
    ('cancer-screening', 'Cancer Screening',   'Cancer',          'Early detection and preventive screening.',                                             '#081129', 110),
    ('gut-health',       'Gut Health',         'Gut',             'Digestive health, microbiome and food sensitivity.',                                    '#22c0d4', 120),
    ('allergy-testing',  'Allergy Testing',    'Allergy',         'Food and environmental allergy screening.',                                             '#e70d69', 130),
    ('sexual-health',    'Sexual Health',      'Sexual',          'STI screening and sexual wellness.',                                                    '#22c0d4', 140),
    ('biomarkers',       'Individual Biomarkers','Biomarkers',    'Single-biomarker tests you can order on their own.',                                    '#081129', 150)
  ON CONFLICT (slug) DO UPDATE
    SET name = EXCLUDED.name,
        short_name = EXCLUDED.short_name,
        description = EXCLUDED.description,
        color = EXCLUDED.color,
        sort_order = EXCLUDED.sort_order;

  SELECT id INTO root_at_home    FROM public.categories WHERE slug = 'at-home';
  SELECT id INTO root_sports     FROM public.categories WHERE slug = 'sports-fitness';
  SELECT id INTO root_general    FROM public.categories WHERE slug = 'general-health';
  SELECT id INTO root_womens     FROM public.categories WHERE slug = 'womens-health';
  SELECT id INTO root_mens       FROM public.categories WHERE slug = 'mens-health';
  SELECT id INTO root_hormones   FROM public.categories WHERE slug = 'hormones';
  SELECT id INTO root_thyroid    FROM public.categories WHERE slug = 'thyroid';
  SELECT id INTO root_heart      FROM public.categories WHERE slug = 'heart-health';
  SELECT id INTO root_vitamins   FROM public.categories WHERE slug = 'vitamins';
  SELECT id INTO root_fertility  FROM public.categories WHERE slug = 'fertility';
  SELECT id INTO root_cancer     FROM public.categories WHERE slug = 'cancer-screening';
  SELECT id INTO root_gut        FROM public.categories WHERE slug = 'gut-health';
  SELECT id INTO root_allergy    FROM public.categories WHERE slug = 'allergy-testing';
  SELECT id INTO root_sexual     FROM public.categories WHERE slug = 'sexual-health';
  SELECT id INTO root_biomarkers FROM public.categories WHERE slug = 'biomarkers';

  -- ---------- At-Home children ----------
  INSERT INTO public.categories (slug, parent_id, name, short_name, description, sort_order) VALUES
    ('finger-prick', root_at_home, 'Finger Prick Tests', 'Finger Prick', 'Capillary blood collection tests you can do at home.', 10),
    ('urine-tests',  root_at_home, 'Urine Tests',        'Urine',        'At-home urine diagnostics for kidney, UTI, hormones and fertility.', 20),
    ('bowel-tests',  root_at_home, 'Bowel Tests',        'Bowel',        'FIT, faecal occult blood, microbiome and bowel cancer screening.', 30)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name;

  SELECT id INTO c_finger_prick FROM public.categories WHERE slug = 'finger-prick';
  SELECT id INTO c_urine        FROM public.categories WHERE slug = 'urine-tests';
  SELECT id INTO c_bowel        FROM public.categories WHERE slug = 'bowel-tests';

  -- finger prick sub-areas (leaves)
  INSERT INTO public.categories (slug, parent_id, name, sort_order) VALUES
    ('finger-prick-cholesterol',     c_finger_prick, 'Finger Prick Cholesterol',     10),
    ('finger-prick-hba1c',           c_finger_prick, 'Finger Prick HbA1c',           20),
    ('finger-prick-hormones',        c_finger_prick, 'Finger Prick Hormones',        30),
    ('finger-prick-vitamins',        c_finger_prick, 'Finger Prick Vitamins',        40),
    ('finger-prick-general',         c_finger_prick, 'Finger Prick General Health',  50),
    ('finger-prick-cardiovascular',  c_finger_prick, 'Finger Prick Cardiovascular',  60),
    ('finger-prick-diabetes',        c_finger_prick, 'Finger Prick Diabetes',        70),
    ('finger-prick-iron',            c_finger_prick, 'Finger Prick Iron',            80),
    ('finger-prick-liver',           c_finger_prick, 'Finger Prick Liver',           90),
    ('finger-prick-kidney',          c_finger_prick, 'Finger Prick Kidney',         100),
    ('finger-prick-thyroid',         c_finger_prick, 'Finger Prick Thyroid',        110)
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO public.categories (slug, parent_id, name, sort_order) VALUES
    ('urine-kidney',     c_urine, 'Urine Kidney',     10),
    ('urine-uti',        c_urine, 'Urine UTI',        20),
    ('urine-hormones',   c_urine, 'Urine Hormones',   30),
    ('urine-fertility',  c_urine, 'Urine Fertility',  40),
    ('urine-general',    c_urine, 'Urine General',    50),
    ('urine-metabolic',  c_urine, 'Urine Metabolic',  60)
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO public.categories (slug, parent_id, name, sort_order) VALUES
    ('bowel-fit',                c_bowel, 'FIT Test',                  10),
    ('bowel-faecal-occult',      c_bowel, 'Faecal Occult Blood',       20),
    ('bowel-gut-inflammation',   c_bowel, 'Gut Inflammation',          30),
    ('bowel-microbiome',         c_bowel, 'Microbiome',                40),
    ('bowel-digestive',          c_bowel, 'Digestive Health',          50),
    ('bowel-colorectal',         c_bowel, 'Colorectal Screening',      60),
    ('bowel-cancer-screening',   c_bowel, 'Bowel Cancer Screening',    70)
  ON CONFLICT (slug) DO NOTHING;

  -- ---------- Sports & Fitness children ----------
  INSERT INTO public.categories (slug, parent_id, name, short_name, description, sort_order) VALUES
    ('bodybuilding',            root_sports, 'Bodybuilding',                'Bodybuilding',  'Hormone optimisation and bodybuilding-specific blood testing.', 10),
    ('athletic-performance',    root_sports, 'Athletic Performance',        'Performance',   'Sport-specific testing across cycling, running, swimming, triathlon, CrossFit and more.', 20),
    ('endurance',               root_sports, 'Endurance',                   'Endurance',     'Biomarkers for endurance athletes.', 30),
    ('recovery',                root_sports, 'Recovery',                    'Recovery',      'Cortisol, CK, inflammation and recovery biomarkers.', 40),
    ('training-tests',          root_sports, 'Training Tests',              'Training',      'Routine athlete monitoring and training readiness.', 50),
    ('sports-nutrition',        root_sports, 'Sports Nutrition',            'Nutrition',     'Nutritional biomarkers relevant to performance.', 60),
    ('performance-optimisation',root_sports, 'Performance Optimisation',    'Optimisation', 'Maximising athletic performance through biomarker optimisation.', 70)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, short_name = EXCLUDED.short_name, description = EXCLUDED.description;

  SELECT id INTO c_bodybuilding FROM public.categories WHERE slug = 'bodybuilding';
  SELECT id INTO c_ath_perf     FROM public.categories WHERE slug = 'athletic-performance';
  SELECT id INTO c_endurance    FROM public.categories WHERE slug = 'endurance';
  SELECT id INTO c_recovery     FROM public.categories WHERE slug = 'recovery';
  SELECT id INTO c_training     FROM public.categories WHERE slug = 'training-tests';
  SELECT id INTO c_sports_nut   FROM public.categories WHERE slug = 'sports-nutrition';
  SELECT id INTO c_perf_opt     FROM public.categories WHERE slug = 'performance-optimisation';

  -- bodybuilding leaves
  INSERT INTO public.categories (slug, parent_id, name, sort_order) VALUES
    ('bb-trt-monitoring',       c_bodybuilding, 'TRT Monitoring',           10),
    ('bb-hormone-optimisation', c_bodybuilding, 'Hormone Optimisation',     20),
    ('bb-enhanced-athlete',     c_bodybuilding, 'Enhanced Athlete Monitoring', 30),
    ('bb-steroid-monitoring',   c_bodybuilding, 'Steroid Monitoring',       40),
    ('bb-body-composition',     c_bodybuilding, 'Body Composition',         50),
    ('bb-muscle-growth',        c_bodybuilding, 'Muscle Growth',            60),
    ('bb-liver',                c_bodybuilding, 'Liver Monitoring',         70),
    ('bb-kidney',               c_bodybuilding, 'Kidney Monitoring',        80),
    ('bb-cardio',               c_bodybuilding, 'Cardiovascular Monitoring',90),
    ('bb-oestrogen',            c_bodybuilding, 'Oestrogen Monitoring',    100),
    ('bb-testosterone-opt',     c_bodybuilding, 'Testosterone Optimisation',110)
  ON CONFLICT (slug) DO NOTHING;

  -- athletic-performance sports
  INSERT INTO public.categories (slug, parent_id, name, sort_order) VALUES
    ('sport-cycling',            c_ath_perf, 'Cycling',             10),
    ('sport-running',            c_ath_perf, 'Running',              20),
    ('sport-swimming',           c_ath_perf, 'Swimming',             30),
    ('sport-triathlon',          c_ath_perf, 'Triathlon',            40),
    ('sport-crossfit',           c_ath_perf, 'CrossFit',             50),
    ('sport-hyrox',              c_ath_perf, 'HYROX',                60),
    ('sport-functional-fitness', c_ath_perf, 'Functional Fitness',   70),
    ('sport-team-sports',        c_ath_perf, 'Team Sports',          80),
    ('sport-combat-sports',      c_ath_perf, 'Combat Sports',        90),
    ('sport-endurance-athletes', c_ath_perf, 'Endurance Athletes',  100),
    ('sport-strength-athletes',  c_ath_perf, 'Strength Athletes',   110),
    ('sport-male-performance',   c_ath_perf, 'Male Performance',    120),
    ('sport-female-performance', c_ath_perf, 'Female Performance',  130)
  ON CONFLICT (slug) DO NOTHING;

  -- endurance leaves
  INSERT INTO public.categories (slug, parent_id, name, sort_order) VALUES
    ('end-iron',          c_endurance, 'Iron',                10),
    ('end-ferritin',      c_endurance, 'Ferritin',            20),
    ('end-b12',           c_endurance, 'Vitamin B12',         30),
    ('end-electrolytes',  c_endurance, 'Electrolytes',        40),
    ('end-muscle-fatigue',c_endurance, 'Muscle Fatigue',      50),
    ('end-recovery',      c_endurance, 'Recovery Markers',    60),
    ('end-inflammation',  c_endurance, 'Inflammation',        70),
    ('end-oxygen',        c_endurance, 'Oxygen Carrying Capacity', 80)
  ON CONFLICT (slug) DO NOTHING;

  -- recovery leaves
  INSERT INTO public.categories (slug, parent_id, name, sort_order) VALUES
    ('rec-cortisol',         c_recovery, 'Cortisol',           10),
    ('rec-ck',               c_recovery, 'Creatine Kinase',    20),
    ('rec-inflammation',     c_recovery, 'Inflammation',       30),
    ('rec-deficiencies',     c_recovery, 'Nutrient Deficiencies', 40),
    ('rec-sleep',            c_recovery, 'Sleep Recovery',     50),
    ('rec-hormones',         c_recovery, 'Hormones',           60),
    ('rec-stress',           c_recovery, 'Stress Markers',     70)
  ON CONFLICT (slug) DO NOTHING;

  -- training leaves
  INSERT INTO public.categories (slug, parent_id, name, sort_order) VALUES
    ('tr-baseline',          c_training, 'Baseline Health',          10),
    ('tr-progress',          c_training, 'Progress Monitoring',      20),
    ('tr-readiness',         c_training, 'Training Readiness',       30),
    ('tr-injury-prevention', c_training, 'Injury Prevention',        40),
    ('tr-seasonal',          c_training, 'Seasonal Testing',         50)
  ON CONFLICT (slug) DO NOTHING;

  -- sports nutrition leaves
  INSERT INTO public.categories (slug, parent_id, name, sort_order) VALUES
    ('sn-vitamin-d',     c_sports_nut, 'Vitamin D',     10),
    ('sn-magnesium',     c_sports_nut, 'Magnesium',     20),
    ('sn-zinc',          c_sports_nut, 'Zinc',          30),
    ('sn-omega-3',       c_sports_nut, 'Omega 3',       40),
    ('sn-b-vitamins',    c_sports_nut, 'B Vitamins',    50),
    ('sn-iron',          c_sports_nut, 'Iron',          60),
    ('sn-protein',       c_sports_nut, 'Protein Markers', 70),
    ('sn-electrolytes',  c_sports_nut, 'Electrolytes',  80)
  ON CONFLICT (slug) DO NOTHING;

  -- performance optimisation leaves
  INSERT INTO public.categories (slug, parent_id, name, sort_order) VALUES
    ('po-hormone',           c_perf_opt, 'Hormone Optimisation',         10),
    ('po-recovery',          c_perf_opt, 'Recovery Optimisation',        20),
    ('po-nutrition',         c_perf_opt, 'Nutrition Optimisation',       30),
    ('po-cardio',            c_perf_opt, 'Cardiovascular Optimisation',  40),
    ('po-energy',            c_perf_opt, 'Energy Production',            50),
    ('po-fatigue',           c_perf_opt, 'Fatigue Monitoring',           60),
    ('po-performance-track', c_perf_opt, 'Performance Tracking',         70)
  ON CONFLICT (slug) DO NOTHING;

END $$;

-- =========================================================================
-- SEED ALIASES (drives crawl auto-classification + back-fill)
-- =========================================================================

INSERT INTO public.category_aliases (category_id, alias, match_type, weight)
SELECT c.id, a.alias, a.match_type, a.weight
FROM (VALUES
  -- at-home roots
  ('at-home',        'at home',         'contains', 2),
  ('at-home',        'home test',       'contains', 2),
  ('at-home',        'home kit',        'contains', 2),
  ('finger-prick',   'finger prick',    'contains', 3),
  ('finger-prick',   'fingerprick',     'contains', 3),
  ('finger-prick',   'capillary',       'contains', 2),
  ('urine-tests',    'urine',           'contains', 3),
  ('bowel-tests',    'bowel',           'contains', 3),
  ('bowel-tests',    'fit test',        'contains', 3),
  ('bowel-tests',    'faecal',          'contains', 3),
  ('bowel-tests',    'fecal',           'contains', 3),
  ('bowel-tests',    'occult blood',    'contains', 3),
  ('bowel-tests',    'colorectal',      'contains', 3),
  ('bowel-tests',    'microbiome',      'contains', 2),
  ('bowel-tests',    'gut',             'contains', 1),
  ('bowel-cancer-screening','bowel cancer','contains', 3),
  ('bowel-microbiome',     'microbiome',  'contains', 3),

  -- sports & fitness
  ('sports-fitness',  'sport',           'contains', 2),
  ('sports-fitness',  'fitness',         'contains', 2),
  ('sports-fitness',  'athlete',         'contains', 2),
  ('sports-fitness',  'athletic',        'contains', 2),
  ('sports-fitness',  'performance',     'contains', 1),
  ('bodybuilding',    'bodybuilding',    'contains', 3),
  ('bodybuilding',    'bodybuilder',     'contains', 3),
  ('bodybuilding',    'trt',             'contains', 3),
  ('bodybuilding',    'enhanced athlete','contains', 3),
  ('bodybuilding',    'steroid',         'contains', 2),
  ('athletic-performance', 'athletic performance', 'contains', 3),
  ('athletic-performance', 'sport performance',    'contains', 3),
  ('sport-cycling',   'cycling',         'contains', 3),
  ('sport-cycling',   'cyclist',         'contains', 3),
  ('sport-running',   'running',         'contains', 3),
  ('sport-running',   'runner',          'contains', 3),
  ('sport-swimming',  'swimming',        'contains', 3),
  ('sport-swimming',  'swimmer',         'contains', 3),
  ('sport-triathlon', 'triathlon',       'contains', 3),
  ('sport-triathlon', 'triathlete',      'contains', 3),
  ('sport-crossfit',  'crossfit',        'contains', 3),
  ('sport-hyrox',     'hyrox',           'contains', 3),
  ('sport-functional-fitness','functional fitness','contains', 3),
  ('sport-team-sports','team sport',     'contains', 3),
  ('sport-combat-sports','combat',       'contains', 3),
  ('sport-combat-sports','boxing',       'contains', 3),
  ('sport-combat-sports','mma',          'contains', 3),
  ('sport-endurance-athletes','endurance athlete','contains', 3),
  ('sport-strength-athletes','strength athlete','contains', 3),
  ('sport-strength-athletes','weightlifter','contains', 3),
  ('sport-strength-athletes','powerlifter','contains', 3),
  ('endurance',       'endurance',       'contains', 3),
  ('recovery',        'recovery',        'contains', 3),
  ('training-tests',  'training',        'contains', 2),
  ('sports-nutrition','sports nutrition','contains', 3),
  ('performance-optimisation','performance optimisation','contains', 3),
  ('performance-optimisation','performance optimization','contains', 3),

  -- common categories
  ('hormones',        'hormone',         'contains', 3),
  ('thyroid',         'thyroid',         'contains', 3),
  ('thyroid',         'tsh',             'contains', 2),
  ('heart-health',    'cholesterol',     'contains', 3),
  ('heart-health',    'lipid',           'contains', 3),
  ('heart-health',    'cardio',          'contains', 2),
  ('heart-health',    'heart',           'contains', 3),
  ('vitamins',        'vitamin',         'contains', 3),
  ('vitamins',        'mineral',         'contains', 2),
  ('fertility',       'fertility',       'contains', 3),
  ('fertility',       'amh',             'contains', 3),
  ('fertility',       'sperm',           'contains', 3),
  ('cancer-screening','cancer',          'contains', 3),
  ('cancer-screening','psa',             'contains', 2),
  ('gut-health',      'gut',             'contains', 2),
  ('gut-health',      'digestive',       'contains', 3),
  ('allergy-testing', 'allergy',         'contains', 3),
  ('allergy-testing', 'intolerance',     'contains', 3),
  ('sexual-health',   'sti',             'contains', 3),
  ('sexual-health',   'sexual',          'contains', 3),
  ('sexual-health',   'chlamydia',       'contains', 3),
  ('sexual-health',   'hiv',             'contains', 3),
  ('womens-health',   'women',           'contains', 2),
  ('womens-health',   'female',          'contains', 2),
  ('womens-health',   'menopause',       'contains', 3),
  ('mens-health',     'men''s',          'contains', 2),
  ('mens-health',     'male',            'contains', 2),
  ('mens-health',     'prostate',        'contains', 3),
  ('general-health',  'general health',  'contains', 3),
  ('general-health',  'wellness',        'contains', 2),
  ('general-health',  'health check',    'contains', 2)
) AS a(slug, alias, match_type, weight)
JOIN public.categories c ON c.slug = a.slug
ON CONFLICT DO NOTHING;

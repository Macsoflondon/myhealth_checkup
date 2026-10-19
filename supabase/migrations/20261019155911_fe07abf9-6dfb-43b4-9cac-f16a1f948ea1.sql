-- Provider collection fee rules.
--
-- Scrapers capture each test's list price but not the provider's blood-draw
-- charge, so 520+ active tests showed "Additional collection fees: None" and a
-- total equal to the list price (Clinilabs £50 FBC shown as £50, real £80).
-- The fee is a provider policy, not a per-product field, so it lives here once
-- per provider and route and unified_provider_tests applies it to every
-- matching test, including tests added by future scrapes. Scrapers never write
-- this table.
--
-- route: 'clinic_only' = blood taken in clinic, no home kit offered;
--        'home_kit'    = a home kit is offered (the cheapest route);
--        'any'         = every blood test from the provider.
-- Rules apply to blood samples only. Urine, stool, saliva and swab tests keep
-- their own recorded values.
-- fee_type follows src/lib/comparisonFormat.ts: 'fixed' and 'from' are
-- mandatory and added to total_expected_cost; 'self_arranged' means the
-- provider charges nothing if you arrange your own blood draw, so it is not
-- added, and fee_amount holds the cheapest paid collection option.
-- Each rule was checked on the provider's own product page on verified_at.

CREATE TABLE IF NOT EXISTS public.provider_collection_fee_rules (
  provider_id text NOT NULL,
  route text NOT NULL CHECK (route IN ('any', 'clinic_only', 'home_kit')),
  fee_type text NOT NULL CHECK (fee_type IN ('none', 'fixed', 'from', 'varies', 'self_arranged')),
  fee_amount numeric(10, 2),
  note text,
  source_url text NOT NULL,
  verified_at date NOT NULL,
  PRIMARY KEY (provider_id, route),
  CONSTRAINT provider_collection_fee_rules_amount_check CHECK (
    (fee_type IN ('fixed', 'from', 'self_arranged') AND fee_amount > 0)
    OR (fee_type IN ('none', 'varies') AND fee_amount IS NULL)
  )
);

ALTER TABLE public.provider_collection_fee_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read provider collection fee rules" ON public.provider_collection_fee_rules;
CREATE POLICY "Public can read provider collection fee rules"
  ON public.provider_collection_fee_rules
  FOR SELECT
  TO anon, authenticated
  USING (true);

REVOKE ALL ON public.provider_collection_fee_rules FROM anon, authenticated;
GRANT SELECT ON public.provider_collection_fee_rules TO anon, authenticated;
GRANT ALL ON public.provider_collection_fee_rules TO service_role;

INSERT INTO public.provider_collection_fee_rules
  (provider_id, route, fee_type, fee_amount, note, source_url, verified_at)
VALUES
  ('clinilabs', 'any', 'from', 30.00,
   'Clinilabs charge £30 for a blood draw at their Fitzrovia clinic when booked online (£50 as a walk-in), or £35 at a partner clinic.',
   'https://www.clinilabs.co.uk/products/full-blood-count', '2026-10-19'),
  ('medical-diagnosis', 'clinic_only', 'fixed', 24.00,
   'Medical Diagnosis list a £24 phlebotomy service fee for taking your blood sample.',
   'https://www.medical-diagnosis.co.uk/exam/profiles/health-checks-profiles/hematology-profile/', '2026-10-19'),
  ('london-medical-laboratory', 'clinic_only', 'fixed', 35.00,
   'London Medical Laboratory charge £35 for an onsite blood draw, or £80 for a home phlebotomy visit.',
   'https://www.londonmedicallaboratory.com/product/vitamin-b12', '2026-10-19'),
  ('london-medical-laboratory', 'home_kit', 'fixed', 3.99,
   'London Medical Laboratory charge £3.99 to post the home kit. Return postage is included.',
   'https://www.londonmedicallaboratory.com/product/vitamin-b12', '2026-10-19'),
  ('medichecks', 'clinic_only', 'self_arranged', 35.00,
   'Free if you arrange your own blood draw. Medichecks charge £35 for a partner clinic or £59 for a home nurse visit.',
   'https://www.medichecks.com/products/full-blood-count-fbc-blood-test', '2026-10-19'),
  ('medichecks', 'home_kit', 'none', NULL, NULL,
   'https://www.medichecks.com/products/folate-serum-blood-test', '2026-10-19'),
  ('lola-health', 'clinic_only', 'self_arranged', 35.00,
   'Free if you arrange your own phlebotomist. Lola Health charge £35 for a clinic or home visit.',
   'https://lolahealth.com/products/female-hormones-clarity', '2026-10-19'),
  ('lola-health', 'home_kit', 'none', NULL, NULL,
   'https://lolahealth.com/products/female-hormones-clarity', '2026-10-19'),
  ('goodbody-clinic', 'clinic_only', 'none', NULL,
   'The in-clinic price includes the blood draw. A nurse home visit costs extra.',
   'https://goodbodyclinic.com/products/full-blood-count-blood-test', '2026-10-19'),
  ('goodbody-clinic', 'home_kit', 'none', NULL, NULL,
   'https://goodbodyclinic.com/products/thyroid-function-blood-test', '2026-10-19')
ON CONFLICT (provider_id, route) DO UPDATE SET
  fee_type = EXCLUDED.fee_type,
  fee_amount = EXCLUDED.fee_amount,
  note = EXCLUDED.note,
  source_url = EXCLUDED.source_url,
  verified_at = EXCLUDED.verified_at;

-- Same definition as 20261016114310 with three changes: the fee rule is
-- applied ahead of the row and mapping values; collection_fee_note is added;
-- price_checked_at exposes provider_tests.last_validated_at, which the 6-hourly
-- mhc-* syncs set on every run (scraped_at is only set by the retired
-- *-scraper functions and is months old). New columns are appended so
-- catalogue_freshness and existing column positions are unaffected.
CREATE OR REPLACE VIEW public.unified_provider_tests
WITH (security_invoker = on) AS
 WITH j AS (
         SELECT pt.id, pt.provider_id, pt.test_name, pt.description, pt.price, pt.category, pt.url, pt.image_url,
            pt.provider_test_id, pt.is_active, pt.scraped_at, pt.created_at, pt.updated_at,
            pt.gp_consultation_included, pt.gp_consultation_cost, pt.phlebotomy_included, pt.phlebotomy_cost,
            pt.home_kit_available, pt.clinic_visit_available, pt.location_options, pt.lab_ukas_accredited,
            pt.lab_cqc_regulated, pt.lab_iso15189, pt.sample_type, pt.biomarker_count, pt.biomarkers_list,
            pt.is_addon, pt.original_price, pt.discount_percentage, pt.symptoms, pt.who_should_test, pt.conditions,
            pt.url_verified, pt.url_verified_at, pt.is_popular, pt.popularity_rank, pt.turnaround_days_text,
            pt.base_price, pt.collection_options, pt.source_section, pt.source_section_label, pt.canonical_category,
            pt.collection_method, pt.collection_fee_type, pt.collection_fee_amount, pt.clinical_review_type,
            pt.clinical_review_fee, pt.last_validated_at,
            m.sample_type AS m_sample_type,
            m.collection_method AS m_collection_method,
            m.collection_fee_type AS m_collection_fee_type,
            m.collection_fee_amount AS m_collection_fee_amount,
            m.clinical_review_type AS m_clinical_review_type,
            m.clinical_review_fee AS m_clinical_review_fee
           FROM provider_tests pt
             LEFT JOIN LATERAL ( SELECT m2.sample_type, m2.collection_method, m2.collection_fee_type,
                    m2.collection_fee_amount, m2.clinical_review_type, m2.clinical_review_fee
                   FROM provider_test_mapping m2
                  WHERE m2.provider_id = pt.provider_id AND m2.provider_test_id = pt.provider_test_id
                  ORDER BY (m2.provider_test_uuid = pt.id) DESC NULLS LAST, (m2.sample_type IS NOT NULL OR m2.collection_method IS NOT NULL OR m2.collection_fee_type IS NOT NULL OR m2.clinical_review_type IS NOT NULL) DESC, m2.updated_at DESC NULLS LAST, m2.id
                 LIMIT 1) m ON true
          WHERE pt.is_active = true
        ), s AS (
         SELECT j.*,
            COALESCE(j.m_sample_type,
                CASE
                    WHEN j.sample_type IS NULL THEN NULL::text
                    WHEN lower(j.sample_type) ~~ '%finger%'::text AND (lower(j.sample_type) ~~ '%venous%'::text OR lower(j.sample_type) ~~ '%blood%'::text) THEN 'multiple'::text
                    WHEN lower(j.sample_type) ~~ '%finger%'::text THEN 'finger_prick'::text
                    WHEN lower(j.sample_type) ~~ '%venous%'::text THEN 'venous'::text
                    WHEN lower(j.sample_type) ~~ '%blood%'::text THEN 'venous'::text
                    WHEN lower(j.sample_type) ~~ '%saliva%'::text THEN 'saliva'::text
                    WHEN lower(j.sample_type) ~~ '%stool%'::text THEN 'stool'::text
                    WHEN lower(j.sample_type) ~~ '%urine%'::text THEN 'urine'::text
                    WHEN lower(j.sample_type) ~~ '%swab%'::text THEN 'buccal_swab'::text
                    ELSE 'multiple'::text
                END) AS norm_sample_type
           FROM j
        ), f AS (
         SELECT s.*,
            fr.provider_id IS NOT NULL AS has_fee_rule,
            fr.fee_type AS rule_fee_type,
            fr.fee_amount AS rule_fee_amount,
            fr.note AS rule_fee_note
           FROM s
             LEFT JOIN LATERAL ( SELECT r.provider_id, r.fee_type, r.fee_amount, r.note
                   FROM provider_collection_fee_rules r
                  WHERE r.provider_id = s.provider_id
                    AND (s.norm_sample_type IS NULL OR s.norm_sample_type = ANY (ARRAY['venous'::text, 'finger_prick'::text, 'multiple'::text]))
                    AND (r.route = 'any'::text
                      OR r.route = CASE
                            WHEN COALESCE(s.home_kit_available, false) THEN 'home_kit'::text
                            WHEN COALESCE(s.clinic_visit_available, false) THEN 'clinic_only'::text
                            ELSE NULL::text
                        END)
                  ORDER BY (r.route = 'any'::text)
                 LIMIT 1) fr ON true
        ), c AS (
         SELECT f.*,
                CASE WHEN f.has_fee_rule THEN f.rule_fee_type
                     ELSE COALESCE(f.collection_fee_type, f.m_collection_fee_type)
                END AS eff_collection_fee_type,
                CASE WHEN f.has_fee_rule THEN f.rule_fee_amount
                     ELSE COALESCE(f.collection_fee_amount, f.m_collection_fee_amount)
                END AS eff_collection_fee_amount
           FROM f
        )
 SELECT id,
    provider_id,
        CASE provider_id
            WHEN 'randox'::text THEN 'Randox Health'::text
            WHEN 'medichecks'::text THEN 'Medichecks'::text
            WHEN 'thriva'::text THEN 'Thriva'::text
            WHEN 'lola-health'::text THEN 'Lola Health'::text
            WHEN 'goodbody-clinic'::text THEN 'Goodbody Clinic'::text
            WHEN 'london-medical-laboratory'::text THEN 'London Medical Laboratory'::text
            WHEN 'london-health-company'::text THEN 'London Health Company'::text
            WHEN 'medical-diagnosis'::text THEN 'Medical Diagnosis'::text
            WHEN 'clinilabs'::text THEN 'Clinilabs'::text
            ELSE initcap(replace(provider_id, '-'::text, ' '::text))
        END AS provider_name,
    test_name, description, price, original_price, discount_percentage, is_addon,
        CASE lower(COALESCE(canonical_category, ''::text))
            WHEN 'gut'::text THEN 'gut-health'::text
            WHEN 'vitamins-minerals'::text THEN 'vitamins'::text
            WHEN ''::text THEN NULL::text
            ELSE lower(canonical_category)
        END AS category_primary,
        CASE lower(COALESCE(canonical_category, ''::text))
            WHEN 'general-health'::text THEN 'General Health'::text
            WHEN 'heart'::text THEN 'Cardiovascular'::text
            WHEN 'diabetes'::text THEN 'Metabolic & Diabetes'::text
            WHEN 'thyroid'::text THEN 'Thyroid'::text
            WHEN 'vitamins'::text THEN 'Nutrition & Vitamins'::text
            WHEN 'vitamins-minerals'::text THEN 'Nutrition & Vitamins'::text
            WHEN 'liver-health'::text THEN 'Liver Health'::text
            WHEN 'kidney-health'::text THEN 'Kidney Health'::text
            WHEN 'mens-health'::text THEN 'Men''s Health'::text
            WHEN 'womens-health'::text THEN 'Women''s Health'::text
            WHEN 'sports-performance'::text THEN 'Sports & Performance'::text
            WHEN 'inflammation'::text THEN 'Inflammation'::text
            WHEN 'wellness'::text THEN 'Wellness'::text
            WHEN 'blood-health'::text THEN 'Blood Health'::text
            WHEN 'cancer-screening'::text THEN 'Cancer & Tumour Markers'::text
            WHEN 'fertility'::text THEN 'Fertility & Reproductive'::text
            WHEN 'general-wellness'::text THEN 'General Wellness'::text
            WHEN 'sexual-health'::text THEN 'Sexual Health'::text
            WHEN 'gut-health'::text THEN 'Gut Health'::text
            WHEN 'gut'::text THEN 'Gut Health'::text
            WHEN 'allergy'::text THEN 'Allergy & Immunology'::text
            WHEN 'genetic-testing'::text THEN 'Genetic Testing'::text
            WHEN 'hormones'::text THEN 'Hormones & Endocrine'::text
            ELSE 'Other'::text
        END AS body_system,
    norm_sample_type AS sample_type,
    sample_type AS sample_type_raw,
    COALESCE(collection_method, m_collection_method) AS collection_method,
    eff_collection_fee_type AS collection_fee_type,
    eff_collection_fee_amount::numeric(6,2) AS collection_fee_amount,
    COALESCE(clinical_review_type, m_clinical_review_type) AS clinical_review_type,
    COALESCE(clinical_review_fee, m_clinical_review_fee) AS clinical_review_fee,
    COALESCE(price, 0::numeric) +
        CASE
            WHEN eff_collection_fee_type = ANY (ARRAY['fixed'::text, 'from'::text]) THEN COALESCE(eff_collection_fee_amount, 0::numeric)
            ELSE 0::numeric
        END +
        CASE
            WHEN COALESCE(clinical_review_type, m_clinical_review_type) IS NOT NULL AND (COALESCE(clinical_review_type, m_clinical_review_type) <> ALL (ARRAY['optional'::text, 'not_included'::text, 'not_available'::text])) THEN COALESCE(COALESCE(clinical_review_fee, m_clinical_review_fee), 0::numeric)
            ELSE 0::numeric
        END AS total_expected_cost,
    biomarker_count,
    biomarkers_list,
    COALESCE(jsonb_array_length(
        CASE
            WHEN jsonb_typeof(biomarkers_list) = 'array'::text THEN biomarkers_list
            ELSE '[]'::jsonb
        END), 0) AS biomarkers_listed,
    turnaround_days_text, url, url_verified, image_url, is_popular, popularity_rank, scraped_at, updated_at,
    home_kit_available, clinic_visit_available, location_options, lab_ukas_accredited, lab_cqc_regulated, lab_iso15189,
    CASE WHEN has_fee_rule THEN rule_fee_note ELSE NULL::text END AS collection_fee_note,
    COALESCE(last_validated_at, scraped_at) AS price_checked_at
   FROM c;

COMMENT ON VIEW public.unified_provider_tests IS
  'One row per active provider test. Collection fees come from provider_collection_fee_rules when a rule matches, otherwise from the row or its mapping. price_checked_at is when the 6-hourly sync last confirmed the row on the provider site.';

-- Rollback:
-- Recreate the view from 20261016114310_unified_provider_tests_one_row_per_test.sql
-- (CREATE OR REPLACE cannot drop the two appended columns; drop dependents first),
-- then: DROP TABLE IF EXISTS public.provider_collection_fee_rules;
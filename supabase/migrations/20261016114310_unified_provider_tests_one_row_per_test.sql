-- Root cause: provider_test_mapping holds several rows per (provider_id, provider_test_id)
-- (one per tests_master id created by earlier promote-provider-tests runs). The old LEFT JOIN
-- fanned each active provider test out into up to 16 rows, so the view returned 874 rows for
-- 747 active tests and repeated each biomarkers_list payload.
-- Fix: join exactly one mapping row per test, chosen deterministically.
-- All statements are idempotent.

CREATE INDEX IF NOT EXISTS idx_provider_test_mapping_provider_test
  ON public.provider_test_mapping (provider_id, provider_test_id);

-- Identical to provider_test_biomarkers_biomarker_id_idx (advisor: duplicate_index).
DROP INDEX IF EXISTS public.idx_ptb_biomarker_id;

CREATE OR REPLACE VIEW public.unified_provider_tests
WITH (security_invoker = on) AS
WITH j AS (
  SELECT pt.id,
    pt.provider_id,
    pt.test_name,
    pt.description,
    pt.price,
    pt.category,
    pt.url,
    pt.image_url,
    pt.provider_test_id,
    pt.is_active,
    pt.scraped_at,
    pt.created_at,
    pt.updated_at,
    pt.gp_consultation_included,
    pt.gp_consultation_cost,
    pt.phlebotomy_included,
    pt.phlebotomy_cost,
    pt.home_kit_available,
    pt.clinic_visit_available,
    pt.location_options,
    pt.lab_ukas_accredited,
    pt.lab_cqc_regulated,
    pt.lab_iso15189,
    pt.sample_type,
    pt.biomarker_count,
    pt.biomarkers_list,
    pt.is_addon,
    pt.original_price,
    pt.discount_percentage,
    pt.symptoms,
    pt.who_should_test,
    pt.conditions,
    pt.url_verified,
    pt.url_verified_at,
    pt.is_popular,
    pt.popularity_rank,
    pt.turnaround_days_text,
    pt.base_price,
    pt.collection_options,
    pt.source_section,
    pt.source_section_label,
    pt.canonical_category,
    pt.collection_method,
    pt.collection_fee_type,
    pt.collection_fee_amount,
    pt.clinical_review_type,
    pt.clinical_review_fee,
    m.sample_type AS m_sample_type,
    m.collection_method AS m_collection_method,
    m.collection_fee_type AS m_collection_fee_type,
    m.collection_fee_amount AS m_collection_fee_amount,
    m.clinical_review_type AS m_clinical_review_type,
    m.clinical_review_fee AS m_clinical_review_fee
  FROM provider_tests pt
  LEFT JOIN LATERAL (
    SELECT m2.sample_type,
      m2.collection_method,
      m2.collection_fee_type,
      m2.collection_fee_amount,
      m2.clinical_review_type,
      m2.clinical_review_fee
    FROM provider_test_mapping m2
    WHERE m2.provider_id = pt.provider_id
      AND m2.provider_test_id = pt.provider_test_id
    ORDER BY
      (m2.provider_test_uuid = pt.id) DESC NULLS LAST,
      (m2.sample_type IS NOT NULL
        OR m2.collection_method IS NOT NULL
        OR m2.collection_fee_type IS NOT NULL
        OR m2.clinical_review_type IS NOT NULL) DESC,
      m2.updated_at DESC NULLS LAST,
      m2.id
    LIMIT 1
  ) m ON true
  WHERE pt.is_active = true
)
SELECT id,
  provider_id,
  CASE provider_id
    WHEN 'randox' THEN 'Randox Health'
    WHEN 'medichecks' THEN 'Medichecks'
    WHEN 'thriva' THEN 'Thriva'
    WHEN 'lola-health' THEN 'Lola Health'
    WHEN 'goodbody-clinic' THEN 'Goodbody Clinic'
    WHEN 'london-medical-laboratory' THEN 'London Medical Laboratory'
    WHEN 'london-health-company' THEN 'London Health Company'
    WHEN 'medical-diagnosis' THEN 'Medical Diagnosis'
    WHEN 'clinilabs' THEN 'Clinilabs'
    ELSE initcap(replace(provider_id, '-', ' '))
  END AS provider_name,
  test_name,
  description,
  price,
  original_price,
  discount_percentage,
  is_addon,
  CASE lower(COALESCE(canonical_category, ''))
    WHEN 'gut' THEN 'gut-health'
    WHEN 'vitamins-minerals' THEN 'vitamins'
    WHEN '' THEN NULL
    ELSE lower(canonical_category)
  END AS category_primary,
  CASE lower(COALESCE(canonical_category, ''))
    WHEN 'general-health' THEN 'General Health'
    WHEN 'heart' THEN 'Cardiovascular'
    WHEN 'diabetes' THEN 'Metabolic & Diabetes'
    WHEN 'thyroid' THEN 'Thyroid'
    WHEN 'vitamins' THEN 'Nutrition & Vitamins'
    WHEN 'vitamins-minerals' THEN 'Nutrition & Vitamins'
    WHEN 'liver-health' THEN 'Liver Health'
    WHEN 'kidney-health' THEN 'Kidney Health'
    WHEN 'mens-health' THEN 'Men''s Health'
    WHEN 'womens-health' THEN 'Women''s Health'
    WHEN 'sports-performance' THEN 'Sports & Performance'
    WHEN 'inflammation' THEN 'Inflammation'
    WHEN 'wellness' THEN 'Wellness'
    WHEN 'blood-health' THEN 'Blood Health'
    WHEN 'cancer-screening' THEN 'Cancer & Tumour Markers'
    WHEN 'fertility' THEN 'Fertility & Reproductive'
    WHEN 'general-wellness' THEN 'General Wellness'
    WHEN 'sexual-health' THEN 'Sexual Health'
    WHEN 'gut-health' THEN 'Gut Health'
    WHEN 'gut' THEN 'Gut Health'
    WHEN 'allergy' THEN 'Allergy & Immunology'
    WHEN 'genetic-testing' THEN 'Genetic Testing'
    WHEN 'hormones' THEN 'Hormones & Endocrine'
    ELSE 'Other'
  END AS body_system,
  COALESCE(m_sample_type,
    CASE
      WHEN sample_type IS NULL THEN NULL
      WHEN lower(sample_type) LIKE '%finger%' AND (lower(sample_type) LIKE '%venous%' OR lower(sample_type) LIKE '%blood%') THEN 'multiple'
      WHEN lower(sample_type) LIKE '%finger%' THEN 'finger_prick'
      WHEN lower(sample_type) LIKE '%venous%' THEN 'venous'
      WHEN lower(sample_type) LIKE '%blood%' THEN 'venous'
      WHEN lower(sample_type) LIKE '%saliva%' THEN 'saliva'
      WHEN lower(sample_type) LIKE '%stool%' THEN 'stool'
      WHEN lower(sample_type) LIKE '%urine%' THEN 'urine'
      WHEN lower(sample_type) LIKE '%swab%' THEN 'buccal_swab'
      ELSE 'multiple'
    END) AS sample_type,
  sample_type AS sample_type_raw,
  COALESCE(collection_method, m_collection_method) AS collection_method,
  COALESCE(collection_fee_type, m_collection_fee_type) AS collection_fee_type,
  COALESCE(collection_fee_amount, m_collection_fee_amount) AS collection_fee_amount,
  COALESCE(clinical_review_type, m_clinical_review_type) AS clinical_review_type,
  COALESCE(clinical_review_fee, m_clinical_review_fee) AS clinical_review_fee,
  COALESCE(price, 0::numeric) +
    CASE
      WHEN COALESCE(collection_fee_type, m_collection_fee_type) = ANY (ARRAY['fixed', 'from']) THEN COALESCE(COALESCE(collection_fee_amount, m_collection_fee_amount), 0::numeric)
      ELSE 0::numeric
    END +
    CASE
      WHEN COALESCE(clinical_review_type, m_clinical_review_type) IS NOT NULL
        AND (COALESCE(clinical_review_type, m_clinical_review_type) <> ALL (ARRAY['optional', 'not_included', 'not_available']))
      THEN COALESCE(COALESCE(clinical_review_fee, m_clinical_review_fee), 0::numeric)
      ELSE 0::numeric
    END AS total_expected_cost,
  biomarker_count,
  biomarkers_list,
  COALESCE(jsonb_array_length(
    CASE
      WHEN jsonb_typeof(biomarkers_list) = 'array' THEN biomarkers_list
      ELSE '[]'::jsonb
    END), 0) AS biomarkers_listed,
  turnaround_days_text,
  url,
  url_verified,
  image_url,
  is_popular,
  popularity_rank,
  scraped_at,
  updated_at,
  home_kit_available,
  clinic_visit_available,
  location_options,
  lab_ukas_accredited,
  lab_cqc_regulated,
  lab_iso15189
FROM j;

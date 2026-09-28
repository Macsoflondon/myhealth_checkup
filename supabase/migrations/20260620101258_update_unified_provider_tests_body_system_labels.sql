-- Restored verbatim from supabase_migrations.schema_migrations (version 20260620101258, name update_unified_provider_tests_body_system_labels).
-- md5 of the recorded statements: 199f36942d7cd2c324e07bcb840df9cf
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


CREATE OR REPLACE VIEW unified_provider_tests AS
WITH j AS (
  SELECT
    pt.id, pt.provider_id, pt.test_name, pt.description, pt.price, pt.category,
    pt.url, pt.image_url, pt.provider_test_id, pt.is_active, pt.scraped_at,
    pt.created_at, pt.updated_at, pt.gp_consultation_included, pt.gp_consultation_cost,
    pt.phlebotomy_included, pt.phlebotomy_cost, pt.home_kit_available,
    pt.clinic_visit_available, pt.sample_type, pt.biomarker_count, pt.biomarkers_list,
    pt.is_addon, pt.original_price, pt.discount_percentage, pt.symptoms,
    pt.who_should_test, pt.conditions, pt.url_verified, pt.url_verified_at,
    pt.is_popular, pt.popularity_rank, pt.turnaround_days_text, pt.base_price,
    pt.collection_options, pt.source_section, pt.source_section_label,
    pt.canonical_category, pt.collection_method, pt.collection_fee_type,
    pt.collection_fee_amount, pt.clinical_review_type, pt.clinical_review_fee,
    m.sample_type       AS m_sample_type,
    m.collection_method AS m_collection_method,
    m.collection_fee_type   AS m_collection_fee_type,
    m.collection_fee_amount AS m_collection_fee_amount,
    m.clinical_review_type  AS m_clinical_review_type,
    m.clinical_review_fee   AS m_clinical_review_fee
  FROM provider_tests pt
  LEFT JOIN provider_test_mapping m
    ON m.provider_id = pt.provider_id AND m.provider_test_id = pt.provider_test_id
  WHERE pt.is_active = true
)
SELECT
  id,
  provider_id,

  -- Human-readable provider name
  CASE provider_id
    WHEN 'randox'                    THEN 'Randox Health'
    WHEN 'medichecks'                THEN 'Medichecks'
    WHEN 'thriva'                    THEN 'Thriva'
    WHEN 'lola-health'               THEN 'Lola Health'
    WHEN 'goodbody-clinic'           THEN 'Goodbody Clinic'
    WHEN 'london-medical-laboratory' THEN 'London Medical Laboratory'
    WHEN 'london-health-company'     THEN 'London Health Company'
    WHEN 'medical-diagnosis'         THEN 'Medical Diagnosis'
    WHEN 'clinilabs'                 THEN 'Clinilabs'
    ELSE initcap(replace(provider_id, '-', ' '))
  END AS provider_name,

  test_name, description, price, original_price, discount_percentage, is_addon,

  -- Canonical category slug
  CASE lower(COALESCE(canonical_category, ''))
    WHEN 'gut'             THEN 'gut-health'
    WHEN 'vitamins-minerals' THEN 'vitamins'
    WHEN ''                THEN NULL
    ELSE lower(canonical_category)
  END AS category_primary,

  -- Human-readable body system label (all categories covered)
  CASE lower(COALESCE(canonical_category, ''))
    WHEN 'general-health'     THEN 'General Health'
    WHEN 'heart'              THEN 'Cardiovascular'
    WHEN 'diabetes'           THEN 'Metabolic & Diabetes'
    WHEN 'thyroid'            THEN 'Thyroid'
    WHEN 'vitamins'           THEN 'Nutrition & Vitamins'
    WHEN 'vitamins-minerals'  THEN 'Nutrition & Vitamins'
    WHEN 'liver-health'       THEN 'Liver Health'
    WHEN 'kidney-health'      THEN 'Kidney Health'
    WHEN 'mens-health'        THEN 'Men''s Health'
    WHEN 'womens-health'      THEN 'Women''s Health'
    WHEN 'sports-performance' THEN 'Sports & Performance'
    WHEN 'inflammation'       THEN 'Inflammation'
    WHEN 'wellness'           THEN 'Wellness'
    WHEN 'blood-health'       THEN 'Blood Health'
    WHEN 'cancer-screening'   THEN 'Cancer & Tumour Markers'
    WHEN 'fertility'          THEN 'Fertility & Reproductive'
    WHEN 'general-wellness'   THEN 'General Wellness'
    WHEN 'sexual-health'      THEN 'Sexual Health'
    WHEN 'gut-health'         THEN 'Gut Health'
    WHEN 'gut'                THEN 'Gut Health'
    WHEN 'allergy'            THEN 'Allergy & Immunology'
    WHEN 'genetic-testing'    THEN 'Genetic Testing'
    WHEN 'hormones'           THEN 'Hormones & Endocrine'
    ELSE 'Other'
  END AS body_system,

  -- Sample type normalisation
  COALESCE(m_sample_type,
    CASE
      WHEN sample_type IS NULL THEN NULL
      WHEN lower(sample_type) LIKE '%finger%' AND (lower(sample_type) LIKE '%venous%' OR lower(sample_type) LIKE '%blood%') THEN 'multiple'
      WHEN lower(sample_type) LIKE '%finger%'  THEN 'finger_prick'
      WHEN lower(sample_type) LIKE '%venous%'  THEN 'venous'
      WHEN lower(sample_type) LIKE '%blood%'   THEN 'venous'
      WHEN lower(sample_type) LIKE '%saliva%'  THEN 'saliva'
      WHEN lower(sample_type) LIKE '%stool%'   THEN 'stool'
      WHEN lower(sample_type) LIKE '%urine%'   THEN 'urine'
      WHEN lower(sample_type) LIKE '%swab%'    THEN 'buccal_swab'
      ELSE 'multiple'
    END
  ) AS sample_type,

  sample_type AS sample_type_raw,
  COALESCE(collection_method,   m_collection_method)   AS collection_method,
  COALESCE(collection_fee_type, m_collection_fee_type) AS collection_fee_type,
  COALESCE(collection_fee_amount, m_collection_fee_amount) AS collection_fee_amount,
  COALESCE(clinical_review_type, m_clinical_review_type)   AS clinical_review_type,
  COALESCE(clinical_review_fee,  m_clinical_review_fee)    AS clinical_review_fee,

  -- Total cost including collection and clinical review where fixed
  (
    COALESCE(price, 0) +
    CASE
      WHEN COALESCE(collection_fee_type, m_collection_fee_type) = ANY(ARRAY['fixed','from'])
        THEN COALESCE(COALESCE(collection_fee_amount, m_collection_fee_amount), 0)
      ELSE 0
    END +
    CASE
      WHEN COALESCE(clinical_review_type, m_clinical_review_type) IS NOT NULL
       AND COALESCE(clinical_review_type, m_clinical_review_type) <> ALL(ARRAY['optional','not_included','not_available'])
        THEN COALESCE(COALESCE(clinical_review_fee, m_clinical_review_fee), 0)
      ELSE 0
    END
  ) AS total_expected_cost,

  biomarker_count,
  biomarkers_list,
  COALESCE(jsonb_array_length(
    CASE WHEN jsonb_typeof(biomarkers_list) = 'array' THEN biomarkers_list ELSE '[]' END
  ), 0) AS biomarkers_listed,

  turnaround_days_text, url, url_verified, image_url,
  is_popular, popularity_rank, scraped_at, updated_at

FROM j;

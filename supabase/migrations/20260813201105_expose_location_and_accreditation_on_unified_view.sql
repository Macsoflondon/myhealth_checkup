-- Retry: CREATE OR REPLACE VIEW requires new columns appended at the very end
-- of the column list, not inserted before existing trailing columns.
CREATE OR REPLACE VIEW unified_provider_tests AS
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
   FROM (provider_tests pt
     LEFT JOIN provider_test_mapping m ON (((m.provider_id = pt.provider_id) AND (m.provider_test_id = pt.provider_test_id))))
  WHERE (pt.is_active = true)
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
  test_name,
  description,
  price,
  original_price,
  discount_percentage,
  is_addon,
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
  COALESCE(m_sample_type,
    CASE
      WHEN (sample_type IS NULL) THEN NULL::text
      WHEN ((lower(sample_type) ~~ '%finger%'::text) AND ((lower(sample_type) ~~ '%venous%'::text) OR (lower(sample_type) ~~ '%blood%'::text))) THEN 'multiple'::text
      WHEN (lower(sample_type) ~~ '%finger%'::text) THEN 'finger_prick'::text
      WHEN (lower(sample_type) ~~ '%venous%'::text) THEN 'venous'::text
      WHEN (lower(sample_type) ~~ '%blood%'::text) THEN 'venous'::text
      WHEN (lower(sample_type) ~~ '%saliva%'::text) THEN 'saliva'::text
      WHEN (lower(sample_type) ~~ '%stool%'::text) THEN 'stool'::text
      WHEN (lower(sample_type) ~~ '%urine%'::text) THEN 'urine'::text
      WHEN (lower(sample_type) ~~ '%swab%'::text) THEN 'buccal_swab'::text
      ELSE 'multiple'::text
    END) AS sample_type,
  sample_type AS sample_type_raw,
  COALESCE(collection_method, m_collection_method) AS collection_method,
  COALESCE(collection_fee_type, m_collection_fee_type) AS collection_fee_type,
  COALESCE(collection_fee_amount, m_collection_fee_amount) AS collection_fee_amount,
  COALESCE(clinical_review_type, m_clinical_review_type) AS clinical_review_type,
  COALESCE(clinical_review_fee, m_clinical_review_fee) AS clinical_review_fee,
  ((COALESCE(price, (0)::numeric) +
    CASE
      WHEN (COALESCE(collection_fee_type, m_collection_fee_type) = ANY (ARRAY['fixed'::text, 'from'::text])) THEN COALESCE(COALESCE(collection_fee_amount, m_collection_fee_amount), (0)::numeric)
      ELSE (0)::numeric
    END) +
    CASE
      WHEN ((COALESCE(clinical_review_type, m_clinical_review_type) IS NOT NULL) AND (COALESCE(clinical_review_type, m_clinical_review_type) <> ALL (ARRAY['optional'::text, 'not_included'::text, 'not_available'::text]))) THEN COALESCE(COALESCE(clinical_review_fee, m_clinical_review_fee), (0)::numeric)
      ELSE (0)::numeric
    END) AS total_expected_cost,
  biomarker_count,
  biomarkers_list,
  COALESCE(jsonb_array_length(
    CASE
      WHEN (jsonb_typeof(biomarkers_list) = 'array'::text) THEN biomarkers_list
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

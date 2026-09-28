-- Restored verbatim from supabase_migrations.schema_migrations (version 20260619002749, name create_unified_provider_tests_view).
-- md5 of the recorded statements: 5a1f932bff89c3ab92aa52c679e0b7ff
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- Unified, normalized, active-only view over provider_tests.
-- Non-destructive: leaves source rows untouched. Provides a single clean
-- source for both the live app and the diagnostic comparison scaffold.
create or replace view public.unified_provider_tests as
select
  pt.id,
  pt.provider_id,
  -- canonical provider display name
  case pt.provider_id
    when 'randox' then 'Randox Health'
    when 'medichecks' then 'Medichecks'
    when 'thriva' then 'Thriva'
    when 'lola-health' then 'Lola Health'
    when 'goodbody-clinic' then 'Goodbody Clinic'
    when 'london-medical-laboratory' then 'London Medical Laboratory'
    when 'london-health-company' then 'London Health Company'
    when 'medical-diagnosis' then 'Medical Diagnosis'
    when 'clinilabs' then 'Clinilabs'
    else initcap(replace(pt.provider_id,'-',' '))
  end as provider_name,
  pt.test_name,
  pt.description,
  pt.price,
  pt.original_price,
  pt.discount_percentage,
  pt.is_addon,
  -- PRIMARY lens: canonical_category with duplicates merged
  case lower(coalesce(pt.canonical_category,''))
    when 'gut' then 'gut-health'
    when 'vitamins-minerals' then 'vitamins'
    when '' then null
    else lower(pt.canonical_category)
  end as category_primary,
  -- SECONDARY lens: body-system grouping
  case lower(coalesce(pt.canonical_category,''))
    when 'heart' then 'Cardiovascular'
    when 'diabetes' then 'Metabolic & Diabetes'
    when 'general-health' then 'General Health'
    when 'mens-health' then 'Men''s Health'
    when 'womens-health' then 'Women''s Health'
    when 'vitamins' then 'Nutrition & Vitamins'
    when 'vitamins-minerals' then 'Nutrition & Vitamins'
    when 'hormones' then 'Hormones & Endocrine'
    when 'thyroid' then 'Thyroid'
    when 'sexual-health' then 'Sexual Health'
    when 'cancer-screening' then 'Cancer & Tumour Markers'
    when 'fertility' then 'Fertility & Reproductive'
    when 'sports-performance' then 'Sports & Performance'
    when 'gut-health' then 'Gut Health'
    when 'gut' then 'Gut Health'
    when 'allergy' then 'Allergy & Immunology'
    when 'genetic-testing' then 'Genetic'
    else 'Other'
  end as body_system,
  pt.sample_type as sample_type_raw,
  -- normalized sample-type bucket
  case
    when pt.sample_type is null then null
    when lower(pt.sample_type) like '%finger%' and (lower(pt.sample_type) like '%venous%' or lower(pt.sample_type) like '%blood%') then 'Finger-prick or venous'
    when lower(pt.sample_type) like '%finger%' then 'Finger-prick'
    when lower(pt.sample_type) like '%venous%' or lower(pt.sample_type) like '%blood%' then 'Venous blood'
    when lower(pt.sample_type) like '%stool%' then 'Stool'
    when lower(pt.sample_type) like '%urine%' or lower(pt.sample_type) like '%swab%' then 'Urine / Swab'
    else pt.sample_type
  end as sample_type,
  pt.collection_method,
  pt.collection_fee_type,
  pt.collection_fee_amount,
  pt.clinical_review_type,
  pt.clinical_review_fee,
  pt.gp_consultation_included,
  pt.phlebotomy_included,
  pt.home_kit_available,
  pt.clinic_visit_available,
  pt.biomarker_count,
  pt.biomarkers_list,
  coalesce(jsonb_array_length(case when jsonb_typeof(pt.biomarkers_list)='array' then pt.biomarkers_list else '[]'::jsonb end),0) as biomarkers_listed,
  pt.turnaround_days_text,
  pt.url,
  pt.url_verified,
  pt.image_url,
  pt.is_popular,
  pt.popularity_rank,
  pt.scraped_at,
  pt.updated_at
from public.provider_tests pt
where pt.is_active = true;

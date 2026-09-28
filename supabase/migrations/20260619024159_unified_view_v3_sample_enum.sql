-- Restored from supabase_migrations.schema_migrations (version 20260619024159, name unified_view_v3_sample_enum).
-- md5 of the recorded statements: f8e5f651154a5723b2399cac0c6cc304
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.
--
-- Replay adaptation: the recorded body begins with a bare CREATE VIEW, but the view
-- existed from the previous migration, so production must have dropped it first
-- without recording that step (the v2 migration just before records the same
-- drop). The DROP VIEW IF EXISTS line restores it. End state is identical.

drop view if exists public.unified_provider_tests;
create view public.unified_provider_tests as
with j as (
  select
    pt.*,
    m.sample_type           as m_sample_type,
    m.collection_method     as m_collection_method,
    m.collection_fee_type   as m_collection_fee_type,
    m.collection_fee_amount as m_collection_fee_amount,
    m.clinical_review_type  as m_clinical_review_type,
    m.clinical_review_fee   as m_clinical_review_fee
  from public.provider_tests pt
  left join public.provider_test_mapping m
    on m.provider_id = pt.provider_id
   and m.provider_test_id = pt.provider_test_id
  where pt.is_active = true
)
select
  j.id,
  j.provider_id,
  case j.provider_id
    when 'randox' then 'Randox Health'
    when 'medichecks' then 'Medichecks'
    when 'thriva' then 'Thriva'
    when 'lola-health' then 'Lola Health'
    when 'goodbody-clinic' then 'Goodbody Clinic'
    when 'london-medical-laboratory' then 'London Medical Laboratory'
    when 'london-health-company' then 'London Health Company'
    when 'medical-diagnosis' then 'Medical Diagnosis'
    when 'clinilabs' then 'Clinilabs'
    else initcap(replace(j.provider_id,'-',' '))
  end as provider_name,
  j.test_name,
  j.description,
  j.price,
  j.original_price,
  j.discount_percentage,
  j.is_addon,
  case lower(coalesce(j.canonical_category,''))
    when 'gut' then 'gut-health'
    when 'vitamins-minerals' then 'vitamins'
    when '' then null
    else lower(j.canonical_category)
  end as category_primary,
  case lower(coalesce(j.canonical_category,''))
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
  coalesce(
    j.m_sample_type,
    case
      when j.sample_type is null then null
      when lower(j.sample_type) like '%finger%' and (lower(j.sample_type) like '%venous%' or lower(j.sample_type) like '%blood%') then 'multiple'
      when lower(j.sample_type) like '%finger%' then 'finger_prick'
      when lower(j.sample_type) like '%venous%' or lower(j.sample_type) like '%blood%' then 'venous'
      when lower(j.sample_type) like '%saliva%' then 'saliva'
      when lower(j.sample_type) like '%stool%' then 'stool'
      when lower(j.sample_type) like '%urine%' then 'urine'
      when lower(j.sample_type) like '%swab%' then 'buccal_swab'
      else 'multiple'
    end
  ) as sample_type,
  j.sample_type as sample_type_raw,
  coalesce(j.collection_method,     j.m_collection_method)     as collection_method,
  coalesce(j.collection_fee_type,   j.m_collection_fee_type)   as collection_fee_type,
  coalesce(j.collection_fee_amount, j.m_collection_fee_amount) as collection_fee_amount,
  coalesce(j.clinical_review_type,  j.m_clinical_review_type)  as clinical_review_type,
  coalesce(j.clinical_review_fee,   j.m_clinical_review_fee)   as clinical_review_fee,
  (
    coalesce(j.price,0)
    + case
        when coalesce(j.collection_fee_type, j.m_collection_fee_type) in ('fixed','from')
        then coalesce(coalesce(j.collection_fee_amount, j.m_collection_fee_amount),0)
        else 0
      end
    + case
        when coalesce(j.clinical_review_type, j.m_clinical_review_type) is not null
         and coalesce(j.clinical_review_type, j.m_clinical_review_type) not in ('optional','not_included','not_available')
        then coalesce(coalesce(j.clinical_review_fee, j.m_clinical_review_fee),0)
        else 0
      end
  ) as total_expected_cost,
  j.biomarker_count,
  j.biomarkers_list,
  coalesce(jsonb_array_length(case when jsonb_typeof(j.biomarkers_list)='array' then j.biomarkers_list else '[]'::jsonb end),0) as biomarkers_listed,
  j.turnaround_days_text,
  j.url,
  j.url_verified,
  j.image_url,
  j.is_popular,
  j.popularity_rank,
  j.scraped_at,
  j.updated_at
from j;

grant select on public.unified_provider_tests to anon, authenticated;

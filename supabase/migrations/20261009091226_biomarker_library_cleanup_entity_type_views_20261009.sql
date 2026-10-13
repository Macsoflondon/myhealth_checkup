-- Restored from supabase_migrations.schema_migrations (version 20261009091226, name biomarker_library_cleanup_entity_type_views_20261009).
-- md5 of the recorded statements: 46d67d301418596b9bd7ee5c9b9124bb
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.
--
-- Replay adaptation (2026-10-11): the recorded check raised an exception when any
-- duplicate or canonical name had no biomarker_hub row. Those rows exist only in the
-- hub data production loaded outside migrations, so a fresh database stopped here
-- and lost the entity_type column and its check constraint, the
-- provider_test_biomarkers (biomarker_id) index, and both views
-- (biomarker_library_public, biomarker_data_quality). The check now reports
-- missing names with a notice; the schema changes apply and the data fixes match
-- only the rows that exist. Production ran the original check, which passed.

alter table public.biomarker_hub add column if not exists entity_type text not null default 'biomarker';
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'biomarker_hub_entity_type_check') then
    alter table public.biomarker_hub add constraint biomarker_hub_entity_type_check check (entity_type in ('biomarker','panel'));
  end if;
end $$;
create index if not exists provider_test_biomarkers_biomarker_id_idx on public.provider_test_biomarkers (biomarker_id);

-- 1. Groupings, coverage lists and scrape junk are panels, not measurable biomarkers
update public.biomarker_hub set entity_type = 'panel', last_updated = now()
 where status = 'active' and name in (
 'Bone health','Cholesterol profile','Liver Function','Kidney Function','Liver Health','Diabetes Health','Heart Health','Iron Status','Iron studies','Kidney health','Metabolic Syndrome','Muscle & Joint Health','Nutritional Health','Premium Report','Thyroid function','Muscle health','Beneficial Bacteria Profile','Colour','Digestive Health','Iron levels','Lipid Profile','Pancreatic Health','Pathogenic Bacteria Screen','Personal Health Measurements','Protein','Adrenal Cancer','Biliary Tract Cancer','Breast Cancers','Central Nervous System Cancer','Gastrointestinal Cancers','Gynaecological Cancers','Head and Neck Cancers','Liver Cancer','Salivary Gland Cancer','Skin Cancers','Soft Tissue Cancers','Thymus Cancers','Thyroid Cancer','Osteosarcomas','Down Syndrome','Edwards Syndrome','Jacobs Syndrome','Klinefelter syndrome','Patau Syndrome','Turner Syndrome','Cholesterol percentages','Cholesterol ratios','Cholesterol levels','Diabetes','Electrolytes','Heart & Muscle Enzymes','Inflammation','Female Hormone Profile','Male Hormone Profile','Kidney function profile','Liver function profile','Organisms','Renal Panel','Thyroid health','Thyroid profile','Prostate Health','Advanced iron profile','Advanced Lipid Profile','Advanced Thyroid Profile (with antibodies)','Athletic Performance','Bone density','Food intolerance','Health & Wellbeing','Liver Biochemistry Profile','Muscle recovery','results via TruDiagnostic','Standard Lipid Profile (Cholesterol and Triglycerides)','Standard Thyroid Profile','Structural proteins','Total','Sex Hormone Panel (Combined)','Plasma Amino Acid Profile','Infection & Inflammation','Apolipoproteins');

-- 2. Exact and truncated duplicates merge into one canonical entry (non-destructive)
create temp table _dup(dupe text, canon text) on commit drop;
insert into _dup values
('Anti - M√ºllerian hormone','Anti-Müllerian Hormone'),('Anti-M√ºllerian Hormone','Anti-Müllerian Hormone'),
('Bilirubin (Direct)','Bilirubin Direct'),('DHEAS','DHEA-S'),
('Hepatitis A antibodies (IgG and IgM)','Hepatitis A antibodies IgG and IgM'),('hsCRP','hs-CRP'),
('Vitamin E (Alpha-Tocopherol)','Vitamin E alpha-tocopherol'),
('3-month glucose (HbA1c)','HbA1c'),('Glycated Haemoglobin (HbA1c)','HbA1c'),('Haemoglobin A1c (HBA1c)','HbA1c'),('Diabetes (HbA1c)','HbA1c'),
('HDL (High-Density Lipoprotein)','HDL Cholesterol'),('HDL %','HDL Cholesterol Percentage'),
('LDL (Low-Density Lipoprotein)','LDL Cholesterol'),('Low Density Lipoprotein (LDL)','LDL Cholesterol'),
('Luteinizing hormone (LH)','Luteinising Hormone'),
('UIBC','Unsaturated Iron Binding Capacity (UIBC)'),('Unsaturated Iron Binding Concentration','Unsaturated Iron Binding Capacity (UIBC)'),
('Calcium (adjusted)','Adjusted Calcium'),('Corrected calcium','Adjusted Calcium'),
('Bone-Specific ALP','Bone-Specific Alkaline Phosphatase'),('CTX','C-Terminal Telopeptide of Collagen (CTx)'),
('Total Iron Binding Concentration','TIBC (Total Iron-Binding Capacity)'),
('CA-125','Cancer Antigen 125'),('Sataphylococcus aureus','Staphylococcus aureus'),
('Syphillis','Syphilis (Treponema Serology)'),
('Globu','Globulin'),('Potas','Potassium'),('Aspartate','AST');
do $$ declare missing text; begin
  select string_agg(x, ', ') into missing from (
    select d.dupe x from _dup d left join public.biomarker_hub h on h.name = d.dupe where h.id is null
    union all select d.canon from _dup d left join public.biomarker_hub h on h.name = d.canon and h.status = 'active' where h.id is null) q;
  if missing is not null then raise notice 'Missing names: %', missing; end if;
end $$;
update public.provider_test_biomarkers b set biomarker_id = c.id
  from _dup d join public.biomarker_hub x on x.name = d.dupe join public.biomarker_hub c on c.name = d.canon
 where b.biomarker_id = x.id;
update public.biomarker_hub x set status = 'duplicate', canonical_id = c.id, last_updated = now()
  from _dup d join public.biomarker_hub c on c.name = d.canon
 where x.name = d.dupe and x.id <> c.id;

-- 3. Categories that landed in the wrong bucket
create temp table _cat(name text, cat text) on commit drop;
insert into _cat values
('24,25-Dihydroxyvitamin D','Vitamins'),('Amylase','Digestive Health'),('Bovine Serum Albumin','Allergy & Immunology'),('Globulin','Liver Function'),
('Glucose - random','Diabetes'),('Glucose 0','Diabetes'),('Glucose 60','Diabetes'),('Glucose 120','Diabetes'),
('HDL Cholesterol Percentage','Cardiac'),('hs-CRP','Inflammation'),('Magnesium - red cell','Minerals'),('Magnesium - serum','Minerals'),('Phosphates Inorganic','Minerals'),
('Methylmalonic acid - serum','Iron & Nutrients'),('NADH','Iron & Nutrients'),('TIBC (Total Iron-Binding Capacity)','Iron & Nutrients'),('Unsaturated Iron Binding Capacity (UIBC)','Iron & Nutrients'),
('Protein Electrophoresis','Cancer Screening'),('ABO type','Haematology'),('Blood Group + Rh','Haematology'),
('Hepatitis B: HB Core Antibodies (HBc Total)','Infectious Disease'),('Hepatitis B: HB Core IgM (HBc IgM)','Infectious Disease'),('Hepatitis B: HB e Antibodies (HBe Ab)','Infectious Disease'),('Hepatitis B: HB e Antigen (HBe Ag)','Infectious Disease'),('Hepatitis B: HB Surface Antigen (HBs Ag)','Infectious Disease'),('p24 Antigen','Infectious Disease'),
('PSA','Cancer Screening'),('Omega-3','Iron & Nutrients'),('Omega-6','Iron & Nutrients'),
('Orange','Allergy & Immunology'),('Papaya','Allergy & Immunology'),('Peach','Allergy & Immunology'),('Octopus','Allergy & Immunology'),('Oak [T-7]','Allergy & Immunology'),('Wall Pellitory','Allergy & Immunology');
update public.biomarker_hub h set category_consumer = c.cat, category = c.cat, last_updated = now()
  from _cat c where h.name = c.name and h.status = 'active';

-- 4. Labels that are scrape-truncated or generic get a scoped link until the source is re-crawled
update public.provider_test_biomarkers b set biomarker_id = h.id, match_method = 'exact_synonym'
  from (values ('medical-diagnosis','Creatine Kinas','Creatine Kinase (CK)'),('medical-diagnosis','Triglycerid','Triglycerides'),('medical-diagnosis','High-Densi','HDL Cholesterol'),
               ('london-medical-laboratory','Uric ac','Uric Acid'),('london-medical-laboratory','Free T','Free Testosterone'),
               ('randox','Tpo','TPO Antibodies'),('randox','Pancrea','Pancreatic Health'),
               ('medichecks','IgA antibodies','Anti-Sperm Antibodies'),('medichecks','IgG antibodies','Anti-Sperm Antibodies')) m(pid, raw, target)
  join public.biomarker_hub h on h.name = m.target, public.provider_tests t
 where t.id = b.provider_test_id and t.provider_id = m.pid and b.raw_label = m.raw and b.biomarker_id is null;
update public.biomarker_hub set synonyms = (select array_agg(distinct s order by s) from unnest(coalesce(synonyms,'{}'::text[]) || array['Cholesterol Risk Factor']) s), last_updated = now() where name = 'CHOL RISK FACTOR';

select public.refresh_provider_test_biomarkers();

-- 5. Public library view: measurable biomarkers only
create or replace view public.biomarker_library_public with (security_invoker = true) as
select h.id,
       trim(both '-' from regexp_replace(lower(h.name), '[^a-z0-9]+', '-', 'g')) as slug,
       h.name as biomarker_name,
       coalesce(h.category_consumer, h.category, 'Other') as category,
       h.abbreviation,
       coalesce(h.legacy_description, h.clinical_description, h.description_what, '') as description,
       coalesce(h.what_it_measures, h.description_what) as what_it_measures,
       coalesce(h.why_it_matters, h.description_why) as why_it_matters,
       h.what_affects_it, h.when_to_retest, h.clinical_significance,
       h.unit as unit_of_measurement, h.normal_range_male, h.normal_range_female, h.reference_ranges,
       h.synonyms, h.biomaterial, h.body_system, h.related_articles, h.last_reviewed_at, h.reviewed_by,
       coalesce(u.test_count, 0) as test_count,
       coalesce(u.provider_count, 0) as provider_count,
       h.last_updated as updated_at
  from public.biomarker_hub h
  left join lateral (
    select count(distinct b.provider_test_id) as test_count, count(distinct t.provider_id) as provider_count
      from public.provider_test_biomarkers b
      join public.provider_tests t on t.id = b.provider_test_id and t.is_active
     where b.biomarker_id = h.id) u on true
 where h.status = 'active' and h.entity_type = 'biomarker';
grant select on public.biomarker_library_public to anon, authenticated;

-- 6. Data quality gate: every active test with a biomarker problem
create or replace view public.biomarker_data_quality with (security_invoker = true) as
select t.id as provider_test_id, t.provider_id, t.test_name, t.url, t.biomarker_count,
       case when jsonb_typeof(t.biomarkers_list) = 'array' then jsonb_array_length(t.biomarkers_list) else 0 end as list_length,
       (select count(*) from public.provider_test_biomarkers b where b.provider_test_id = t.id and b.biomarker_id is null) as unresolved_labels,
       case
         when t.biomarkers_list is null or jsonb_typeof(t.biomarkers_list) <> 'array' or jsonb_array_length(t.biomarkers_list) = 0 then 'no_list'
         when exists (select 1 from jsonb_array_elements_text(t.biomarkers_list) e(l) where e.l ~* '^[0-9]+ biomarkers?$') then 'placeholder_label'
         when t.biomarker_count is distinct from jsonb_array_length(t.biomarkers_list) then 'count_mismatch'
         when exists (select 1 from public.provider_test_biomarkers b where b.provider_test_id = t.id and b.biomarker_id is null) then 'unresolved_labels'
         else 'ok' end as issue
  from public.provider_tests t
 where t.is_active;
grant select on public.biomarker_data_quality to anon, authenticated;

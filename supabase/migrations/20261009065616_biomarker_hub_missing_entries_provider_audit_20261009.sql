-- Restored verbatim from supabase_migrations.schema_migrations (version 20261009065616, name biomarker_hub_missing_entries_provider_audit_20261009).
-- md5 of the recorded statements: 283c5590693580a1a738004369bf95be
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

create temp table _rows(name text, raws text[], consumer text, clinical text, kind text, defn text, scope_provider text, add_syn boolean) on commit drop;

insert into _rows values
('Apolipoprotein A1 : B Ratio', array['Apo A1:B Ratio'], 'Cardiac','cardiology','measure','Ratio of apolipoprotein A1 to apolipoprotein B.',null,true),
('HDL Cholesterol Percentage', array['HDL Cholesterol %','HDL percentage'], 'Cardiac','cardiology','measure','HDL cholesterol reported as a percentage.',null,true),
('eGFR (Cystatin C)', array['eGFRcys'], 'Kidney Function','renal','measure','Estimated glomerular filtration rate calculated from cystatin C.',null,true),
('PSA/Free PSA Ratio', array['PSA/Free PSA (FPSA) Ratio'], 'Cancer Screening','oncology','measure','Ratio of PSA to free PSA.',null,true),
('Anti-Histone Antibodies', array['Histones Antibodies'], 'Autoimmune & Immunology','autoimmune','measure','Antibodies directed against histone proteins.',null,true),
('Norovirus GI', array['Norovirus GI'], 'Infectious Disease','microbiology','measure','Norovirus genogroup I.',null,true),
('Mycoplasma species', array['Mycoplasma species'], 'Infectious Disease','microbiology','measure',null,'medical-diagnosis',false),
('Ureaplasma species', array['Ureaplasma species'], 'Infectious Disease','microbiology','measure',null,'medical-diagnosis',false),
('CD57 Lymphocyte Subset', array['CD57 (lymphocyte subset marker)'], 'Immunology','immunology','measure','CD57 lymphocyte subset marker.',null,true),
('NK Cell Cytotoxicity Assay', array['NK cell cytotoxicity (functional assay)'], 'Immunology','immunology','measure','Functional assay of natural killer cell cytotoxicity.',null,true),
('Demodex spp. Microscopy', array['Demodex spp. (mite presence and density, skin microscopy)'], 'Infectious Disease','microbiology','measure','Skin microscopy for Demodex mite presence and density.',null,true),
('Cervical Smear Cytology (Liquid-Based)', array['Cervical Smear Cytology (PAP – Thin Prep)'], 'Cancer Screening','oncology','measure','Cervical smear cytology using the ThinPrep method.',null,true),
('Genital Swab Culture', array['Culture: Genital Swab Short (Male)','Culture - Genital Swab (Female)','Culture - Genital Swab Short (Female)'], 'Infectious Disease','microbiology','measure','Culture of a genital swab.',null,true),
('Sperm Head Defects', array['Head defects'], 'Fertility','reproductive','measure',null,'medichecks',false),
('Sperm Midpiece Defects', array['Mispiece defects'], 'Fertility','reproductive','measure',null,'medichecks',false),
('Sperm Tail Defects', array['Tail defects'], 'Fertility','reproductive','measure',null,'medichecks',false),
('Sperm Normal Forms', array['Normal forms'], 'Fertility','reproductive','measure',null,'medichecks',false),
('Round Cells (Semen)', array['Round cells'], 'Fertility','reproductive','measure',null,'medichecks',false),
('Sperm Aggregation and Agglutination', array['Aggregation and Agglutination'], 'Fertility','reproductive','measure',null,'medichecks',false),
('Teratozoospermia Index', array['Teratozoospermia Index'], 'Fertility','reproductive','measure',null,'medichecks',false),
('HPV 16 Genotype', array['HPV 16'], 'Reproductive Health','infectious_disease','measure','HPV type 16.','goodbody-clinic',false),
('HPV 18 Genotype', array['HPV 18'], 'Reproductive Health','infectious_disease','measure','HPV type 18.','goodbody-clinic',false),
('Other High-Risk HPV Types', array['22 other high-risk HPV types'], 'Reproductive Health','infectious_disease','measure','The 22 other high-risk HPV types.','goodbody-clinic',false),
('EpiSwitch 3D Genome Profile', array['EpiSwitch 3D genome profile'], 'Cancer Screening','oncology','measure','EpiSwitch 3D genome profile.',null,true),
('EarlyCDT Lung Autoantibody Panel', array['Lung cancer-associated autoantibody panel (EarlyCDT Lung)'], 'Cancer Screening','oncology','measure','Lung cancer-associated autoantibody panel (EarlyCDT Lung).',null,true),
('Herpes Simplex Virus 1 (HSV-1)', array['Herpes Simplex I'], 'Infectious Disease','infectious_disease','measure','Herpes simplex virus type 1.','randox',false);

-- Randox hereditary cancer genes
insert into _rows
select distinct b.raw_label || ' gene', array[b.raw_label], 'Genetics & Pharmacogenomics','genetics','gene','Gene analysed in the Randox hereditary cancer risk panels.','randox',false
from public.provider_test_biomarkers b join public.provider_tests t on t.id = b.provider_test_id
where t.is_active and t.provider_id = 'randox' and b.biomarker_id is null
  and t.test_name in ('Breast & Ovarian Cancer Risk','Bowel Cancer Risk Test')
  and b.raw_label ~ '^[A-Z0-9]{2,8}$';

-- Randox infection panel targets
insert into _rows
select distinct b.raw_label, array[b.raw_label], 'Infectious Disease','microbiology','target',null,'randox',true
from public.provider_test_biomarkers b join public.provider_tests t on t.id = b.provider_test_id
where t.is_active and t.provider_id = 'randox' and b.biomarker_id is null
  and t.test_name in ('UTI Test','Cold, Cough and Flu Test')
  and b.raw_label <> 'Herpes Simplex I';

-- ALEX3 allergen components
insert into _rows
select distinct b.raw_label || ' (specific IgE)', array[b.raw_label], 'Allergy & Immunology','allergy','allergen','Allergen-specific IgE for ' || b.raw_label || '.','clinilabs',true
from public.provider_test_biomarkers b join public.provider_tests t on t.id = b.provider_test_id
where t.is_active and t.provider_id = 'clinilabs' and t.test_name ilike 'ALEX%' and b.biomarker_id is null
  and b.raw_label not in ('Homs Lactoferrin','Cat','Dog','Cultivated rye');

-- Medical Diagnosis coded allergens
insert into _rows
select distinct case when b.raw_label = 'Oak' then 'Oak (specific IgE)' else b.raw_label end, array[b.raw_label], 'Allergy & Immunology','allergy','allergen','Allergen-specific IgE for ' || b.raw_label || '.','medical-diagnosis',true
from public.provider_test_biomarkers b join public.provider_tests t on t.id = b.provider_test_id
where t.is_active and t.provider_id = 'medical-diagnosis' and b.biomarker_id is null
  and b.raw_label in ('D-01 Dermatophagoid','F-78 Casein','F-83 Chicken','F-93 Cacao','FX-10 Flour mix','FX-29 Citrus mix','GX-07 Grass mix','K-202 Cross-reactive carbohydrate determinants','M-03 Aspergillus fumigatus','M-06 Alternaria alternata','T-03 Birch pollen','T-04 Hazel pollen','W-06 Mugwort pollen','Cladosporium Herbarum [M-2]','Latex [K-82]','Oak');

do $$
declare clash text;
begin
  select string_agg(r.name, ', ') into clash
  from _rows r join public.biomarker_hub h on h.name = r.name;
  if clash is not null then raise exception 'Names already in hub: %', clash; end if;
  select string_agg(name, ', ') into clash from (select name from _rows group by name having count(*) > 1) d;
  if clash is not null then raise exception 'Duplicate new names: %', clash; end if;
end $$;

create temp table _use on commit drop as
select r.name,
       (array_agg(distinct (pd.disp || ' ' || t.test_name)))[1:3] as first3,
       count(distinct t.id) as n
from _rows r
join public.provider_test_biomarkers b on b.raw_label = any(r.raws) and b.biomarker_id is null
join public.provider_tests t on t.id = b.provider_test_id and t.is_active and (r.scope_provider is null or t.provider_id = r.scope_provider)
join (values ('medichecks','Medichecks'),('randox','Randox'),('clinilabs','Clinilabs'),('lola-health','Lola Health'),('london-medical-laboratory','London Medical Laboratory'),('goodbody-clinic','Goodbody Clinic'),('medical-diagnosis','Medical Diagnosis'),('london-health-company','London Health Company')) pd(pid, disp) on pd.pid = t.provider_id
group by r.name;

insert into public.biomarker_hub (name, category, category_clinical, category_consumer, biomaterial, body_system, description_what, what_it_measures, synonyms, status, source_systems, last_updated)
select r.name, r.consumer, r.clinical, r.consumer,
       case when r.kind = 'allergen' then 'Serum' end,
       case when r.kind = 'allergen' then 'Immune system' end,
       d.txt, d.txt,
       case when r.add_syn then r.raws end,
       'active', array['provider_test_audit_2026-10-09'], now()
from _rows r
join lateral (
  select coalesce(r.defn || ' ', '') || 'Listed in ' || array_to_string(u.first3, ', ')
         || case when u.n > 3 then ' and ' || (u.n - 3) || ' other tests' else '' end || '.' as txt
  from _use u where u.name = r.name
) d on true;

-- Link the provider labels to the new entries
update public.provider_test_biomarkers b
   set biomarker_id = h.id, match_method = 'exact_synonym'
  from _rows r
  join public.biomarker_hub h on h.name = r.name,
       public.provider_tests t
 where t.id = b.provider_test_id
   and b.biomarker_id is null
   and b.raw_label = any(r.raws)
   and (r.scope_provider is null or t.provider_id = r.scope_provider);

-- Labels that map to entries already in the hub
update public.provider_test_biomarkers b
   set biomarker_id = h.id, match_method = 'exact_synonym'
  from (values ('clinilabs','Cat','Cat Dander'),('clinilabs','Dog','Dog Dander'),('clinilabs','Cultivated rye','Cultivated Rye Grass'),('medical-diagnosis','Egg','Egg [F-245]')) m(pid, raw, target)
  join public.biomarker_hub h on h.name = m.target,
       public.provider_tests t
 where t.id = b.provider_test_id and t.provider_id = m.pid and b.raw_label = m.raw and b.biomarker_id is null;

select public.refresh_provider_test_biomarkers();

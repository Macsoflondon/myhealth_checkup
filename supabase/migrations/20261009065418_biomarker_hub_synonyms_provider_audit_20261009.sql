-- Restored from supabase_migrations.schema_migrations (version 20261009065418, name biomarker_hub_synonyms_provider_audit_20261009).
-- md5 of the recorded statements: 5746d4ae46cfaa41d0bdcc631508f123
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.
--
-- Replay adaptation (2026-10-11): the recorded check raised an exception when any
-- target name had no biomarker_hub row. Most targets exist only in the hub data
-- production loaded outside migrations, so a fresh database stopped here. The check
-- now reports missing targets with a notice, and the updates below match only the
-- rows that exist. Production ran the original check, which passed.

create temp table _syn(raw text, target text) on commit drop;
insert into _syn values
('Triglyceride','Triglycerides'),
('Cholesterol - Total','Total Cholesterol'),
('High-Density Lipoprotein (HDL) Cholesterol','HDL Cholesterol'),
('HDL (High-Density Lipoprotein) Cholesterol','HDL Cholesterol'),
('Low Density Lipoprotein','LDL Cholesterol'),
('LDL (Low-Density Lipoprotein) Cholesterol','LDL Cholesterol'),
('VLDL (Very Low-Density Lipoprotein)','VLDL Cholesterol'),
('Non-HDL-Cholesterol','Non-HDL Cholesterol'),
('Cholesterol:HDL Ratio','Total Cholesterol : HDL Ratio'),
('Chol:HDL Ratio','Total Cholesterol : HDL Ratio'),
('ApoB : ApoA1 Ratio','ApoB/ApoA1 Ratio'),
('Alanine Transaminase','Alanine Transaminase (ALT)'),
('Gamma Glutamyl Transferase','GGT'),
('Unsaturated Iron-Binding Capacity','Unsaturated Iron Binding Capacity (UIBC)'),
('Urine Creatinine','Urine Creatinine (Spot)'),
('Urine: Creatinine','Urine Creatinine (Spot)'),
('Urine Microalbumin','Microalbumin - urine'),
('Urine: Microalbumin','Microalbumin - urine'),
('ACR Ratio','Urine Albumin:Creatinine Ratio'),
('NT Pro BNP','NT-proBNP'),
('HOMA-IR Index','HOMA-IR (Insulin Resistance Score)'),
('Mean Cell Haemoglobin Concentration','MCHC (Mean Corpuscular Haemoglobin Concentration)'),
('Mean Cell Hb (Mean Corpuscular Hemoglobin)','Mean Corpuscular Haemoglobin'),
('Haemoglobin A1c','HbA1c'),
('Luteinizing Hormone','Luteinising Hormone'),
('Anti Mullerian Hormone','Anti-Müllerian Hormone'),
('Anti - Müllerian hormone','Anti-Müllerian Hormone'),
('Bioavailable testosterone','Bioavailable Testosterone (Calculated)'),
('Progesterone level','Progesterone'),
('Lipoprotein (a) level','Lipoprotein(a)'),
('CA125','Cancer Antigen 125'),
('OV monitor (CA 125)','Cancer Antigen 125'),
('GI monitor (CA 199)','Cancer Antigen 19-9'),
('HIV 1&2 Duo with p24 Antigen','HIV 1 & 2 Antibody/Antigen'),
('Syphilis TP Latex','Syphilis (Treponema Serology)'),
('Hepatitis B Core Antibodies (Anti-HBC)','Hepatitis B Core Antibody (Total)'),
('Hepatitis B: HB Surface Antibodies (HBs Ab; Immunity)','Hepatitis B Surface Antibody (HBsAb)'),
('Varicella Zoster Antibodies IgG','Varicella zoster IgG'),
('Tetanus Antitoxin','Tetanus antitoxin antibodies'),
('Tuberculosis TB Quantiferon','QuantiFERON-TB Gold Plus (IGRA)'),
('TB1 IGRA Result','QuantiFERON-TB Gold Plus (IGRA)'),
('TB2 IGRA Result','QuantiFERON-TB Gold Plus (IGRA)'),
('Shigella spp./EIEC (Sh/EI)','Shigella spp./ EIEC'),
('Gardnerella vaginalis PCR','Gardnerella vaginalis'),
('Escherichia coli O157 (E. coli O157) STEC (stx1/2)','E. coli 0157'),
('T transglutaminase IgA','Tissue transglutaminase IgA'),
('Rheumatoid Factor Turbidimetry','Rheumatoid Factor'),
('Hereditary Haemochromatosis','HFE Gene (Haemochromatosis Mutation)'),
('Extractable nuclear antigen','ENA Panel (Extractable Nuclear Antigens)'),
('Centromere Antibodies','Anti-Centromere Antibody (ACA / CENP-B)'),
('Jo-1 Antibodies','Anti-Jo-1 Antibody (Anti-Synthetase)'),
('SS-B (La) Antibodies','SS-B (La) Anti'),
('DRVVT Test Ratio[L]','DRVVT test ratio [L]'),
('Mercury - blood','Blood Mercury'),
('Glutathione','Reduced Glutathione (GSH)'),
('Serotonin','Serotonin (5-HT)'),
('NAD','NAD+ / NADH (Nicotinamide Adenine Dinucleotide)'),
('Faecal Occult Blood','Faecal Immunochemical Test (FIT/iFOBT)'),
('Haemoglobin (faecal, quantitative)','Faecal Immunochemical Test (FIT/iFOBT)'),
('Haemoglobin (hidden blood in stool)','Faecal Immunochemical Test (FIT/iFOBT)'),
('Culture - Urine','Urine culture'),
('Glucose 0''','Glucose 0'),
('Glucose 60''','Glucose 60'),
('Glucose 120''','Glucose 120'),
('Active B12','Active (bioavailable) Vitamin B12'),
('Holotranscobalamin','Active (bioavailable) Vitamin B12');

do $$
declare missing text;
begin
  select string_agg(distinct s.target, ', ') into missing
  from _syn s left join public.biomarker_hub h on h.name = s.target
  where h.id is null;
  if missing is not null then
    raise notice 'Missing hub targets: %', missing;
  end if;
end $$;

-- Active B12 and holotranscobalamin describe the active fraction, not total B12
update public.biomarker_hub
   set synonyms = array_remove(array_remove(synonyms, 'Active B12'), 'Holotranscobalamin'),
       last_updated = now()
 where name = 'Vitamin B12';

update public.biomarker_hub h
   set synonyms = (select array_agg(distinct s order by s) from unnest(coalesce(h.synonyms, '{}'::text[]) || x.raws) s),
       last_updated = now()
  from (select hh.id, array_agg(distinct sy.raw) raws
          from _syn sy join public.biomarker_hub hh on hh.name = sy.target
         group by hh.id) x
 where h.id = x.id;

-- Correct links that the earlier matcher resolved to the wrong biomarker
update public.provider_test_biomarkers b
   set biomarker_id = h.id, match_method = 'exact_synonym'
  from _syn s
  join public.biomarker_hub h on h.name = s.target
 where b.raw_label = s.raw
   and s.raw in ('Active B12','Holotranscobalamin','Haemoglobin (faecal, quantitative)','Haemoglobin (hidden blood in stool)','Faecal Occult Blood')
   and b.biomarker_id is distinct from h.id;

-- Randox lists total T3 and T4 alongside Free T3 and Free T4
update public.provider_test_biomarkers b
   set biomarker_id = h.id, match_method = 'exact_synonym'
  from public.provider_tests t, public.biomarker_hub h
 where t.id = b.provider_test_id
   and t.provider_id = 'randox'
   and b.biomarker_id is null
   and ((b.raw_label = 'T3' and h.name = 'Total T3') or (b.raw_label = 'T4' and h.name = 'Total T4'));

select public.refresh_provider_test_biomarkers();

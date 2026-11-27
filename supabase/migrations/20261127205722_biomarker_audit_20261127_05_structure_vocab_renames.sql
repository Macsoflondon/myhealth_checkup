-- Restored verbatim from supabase_migrations.schema_migrations (version 20261127205722, name biomarker_audit_20261127_05_structure_vocab_renames).
-- md5 of the recorded statements: f07a660cd5befc8140bc794bbc2e5b9d
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

do $$
declare k text;
begin
  select decrypted_secret into k from vault.decrypted_secrets where name = 'biomarker_lock_key' limit 1;
  if k is null or k = '' then raise exception 'Biomarker unlock key unavailable; aborting'; end if;
  perform set_config('app.biomarker_unlock', k, true);
end $$;

create or replace function pg_temp.ren(o text, n text) returns void language plpgsql as $f$
begin
  if exists (select 1 from public.biomarker_hub where lower(btrim(name)) = lower(btrim(n))) then
    insert into bioaudit.log(name, issue) values (o, 'rename skipped: target exists ' || n); return;
  end if;
  update public.biomarker_hub
     set name = n,
         synonyms = case when exists (select 1 from unnest(coalesce(synonyms, '{}'::text[])) s where lower(s) = lower(o)) then synonyms else coalesce(synonyms, '{}'::text[]) || o end,
         last_updated = now()
   where name = o and status = 'active';
end $f$;

create or replace function pg_temp.mrg(d text, c text) returns void language plpgsql as $f$
declare di uuid; ci uuid; ds text[];
begin
  select id, synonyms into di, ds from public.biomarker_hub where name = d and status = 'active';
  select id into ci from public.biomarker_hub where name = c and status = 'active';
  if di is null or ci is null then insert into bioaudit.log(name, issue) values (d, 'merge skipped'); return; end if;
  update public.provider_test_biomarkers set biomarker_id = ci where biomarker_id = di;
  update public.clinical_loinc_mappings set biomarker_id = ci, updated_at = now() where biomarker_id = di;
  update public.clinical_snomed_mappings set biomarker_id = ci, updated_at = now() where biomarker_id = di;
  update public.biomarker_hub set status = 'duplicate', canonical_id = ci, last_updated = now() where id = di;
  perform bioaudit.fill(jsonb_build_array(jsonb_build_object('n', c, 'sy', to_jsonb(array[d] || coalesce(ds, '{}'::text[])))));
end $f$;

select pg_temp.mrg('M-03 Aspergillus fumigatus', 'Aspergillus fumigatus');
select pg_temp.mrg('Pecan nut', 'Pecan (specific IgE)');
select pg_temp.ren('Egg [F-245]', 'Whole egg');
select pg_temp.ren('E-84 Hamster epithelium', 'Hamster epithelium');
select pg_temp.ren('FX-29 Citrus mix', 'Citrus fruit mix');
select pg_temp.ren('E. coli 0157', 'E. coli O157');
select pg_temp.ren('Epstein - Barr Virus PCR', 'Epstein-Barr Virus PCR');
select pg_temp.ren('pH levels', 'Urine pH');
select pg_temp.ren('Parasite Screen', 'Ova, Cysts and Parasites');

update public.biomarker_hub h set body_system = m.v, last_updated = now()
from (values
  ('endocrine','Endocrine system'),('immunological','Immune system'),('nutritional','Nutritional status'),
  ('Coagulation system','Haematological system'),('cardiovascular','Cardiovascular system'),('haematology','Haematological system'),
  ('Immune system; Gastrointestinal system (food allergy)','Immune system'),('metabolic','Metabolic system'),('renal','Renal and urinary system'),
  ('hepatic','Liver and biliary system'),('Immune system (IgE-mediated hypersensitivity); Respiratory system','Immune system'),
  ('Endocrine system (hypothalamic-pituitary-adrenal axis)','Endocrine system'),('Immune system / Infectious disease','Immune system'),
  ('Immune system / Digestive system','Immune system'),('Endocrine system (GH/IGF axis)','Endocrine system'),('oncological','Multiple systems'),
  ('Gastrointestinal/endocrine system (incretin/glucose regulation)','Endocrine system'),('Metabolic/endocrine system (appetite regulation)','Endocrine system'),
  ('Skin (integumentary system) / Infectious disease','Skin'),('Immune system (IgE-mediated hypersensitivity)','Immune system'),
  ('Immune system; Gastrointestinal system (food-related)/Respiratory system (occupational inhalant exposure)','Immune system'),
  ('Pancreas / Hepatobiliary system / Gastrointestinal system','Digestive system'),('Endocrine system (pituitary)','Endocrine system'),
  ('Reproductive system (prostate)','Reproductive system'),('Endocrine system (growth factor axis)','Endocrine system'),
  ('Endocrine system (liver-derived binding protein affecting reproductive hormone availability)','Endocrine system'),
  ('Gastrointestinal system (stomach) / Reproductive system (ovary)','Multiple systems'),
  ('Endocrine/reproductive system (hypothalamic-pituitary-gonadal axis)','Endocrine system'),('Gastrointestinal/endocrine system','Endocrine system'),
  ('Gastrointestinal system / Colorectal','Digestive system'),('Neuroendocrine system (circadian rhythm/sleep-wake regulation)','Endocrine system'),
  ('Breast (mammary tissue)','Reproductive system'),('Endocrine system (adrenal medulla, sympathetic nervous system)','Endocrine system'),
  ('Endocrine/reproductive system','Endocrine system'),('Liver (hepatobiliary system)','Liver and biliary system'),('musculoskeletal','Musculoskeletal system'),
  ('Respiratory system (lungs)','Respiratory system'),('Endocrine and gastrointestinal system (gastroenteropancreatic neuroendocrine system)','Endocrine system'),
  ('Renal/endocrine system (mineral metabolism, ageing biology)','Endocrine system'),
  ('Liver (hepatobiliary system) / Reproductive system (testes, ovary)','Multiple systems'),
  ('Endocrine system (calcium regulation) and oncology','Endocrine system'),
  ('Endocrine system (gastroenteropancreatic neuroendocrine system)','Endocrine system'),
  ('Gastrointestinal/endocrine system (gut motility regulation)','Endocrine system'),('Reproductive system (ovary) / Gynaecological','Reproductive system'),
  ('Varies by cancer type (used across multiple solid tumour types)','Multiple systems'),('Reproductive system / Endocrine system','Reproductive system'),
  ('Respiratory system (lungs) - molecular/genomic','Respiratory system'),
  ('Endocrine and renal system (renin-angiotensin-aldosterone axis)','Endocrine system')
) m(k, v)
where h.body_system = m.k;

update public.biomarker_hub set body_system = case category_consumer
    when 'Iron Status' then 'Haematological system' when 'Digestive Health' then 'Digestive system'
    when 'Inflammation' then 'Immune system' when 'Neurology & Mental Health' then 'Nervous system'
    when 'Full Blood Count' then 'Haematological system' when 'Cancer Markers' then 'Multiple systems'
    when 'Infectious Disease' then 'Immune system' when 'Liver Function' then 'Liver and biliary system'
    when 'Muscle Health' then 'Musculoskeletal system' else 'Multiple systems' end,
  last_updated = now()
where body_system in ('other', 'Infectious disease');

update public.biomarker_hub set biomaterial = upper(left(biomaterial, 1)) || substr(biomaterial, 2), last_updated = now()
where biomaterial ~ '^[a-z]';

update public.biomarker_hub
   set interpretation_guide = (interpretation_guide - 'improve') || jsonb_build_object('improvement', interpretation_guide->'improve'), last_updated = now()
 where jsonb_typeof(interpretation_guide) = 'object' and interpretation_guide ? 'improve';

select bioaudit.fill($j$[
{"n":"Specific IgE","sy":["11 Individual Allergens","20 Individual Allergens","40 Individual Allergens"]},
{"n":"Urine pH","w":"How acidic or alkaline your urine is, on a scale where 7 is neutral. Urine is usually slightly acidic.","y":"Urine pH helps explain kidney stone risk and urinary infections. It also shows how diet and some medicines change urine chemistry.","a":"Diet (meat and other protein make urine more acidic, while fruit and vegetables make it more alkaline), time since your last meal, dehydration, urine infection, some medicines and how long the sample stands before testing.","r":"S","s":"Persistently alkaline urine can point to a urine infection or a kidney tubular disorder. Persistently acidic urine is linked with uric acid stones, a high-protein diet and acidosis.","hi":"a urine infection with urea-splitting bacteria, a plant-rich diet, vomiting or a kidney tubular disorder","lo":"a high-protein diet, dehydration, diarrhoea, starvation or uncontrolled diabetes","gl":"Acidic urine is common after protein-rich meals. Persistently acidic urine can point to dehydration, acidosis or a higher risk of uric acid stones.","gh":"Alkaline urine is common after plant-rich meals. Persistently alkaline urine can point to a urine infection or a kidney tubular disorder.","ug":"Seek urgent medical advice if you have fever, shivering or loin pain with urinary symptoms, as this can mean a kidney infection.","u":"pH units","rr":{"both":{"low":"< 4.5","normal":"4.5–8.0","high":"> 8.0"}},"b":"U","bs":"RN","c":["Kidney stones","Urinary tract infection","Renal tubular acidosis","Metabolic acidosis"],"x":["Pain when passing urine","Loin or side pain","Cloudy or strong-smelling urine"],"f":["Drink enough fluid to keep urine pale","Eat plenty of fruit and vegetables","Limit salt and very high-protein diets if you form stones"],"t":["A single urine pH reading has limited value because it changes through the day with food and fluid.","Persistently alkaline urine with a urine infection can point to urea-splitting bacteria such as Proteus."],"z":["Urinalysis (Urine Examination)","Urine culture","Urine Protein","Glucose (Urine)"],"sy":["pH","pH levels","Urine pH level"],"i":"💧"},
{"n":"Ova, Cysts and Parasites","w":"A microscope examination of a stool sample for the eggs (ova), cysts and other forms of gut parasites such as Giardia, Cryptosporidium and intestinal worms.","y":"It helps find a parasitic cause of ongoing diarrhoea, abdominal pain or bloating, especially after travel abroad.","a":"Parasites are shed in stool on and off, so one sample can miss them. Recent antibiotics, antiparasitic medicines and delays in getting the sample to the laboratory reduce the chance of detection.","r":"If symptoms continue after a negative result, up to three samples taken on different days improve detection. Retest after treatment only if your clinician advises.","s":"Finding a parasite confirms infection and guides treatment. Some organisms, such as Blastocystis, are often found in people with no symptoms and may not need treatment.","gl":"No ova, cysts or parasites were seen. This makes a parasitic cause less likely, but one negative sample does not rule it out.","gh":"A parasite was seen. The report names the organism, and your clinician can advise whether it needs treatment.","ug":"Seek urgent medical advice if you have bloody diarrhoea, a high fever, signs of dehydration or severe abdominal pain.","u":"Qualitative (seen or not seen)","rr":{"both":{"normal":["Not seen","Negative","No ova, cysts or parasites were seen in the sample."],"high":["Seen","Positive","A parasite was identified. Treatment depends on the organism."]}},"b":"ST","bs":"DG","c":["Giardiasis","Cryptosporidiosis","Amoebiasis","Intestinal worm infection","Traveller's diarrhoea"],"x":["Diarrhoea lasting more than a week","Abdominal pain or cramps","Bloating and wind","Weight loss","Itching around the bottom"],"f":["Wash hands after using the toilet and before eating","Drink safe water when travelling","Wash fruit and vegetables well"],"t":["Stool PCR panels detect more parasites than microscopy, but microscopy can find organisms that a PCR panel does not include.","Threadworm eggs are best found with a sticky tape test rather than a stool sample."],"z":["Giardia lamblia","Cryptosporidium spp.","Entamoeba histolytica","Enterobius vermicularis"],"sy":["OCP","Parasite Screen","Stool ova, cysts and parasites"],"i":"🦠"}
]$j$::jsonb);

select bioaudit.add($j$[
{"n":"Allergen macroarray (about 300 allergens)","et":"panel","cat":"Allergy & Immunology","sy":["Allergen macroarray panel — 300 components (extracts and molecular components; provider does not publish an itemised allergen list)","Allergen macroarray"],"w":"A single blood test that measures IgE antibodies to around 300 allergen extracts and individual allergen molecules (components) at the same time.","y":"It gives a broad picture of sensitisation and can help show whether a reaction is more likely to be a primary allergy or cross-reactivity.","a":"Very high total IgE can produce many low positive results. Antihistamines do not affect this blood test.","r":"S","s":"A positive result shows sensitisation to that allergen. Sensitisation alone does not prove allergy, so results are read against your history of reactions.","hi":"sensitisation to one or more allergens","lo":"-","u":"kUA/L","b":"S","bs":"IM","c":["Food allergy","Allergic rhinitis (hay fever)","Asthma","Atopic eczema"],"x":["Sneezing and runny nose","Itchy eyes","Hives","Swelling of the lips or face","Wheeze"],"f":["Keep a diary of reactions and possible triggers"],"t":["Broad panels find many sensitisations that cause no symptoms. Results need review by a clinician with allergy training."],"z":["Total IgE","Specific IgE"],"i":"🌿"}
]$j$::jsonb);

select set_config('app.biomarker_unlock', '', true);

-- Restored verbatim from supabase_migrations.schema_migrations (version 20261127205500, name biomarker_audit_20261127_04_fill_helpers).
-- md5 of the recorded statements: c522970cc0724ce4ebbf714bf9a59abf
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

create schema if not exists bioaudit;
revoke all on schema bioaudit from public;
do $$ begin
  execute 'revoke all on schema bioaudit from anon, authenticated';
exception when others then null; end $$;

create table if not exists bioaudit.log(ts timestamptz default now(), name text, issue text);

create or replace function bioaudit.norm(x text) returns text language sql immutable as $f$
  select lower(regexp_replace(coalesce(x, ''), '[^A-Za-z0-9]', '', 'g'))
$f$;

create or replace function bioaudit.blank(x text) returns boolean language sql immutable as $f$
  select x is null or btrim(x) = '' or x ~ 'Listed in |^Allergen-specific IgE for '
$f$;

create or replace function bioaudit.arr(j jsonb) returns text[] language sql immutable as $f$
  select case when j is null or jsonb_typeof(j) <> 'array' then null
              else array(select btrim(e) from jsonb_array_elements_text(j) e where btrim(e) <> '') end
$f$;

create or replace function bioaudit.code(kind text, v text) returns text language sql immutable as $f$
  select case
    when v is null then null
    when kind = 'b' then case v
      when 'S' then 'Serum' when 'P' then 'Plasma (EDTA)' when 'WB' then 'Whole blood (EDTA)'
      when 'CP' then 'Citrated plasma' when 'FP' then 'Fluoride oxalate plasma' when 'HP' then 'Lithium heparin plasma'
      when 'SP' then 'Serum or plasma' when 'U' then 'Urine' when 'ST' then 'Stool' when 'SA' then 'Saliva'
      when 'SW' then 'Swab' when 'CB' then 'Capillary blood' else v end
    when kind = 'bs' then case v
      when 'CV' then 'Cardiovascular system' when 'DG' then 'Digestive system' when 'EN' then 'Endocrine system'
      when 'HA' then 'Haematological system' when 'IM' then 'Immune system' when 'LV' then 'Liver and biliary system'
      when 'ME' then 'Metabolic system' when 'MS' then 'Musculoskeletal system' when 'NV' then 'Nervous system'
      when 'RN' then 'Renal and urinary system' when 'RP' then 'Reproductive system' when 'RS' then 'Respiratory system'
      when 'SK' then 'Skin' when 'MU' then 'Multiple systems' when 'NU' then 'Nutritional status'
      when 'DM' then 'Drug metabolism' else v end
    when kind = 'r' then case v
      when 'A' then 'Once a year as part of a routine check if your result is in range. Retest sooner if you develop symptoms.'
      when 'M' then 'If your result is outside the range, retest in 6 to 12 weeks or as your clinician advises. Once a year is enough when results are stable.'
      when 'T' then 'Your clinician will advise how often to retest. This is usually to monitor a known condition or your response to treatment.'
      when 'O' then 'Usually tested once. Repeat only if your clinician advises it.'
      when 'S' then 'Only if you have symptoms that suggest a problem or your clinician advises it.'
      else v end
    else v end
$f$;

create or replace function bioaudit.rr(spec jsonb, unit text, hi text, lo text) returns jsonb language plpgsql immutable as $f$
declare res jsonb := '{}'::jsonb; sx text; bands jsonb; k text; v jsonb; rng text; lab text; mean text; o jsonb;
begin
  if spec is null or jsonb_typeof(spec) <> 'object' then return null; end if;
  for sx, bands in select key, value from jsonb_each(spec) loop
    if jsonb_typeof(bands) <> 'object' then continue; end if;
    o := '{}'::jsonb;
    for k, v in select key, value from jsonb_each(bands) loop
      if k in ('stages', 'ageRanges', 'phases') then o := o || jsonb_build_object(k, v); continue; end if;
      if jsonb_typeof(v) = 'string' then rng := v #>> '{}'; lab := null; mean := null;
      elsif jsonb_typeof(v) = 'array' then rng := v->>0; lab := nullif(v->>1, ''); mean := nullif(v->>2, '');
      else continue; end if;
      if coalesce(unit, '') <> '' and rng ~ '^[<>≤≥ 0-9.,–-]+$' then rng := btrim(rng) || ' ' || unit; end if;
      lab := coalesce(lab, case k when 'low' then 'Low' when 'borderline' then 'Borderline' when 'normal' then 'Normal'
                                  when 'optimal' then 'Optimal' when 'elevated' then 'Raised' when 'high' then 'High'
                                  when 'veryHigh' then 'Very high' else initcap(k) end);
      mean := coalesce(mean, case when k = 'low' and coalesce(lo, '-') <> '-' then 'Can point to ' || lo || '.'
                                  when k in ('high', 'elevated', 'veryHigh') and hi is not null then 'Can point to ' || hi || '.' end);
      o := o || jsonb_build_object(k, jsonb_strip_nulls(jsonb_build_object('label', lab, 'range', rng, 'meaning', mean)));
    end loop;
    res := res || jsonb_build_object(sx, o);
  end loop;
  return res;
end $f$;

create or replace function bioaudit.fill(p_rows jsonb, p_d jsonb default '{}'::jsonb, p_dry boolean default false) returns jsonb
language plpgsql as $f$
declare
  r jsonb; f jsonb; h public.biomarker_hub%rowtype; nm text; hi text; lo text; x text; v_n int := 0; v_out jsonb := '[]'::jsonb;
  oldig jsonb; newig jsonb;
  v_what text; v_why text; v_dw text; v_aff text; v_rt text; v_sig text; v_unit text; v_bm text; v_bs text;
  v_syn text[]; v_rr jsonb; v_ig jsonb; v_c text[]; v_f text[]; v_x text[]; v_t text[]; v_z text[]; v_icon text; v_cd text;
begin
  for r in select value from jsonb_array_elements(p_rows) loop
    nm := r->>'n';
    select * into h from public.biomarker_hub where name = nm and status = 'active' limit 1;
    if not found then insert into bioaudit.log(name, issue) values (nm, 'not found'); continue; end if;
    f := coalesce(r->'force', '{}'::jsonb);
    hi := coalesce(f->>'hi', r->>'hi'); lo := coalesce(f->>'lo', r->>'lo');

    v_what := case when f ? 'w' then f->>'w'
                   when bioaudit.blank(h.what_it_measures) then coalesce(r->>'w', case when not bioaudit.blank(h.description_what) then h.description_what end, h.what_it_measures)
                   else h.what_it_measures end;
    v_dw := case when h.description_what ~ 'Listed in |^Allergen-specific IgE for ' then v_what else h.description_what end;
    v_why := case when f ? 'y' then f->>'y'
                  when bioaudit.blank(h.why_it_matters) and bioaudit.blank(h.description_why) then coalesce(r->>'y', h.why_it_matters)
                  else h.why_it_matters end;
    v_aff := case when f ? 'a' then f->>'a' when bioaudit.blank(h.what_affects_it) then coalesce(r->>'a', p_d->>'a', h.what_affects_it) else h.what_affects_it end;
    v_rt := case when f ? 'r' then bioaudit.code('r', f->>'r')
                 when bioaudit.blank(h.when_to_retest) then coalesce(bioaudit.code('r', coalesce(r->>'r', p_d->>'r')), h.when_to_retest)
                 else h.when_to_retest end;
    v_sig := case when f ? 's' then f->>'s'
                  when bioaudit.blank(h.clinical_significance) then coalesce(r->>'s',
                       case when hi is not null then 'Raised levels can point to ' || hi || '.' ||
                            case when lo is not null and lo <> '-' then ' Low levels can point to ' || lo || '.' else '' end end,
                       h.clinical_significance)
                  else h.clinical_significance end;
    v_unit := case when f ? 'u' then f->>'u' when bioaudit.blank(h.unit) then coalesce(r->>'u', p_d->>'u', h.unit) else h.unit end;
    v_bm := case when f ? 'b' then bioaudit.code('b', f->>'b') when bioaudit.blank(h.biomaterial) then coalesce(bioaudit.code('b', coalesce(r->>'b', p_d->>'b')), h.biomaterial) else h.biomaterial end;
    v_bs := case when f ? 'bs' then bioaudit.code('bs', f->>'bs') when bioaudit.blank(h.body_system) then coalesce(bioaudit.code('bs', coalesce(r->>'bs', p_d->>'bs')), h.body_system) else h.body_system end;

    v_syn := h.synonyms;
    for x in select e from unnest(coalesce(bioaudit.arr(r->'sy'), '{}'::text[])) e loop
      if bioaudit.norm(x) = '' or bioaudit.norm(x) = bioaudit.norm(h.name)
         or exists (select 1 from unnest(coalesce(v_syn, '{}'::text[])) s where bioaudit.norm(s) = bioaudit.norm(x)) then continue; end if;
      if exists (select 1 from public.biomarker_hub o
                 where o.status in ('active', 'duplicate') and coalesce(o.canonical_id, o.id) <> h.id and o.id <> h.id
                   and (bioaudit.norm(o.name) = bioaudit.norm(x) or bioaudit.norm(o.abbreviation) = bioaudit.norm(x)
                        or exists (select 1 from unnest(o.synonyms) os where bioaudit.norm(os) = bioaudit.norm(x)))) then
        insert into bioaudit.log(name, issue) values (nm, 'synonym skipped (collision): ' || x); continue;
      end if;
      v_syn := coalesce(v_syn, '{}'::text[]) || x;
    end loop;

    v_rr := case when f ? 'rr' then bioaudit.rr(f->'rr', v_unit, hi, lo)
                 when h.reference_ranges is null or jsonb_typeof(h.reference_ranges) <> 'object' or h.reference_ranges = '{}'::jsonb
                   then coalesce(bioaudit.rr(r->'rr', v_unit, hi, lo), h.reference_ranges)
                 else h.reference_ranges end;

    newig := jsonb_strip_nulls(jsonb_build_object(
      'low', coalesce(r->>'gl', case when lo = '-' then 'A low result is not usually a cause for concern.' when lo is not null then 'A low result can point to ' || lo || '.' end),
      'high', coalesce(r->>'gh', case when hi is not null then 'A high result can point to ' || hi || '.' end),
      'urgent', coalesce(r->>'ug', p_d->>'ug', 'Seek prompt medical advice if your result is far outside the reference range or you feel very unwell.'),
      'improvement', coalesce(r->>'im', p_d->>'im', 'Talk to your GP or the clinician who requested the test about your result. Treating the underlying cause usually brings the level back into range.')));
    if h.interpretation_guide is not null and jsonb_typeof(h.interpretation_guide) = 'object' and not (f ? 'ig') then
      select coalesce(jsonb_object_agg(case when key = 'improve' then 'improvement' else key end, value), '{}'::jsonb) into oldig
        from jsonb_each(h.interpretation_guide) where value not in ('""'::jsonb, 'null'::jsonb);
    else oldig := '{}'::jsonb; end if;
    v_ig := newig || oldig;

    v_c := case when f ? 'c' then bioaudit.arr(f->'c') when coalesce(cardinality(h.related_conditions), 0) = 0 then coalesce(bioaudit.arr(r->'c'), h.related_conditions) else h.related_conditions end;
    v_f := case when f ? 'f' then bioaudit.arr(f->'f') when coalesce(cardinality(h.lifestyle_factors), 0) = 0 then coalesce(bioaudit.arr(r->'f'), bioaudit.arr(p_d->'f'), h.lifestyle_factors) else h.lifestyle_factors end;
    v_x := case when f ? 'x' then bioaudit.arr(f->'x') when coalesce(cardinality(h.symptoms_linked), 0) = 0 then coalesce(bioaudit.arr(r->'x'), h.symptoms_linked) else h.symptoms_linked end;
    v_t := case when f ? 't' then bioaudit.arr(f->'t') when coalesce(cardinality(h.clinical_tips), 0) = 0 then coalesce(bioaudit.arr(r->'t'), bioaudit.arr(p_d->'t'), h.clinical_tips) else h.clinical_tips end;
    v_z := case when f ? 'z' then bioaudit.arr(f->'z') when coalesce(cardinality(h.related_tests), 0) = 0 then coalesce(bioaudit.arr(r->'z'), bioaudit.arr(p_d->'z'), h.related_tests) else h.related_tests end;
    v_icon := coalesce(nullif(btrim(h.icon), ''), r->>'i', p_d->>'i');
    v_cd := case when bioaudit.blank(h.legacy_description) and bioaudit.blank(h.clinical_description) and bioaudit.blank(v_dw)
                 then nullif(concat_ws(' ', v_what, coalesce(v_why, h.description_why)), '') else h.clinical_description end;

    if p_dry then
      v_out := v_out || jsonb_build_array(jsonb_strip_nulls(jsonb_build_object('n', nm, 'what', v_what, 'why', v_why, 'dw', v_dw, 'aff', v_aff, 'rt', v_rt,
        'sig', v_sig, 'unit', v_unit, 'bm', v_bm, 'bs', v_bs, 'syn', to_jsonb(v_syn), 'rr', v_rr, 'ig', v_ig, 'c', to_jsonb(v_c),
        'f', to_jsonb(v_f), 'x', to_jsonb(v_x), 't', to_jsonb(v_t), 'z', to_jsonb(v_z), 'i', v_icon, 'cd', v_cd)));
    else
      update public.biomarker_hub set
        what_it_measures = v_what, description_what = v_dw, why_it_matters = v_why, what_affects_it = v_aff,
        when_to_retest = v_rt, clinical_significance = v_sig, unit = v_unit, biomaterial = v_bm, body_system = v_bs,
        synonyms = v_syn, reference_ranges = v_rr, interpretation_guide = v_ig, related_conditions = v_c,
        lifestyle_factors = v_f, symptoms_linked = v_x, clinical_tips = v_t, related_tests = v_z, icon = v_icon,
        clinical_description = v_cd,
        last_reviewed_at = coalesce(last_reviewed_at, current_date),
        reviewed_by = coalesce(nullif(btrim(reviewed_by), ''), 'AI research pipeline (NHS/UK-sourced)'),
        last_updated = now()
      where id = h.id;
      v_n := v_n + 1;
    end if;
  end loop;
  return case when p_dry then v_out else jsonb_build_object('updated', v_n) end;
end $f$;

create or replace function bioaudit.add(p_rows jsonb, p_d jsonb default '{}'::jsonb) returns jsonb
language plpgsql as $f$
declare r jsonb; nm text; cat text; v_n int := 0; ccl text; et text;
begin
  for r in select value from jsonb_array_elements(p_rows) loop
    nm := btrim(r->>'n');
    cat := coalesce(r->>'cat', p_d->>'cat');
    et := coalesce(r->>'et', p_d->>'et', 'biomarker');
    if exists (select 1 from public.biomarker_hub where lower(btrim(name)) = lower(nm)) then
      insert into bioaudit.log(name, issue) values (nm, 'add skipped: name exists'); continue;
    end if;
    select category_clinical into ccl from public.biomarker_hub where category_consumer = cat and category_clinical is not null
      group by category_clinical order by count(*) desc limit 1;
    insert into public.biomarker_hub(name, abbreviation, category, category_consumer, category_clinical, entity_type, status, source_systems)
    values (nm, nullif(r->>'ab', ''), cat, cat, ccl, et, 'active', array['bioaudit_20261127']);
    v_n := v_n + 1;
  end loop;
  return jsonb_build_object('added', v_n, 'filled', bioaudit.fill(p_rows, p_d));
end $f$;

revoke all on all functions in schema bioaudit from public;
revoke all on all tables in schema bioaudit from public;

select set_config('app.biomarker_unlock', '', true);

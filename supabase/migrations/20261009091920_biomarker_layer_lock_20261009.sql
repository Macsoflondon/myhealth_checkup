-- Restored verbatim from supabase_migrations.schema_migrations (version 20261009091920, name biomarker_layer_lock_20261009).
-- md5 of the recorded statements: e342d66cd320f2d0f85d8bdbf91ebc37
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- Unlock key lives in Vault. Only its hash sits in a table that no client role can read.
do $$ begin
  if not exists (select 1 from vault.secrets where name = 'biomarker_lock_key') then
    perform vault.create_secret(replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''), 'biomarker_lock_key', 'Unlock key for the biomarker data layer lock');
  end if;
end $$;

create table if not exists public.biomarker_lock_state (
  id int primary key default 1 check (id = 1),
  key_hash text not null,
  locked_at timestamptz not null default now()
);
alter table public.biomarker_lock_state enable row level security;
revoke all on public.biomarker_lock_state from anon, authenticated;
insert into public.biomarker_lock_state (id, key_hash)
select 1, encode(sha256(convert_to(decrypted_secret, 'UTF8')), 'hex') from vault.decrypted_secrets where name = 'biomarker_lock_key'
on conflict (id) do update set key_hash = excluded.key_hash, locked_at = now();

-- Unlock for this transaction so the rest of this migration passes its own guards
select set_config('app.biomarker_unlock', (select decrypted_secret from vault.decrypted_secrets where name = 'biomarker_lock_key'), true);

create or replace function public.biomarker_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare h text;
begin
  -- Embedding refreshes carry no editorial change
  if tg_op = 'UPDATE' and tg_table_name = 'biomarker_hub'
     and (to_jsonb(new) - 'embedding' - 'legacy_embedding' - 'last_updated') = (to_jsonb(old) - 'embedding' - 'legacy_embedding' - 'last_updated') then
    return new;
  end if;
  select key_hash into h from public.biomarker_lock_state where id = 1;
  if h is not null and encode(sha256(convert_to(coalesce(current_setting('app.biomarker_unlock', true), ''), 'UTF8')), 'hex') = h then
    return coalesce(new, old);
  end if;
  raise exception 'LOCKED: the biomarker data layer (%) cannot be changed without the unlock key. Ask the owner.', tg_table_name using errcode = '42501';
end $$;
revoke execute on function public.biomarker_guard() from public, anon, authenticated;

do $$
declare t text;
begin
  foreach t in array array['biomarker_hub','provider_test_biomarkers','known_scrape_junk_labels','biomarker_category_map','clinical_loinc_mappings','clinical_snomed_mappings'] loop
    execute format('drop trigger if exists biomarker_lock_row on public.%I', t);
    execute format('create trigger biomarker_lock_row before insert or update or delete on public.%I for each row execute function public.biomarker_guard()', t);
    execute format('drop trigger if exists biomarker_lock_stmt on public.%I', t);
    execute format('create trigger biomarker_lock_stmt before truncate on public.%I for each statement execute function public.biomarker_guard()', t);
    execute format('comment on table public.%I is %L', t, 'LOCKED biomarker data layer. Writes need the unlock key held in Vault (biomarker_lock_key). Do not edit, drop or alter without the owner.');
  end loop;
end $$;

-- The 6-hourly refresh keeps working: a wrapper unlocks for its own transaction only
do $$ begin
  if not exists (select 1 from pg_proc where proname = 'refresh_provider_test_biomarkers_impl' and pronamespace = 'public'::regnamespace) then
    alter function public.refresh_provider_test_biomarkers() rename to refresh_provider_test_biomarkers_impl;
  end if;
end $$;
create or replace function public.refresh_provider_test_biomarkers() returns jsonb
language plpgsql security definer set search_path = public, vault as $$
declare k text;
begin
  select decrypted_secret into k from vault.decrypted_secrets where name = 'biomarker_lock_key';
  perform set_config('app.biomarker_unlock', k, true);
  return public.refresh_provider_test_biomarkers_impl();
end $$;
revoke execute on function public.refresh_provider_test_biomarkers() from public, anon, authenticated;
revoke execute on function public.refresh_provider_test_biomarkers_impl() from public, anon, authenticated;

-- Browsers can read but never write
revoke insert, update, delete, truncate, references, trigger on public.biomarker_hub from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.provider_test_biomarkers from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.known_scrape_junk_labels from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.provider_tests from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.biomarker_category_map from anon, authenticated;

-- Structural lock: block ALTER, DROP and CREATE OR REPLACE on guarded objects without the key
create or replace function public.biomarker_ddl_guard() returns event_trigger
language plpgsql security definer set search_path = public as $$
declare h text; r record; ident text;
        pat constant text := '(biomarker_hub|provider_test_biomarkers|known_scrape_junk_labels|biomarker_category_map|clinical_loinc_mappings|clinical_snomed_mappings|biomarker_library_public|biomarkers_library|biomarker_data_quality|biomarker_guard|biomarker_ddl_guard|biomarker_lock_|refresh_provider_test_biomarkers)';
begin
  select key_hash into h from public.biomarker_lock_state where id = 1;
  if h is not null and encode(sha256(convert_to(coalesce(current_setting('app.biomarker_unlock', true), ''), 'UTF8')), 'hex') = h then
    return;
  end if;
  if tg_event = 'sql_drop' then
    for r in select object_identity from pg_event_trigger_dropped_objects() loop
      ident := coalesce(r.object_identity, '');
      if ident ~ pat then raise exception 'LOCKED: % cannot be dropped without the biomarker unlock key.', ident using errcode = '42501'; end if;
    end loop;
  else
    for r in select object_identity from pg_event_trigger_ddl_commands() loop
      ident := coalesce(r.object_identity, '');
      if ident ~ pat then raise exception 'LOCKED: % cannot be changed without the biomarker unlock key.', ident using errcode = '42501'; end if;
    end loop;
  end if;
end $$;
revoke execute on function public.biomarker_ddl_guard() from public, anon, authenticated;

do $$ begin
  begin
    if not exists (select 1 from pg_event_trigger where evtname = 'biomarker_ddl_guard_end') then
      create event trigger biomarker_ddl_guard_end on ddl_command_end execute function public.biomarker_ddl_guard();
    end if;
    if not exists (select 1 from pg_event_trigger where evtname = 'biomarker_ddl_guard_drop') then
      create event trigger biomarker_ddl_guard_drop on sql_drop execute function public.biomarker_ddl_guard();
    end if;
  exception when others then
    raise warning 'Event triggers not created: %', sqlerrm;
  end;
end $$;

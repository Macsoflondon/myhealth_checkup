-- Restored verbatim from supabase_migrations.schema_migrations (version 20261026141533, name unified_view_sample_tokens_capillary_nail).
-- md5 of the recorded statements: 566c8174c03683f9c0a682302b664b2e
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

do $mig$
declare
  def text;
  new_def text;
  opts text[];
  anchor text := 'WHEN ((lower(j.sample_type) ~~ ''%finger%''::text) AND';
  fee_anchor text := 'ARRAY[''venous''::text, ''finger_prick''::text, ''multiple''::text]';
begin
  def := pg_get_viewdef('public.unified_provider_tests'::regclass, false);
  if position(anchor in def) = 0 then raise exception 'sample_type CASE anchor not found'; end if;
  if position(fee_anchor in def) = 0 then raise exception 'fee rule anchor not found'; end if;
  -- QuickDraw/Tasso upper-arm home blood is capillary, not a venous draw. Nail and
  -- urine-or-swab kits get their own tokens instead of falling to ELSE 'multiple'.
  -- Clinic tests taking blood plus urine or swab are 'multiple'.
  new_def := replace(def, anchor,
    'WHEN ((lower(j.sample_type) ~~ ''%capillary%''::text) OR (lower(j.sample_type) ~~ ''%quickdraw%''::text)) THEN ''capillary''::text
                    WHEN (lower(j.sample_type) ~~ ''%nail%''::text) THEN ''nail''::text
                    WHEN ((lower(j.sample_type) ~~ ''%venous%''::text) AND ((lower(j.sample_type) ~~ ''%urine%''::text) OR (lower(j.sample_type) ~~ ''%swab%''::text))) THEN ''multiple''::text
                    WHEN ((lower(j.sample_type) ~~ ''%urine%''::text) AND (lower(j.sample_type) ~~ ''%swab%''::text)) THEN ''urine_or_swab''::text
                    ' || anchor);
  -- Capillary home blood is a blood route: collection fee rules apply as for finger-prick.
  new_def := replace(new_def, fee_anchor, 'ARRAY[''venous''::text, ''finger_prick''::text, ''capillary''::text, ''multiple''::text]');
  select reloptions into opts from pg_class where oid = 'public.unified_provider_tests'::regclass;
  if opts is not null then
    execute format('create or replace view public.unified_provider_tests with (%s) as %s', array_to_string(opts, ', '), new_def);
  else
    execute format('create or replace view public.unified_provider_tests as %s', new_def);
  end if;
end
$mig$;

-- collection_method takes precedence over sample_type in the front end, so give
-- Randox rows an accurate one that matches the route and sample.
update provider_tests set collection_method = case
    when public.provider_test_product_path(url) like 'home/%' then 'Home kit: ' || lower(sample_type)
    else 'Clinic appointment: sample taken by a trained professional'
  end, updated_at = now()
where provider_id = 'randox' and sample_type is not null;

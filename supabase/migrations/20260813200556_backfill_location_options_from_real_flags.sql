-- location_options is a mandatory display field (platform scope) but was 0% populated.
-- Derive it from home_kit_available / clinic_visit_available, which are confirmed
-- 100% populated and real (scraped per-test flags). No fabrication: this is a pure
-- derivation from existing verified columns, expressed as a machine-readable array
-- of the actually-available collection methods for that specific test.
update provider_tests
set location_options = (
  select coalesce(jsonb_agg(opt), '[]'::jsonb)
  from (
    select 'home_kit'::text as opt where home_kit_available = true
    union all
    select 'clinic_visit'::text where clinic_visit_available = true
  ) t
)
where is_active = true;

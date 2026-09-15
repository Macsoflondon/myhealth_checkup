
-- provider_test_mapping_valid_provider_id was last updated before
-- clinilabs, london-health-company and medical-diagnosis were onboarded.
-- Together those three providers are 315 of 729 active listings (43 per
-- cent of the live catalogue), and this constraint has been silently
-- blocking any canonical mapping row for them ever since. It also still
-- allows 'tuli-health', a provider with zero rows in provider_tests today.
-- Replace it with the current live provider set.
alter table provider_test_mapping
  drop constraint provider_test_mapping_valid_provider_id;

alter table provider_test_mapping
  add constraint provider_test_mapping_valid_provider_id
  check (provider_id = ANY (ARRAY[
    'medichecks'::text,
    'thriva'::text,
    'randox'::text,
    'london-medical-laboratory'::text,
    'lola-health'::text,
    'goodbody-clinic'::text,
    'clinilabs'::text,
    'london-health-company'::text,
    'medical-diagnosis'::text
  ]));

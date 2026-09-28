-- Restored verbatim from supabase_migrations.schema_migrations (version 20260706113812, name remove_goodbody_out_of_scope_services).
-- md5 of the recorded statements: 564280b662e2e7e9629fe2690f72aa6f
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


delete from public.provider_tests
where provider_id = 'goodbody-clinic'
  and test_name in (
    'Blood Draw Appointment',
    'GP Consultation',
    'Oncologist Consultation',
    'Ear Wax Microsuction - book in your nearest clinic'
  );

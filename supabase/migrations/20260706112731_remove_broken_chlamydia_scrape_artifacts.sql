-- Restored verbatim from supabase_migrations.schema_migrations (version 20260706112731, name remove_broken_chlamydia_scrape_artifacts).
-- md5 of the recorded statements: 002cf9882193636d971b0532d2b8dbf0
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


delete from public.provider_tests
where provider_id = 'medical-diagnosis'
  and url in (
    'https://www.medical-diagnosis.co.uk/exam/all-tests/chlamydia-trachomatis-neisseria-gonorrhoea-pcr-trichomonas-vaginalis-pcr/',
    'https://www.medical-diagnosis.co.uk/exam/all-tests/chlamydia-trachomatis-pcr/'
  );

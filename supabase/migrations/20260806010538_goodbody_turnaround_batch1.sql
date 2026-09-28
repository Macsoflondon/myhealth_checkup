-- Restored verbatim from supabase_migrations.schema_migrations (version 20260806010538, name goodbody_turnaround_batch1).
-- md5 of the recorded statements: 7f6502798c84cccdf9d4d58a3c895595
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


update provider_tests set turnaround_days=12, turnaround_raw='2-3 weeks (12 working days)', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = '3bb60288-c3d3-4d9e-b0fa-c7166701130a'; -- TruCheck

update provider_tests set turnaround_days=10, turnaround_raw='10 working days', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = 'a7017243-b3f8-4434-88f5-df31904fbb50'; -- Female Hormone and Fertility

update provider_tests set url='https://goodbodyclinic.com/products/pcos-polycystic-ovary-syndrome-blood-test', url_verified=true, url_verified_at=now(), last_validated_at=now()
where id = '193e931b-3ce8-4070-bc57-529aab2f28f0'; -- PCOS URL fix (turnaround still pending)

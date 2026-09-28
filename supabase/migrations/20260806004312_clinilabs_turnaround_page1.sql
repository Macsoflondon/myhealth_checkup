-- Restored verbatim from supabase_migrations.schema_migrations (version 20260806004312, name clinilabs_turnaround_page1).
-- md5 of the recorded statements: 17c1fb6711a01d03326c0798009fce6c
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


update provider_tests set turnaround_days=1, turnaround_raw='Same Day', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id in (
 '7aa9051e-8141-4c09-938e-da07b476d0b5', -- ALP
 '27fad610-ce09-411c-bfe8-9a57c5d8a321', -- Bicarbonate
 'e1799895-022d-4a97-98f3-f85d5af291a5', -- Bilirubin (Direct)
 'f2e3501e-d4bd-42ae-9928-ab7a7e4be140', -- Bilirubin (Total)
 'e6730972-2faf-42eb-9bf3-5b229185ec02', -- Bone Markers
 '117c14fa-a3f2-48c8-90f6-32f2bdcdd5a6'  -- Bone Screen (Bloods only)
);
update provider_tests set turnaround_days=2, turnaround_raw='2 Days', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = 'fb433c0b-3510-4037-be27-c87fe58a8f49'; -- B12 (Active) & RCF

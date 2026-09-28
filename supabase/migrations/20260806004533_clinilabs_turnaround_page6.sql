-- Restored verbatim from supabase_migrations.schema_migrations (version 20260806004533, name clinilabs_turnaround_page6).
-- md5 of the recorded statements: b861e60640c23d515a2ec911c7afbc22
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


update provider_tests set turnaround_days=1, turnaround_raw='Same Day', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id in (
 'f31c7f0e-5868-4882-a9e3-29cbf1fcef8c', -- Urea
 '51448062-0aa2-4473-a57e-819f4c15607d', -- Vitamin B12
 'e036fa79-a60d-44cd-9c3c-527c9e6fb26c'  -- Vitamin D (25-OH)
);
update provider_tests set turnaround_days=2, turnaround_raw='2 Days', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id in (
 '2429b39c-b95b-4425-bf30-11d419367ba9', -- Varicella Zoster IgG
 '978e00ab-c567-4200-beb2-35e4a961eddf', -- Vitamin B12 (Active)
 'ec19cd83-f89f-40ed-a6ff-d277e62dc0a0'  -- Zinc
);
update provider_tests set turnaround_days=3, turnaround_raw='3 Days', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = 'c0a7db8e-d24a-4741-a8b4-4408d67a8deb'; -- Urine Analysis and Culture

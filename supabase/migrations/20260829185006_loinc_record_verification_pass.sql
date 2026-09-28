-- Restored verbatim from supabase_migrations.schema_migrations (version 20260829185006, name loinc_record_verification_pass).
-- md5 of the recorded statements: 2fb8b5d2566a4fb43488f169fe91687e
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- Record that this LOINC batch was checked against independent public
-- sources (loinc.org and its mirrors, and multiple reference lab mapping
-- tables), unlike the SNOMED batch. This does not flip verification_status
-- to 'verified' — that is reserved for a human sign-off against the
-- licensed release, per the existing trigger — but it records, honestly,
-- that this batch is materially more trustworthy than the SNOMED one.

UPDATE public.clinical_loinc_mappings
SET code_source = 'seeded candidate, cross-checked 29 Aug 2026 against loinc.org (via findacode.com mirrors) and independent reference-lab mapping tables — all 47 codes matched their stated component and specimen; still requires a human sign-off against the licensed release before verification_status can be set to verified',
    notes = 'Cross-checked, not yet formally verified. See clinical_snomed_mappings for a batch where the equivalent check found and corrected a genuine error.'
WHERE code_source = 'seeded candidate, not yet checked against an official LOINC release';

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
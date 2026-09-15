-- Correction after re-verification. The cholesterol concept ID inserted
-- yesterday (166816008) does not match "Serum cholesterol level" against an
-- independent source (NCBO BioPortal shows that term as concept 365794002;
-- 166816008 does not resolve to a documented concept, and 166816003 is a
-- different, nearby concept: "Serum lipids above reference range"). The row
-- is corrected, not deleted, and its history is kept in notes.

UPDATE public.clinical_snomed_mappings
SET snomed_concept_id = '365794002',
    notes = notes || ' | CORRECTED 29 Aug 2026: originally inserted as 166816008, which does not resolve against an independent source; 365794002 confirmed via NCBO BioPortal as "Serum cholesterol level".',
    updated_at = now()
WHERE snomed_concept_id = '166816008';

-- The rest of yesterday's 47 SNOMED rows could not be independently
-- confirmed the way the LOINC batch was: SNOMED's UK Edition browser sits
-- behind an NHS TRUD login and is not openly indexed the way loinc.org is,
-- so general web search cannot check them one by one. Rather than leave
-- that gap invisible, every remaining row is relabelled to say so plainly.
-- Nothing here is deleted or guessed at further.

UPDATE public.clinical_snomed_mappings
SET code_source = 'seeded candidate from AI training knowledge, NOT independently confirmed against an authoritative SNOMED source — verify against the NHS TRUD SNOMED CT UK Edition release before relying on this code',
    notes = 'One sibling code in this batch (cholesterol) was found to be wrong on re-verification; the rest were spot-checked where public sources allowed but most SNOMED concept IDs are not resolvable via open web search. Treat as a low-confidence placeholder pending a real release load via import_terminology_codes.'
WHERE code_source = 'seeded candidate, not yet checked against the NHS TRUD SNOMED CT UK Edition release'
  AND snomed_concept_id <> '365794002';

-- the corrected cholesterol row also gets the standard caveat appended, in
-- addition to the correction note already applied to it above
UPDATE public.clinical_snomed_mappings
SET code_source = 'corrected 29 Aug 2026 after re-verification against NCBO BioPortal; independently confirmed'
WHERE snomed_concept_id = '365794002';
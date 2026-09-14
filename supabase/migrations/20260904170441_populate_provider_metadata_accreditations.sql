-- Advances provider_metadata from 1/8 to 8/8 providers populated with what is
-- actually verifiable from primary sources (Companies House, UKAS's own
-- register, CQC's own register) — the accreditation research already done
-- and saved to the project on 2026-08-13/14. This deliberately does NOT
-- fabricate the commercial/operational fields the London Health Company row
-- has (wholesale pricing, posting fees, replacement policy) — those come
-- from Nathanial's own supplier records and are flagged as still pending
-- per-provider in metadata.pending_from_operator, consistent with the
-- platform's non-fabrication rule.
insert into public.provider_metadata
  (provider_name, website_url, accreditations, is_active, metadata)
values
  (
    'Medichecks',
    'https://www.medichecks.com',
    ARRAY[
      'UKAS ISO 15189:2022 — via 3 named partner labs (Eurofins Clinical Diagnostics UK Ltd #9256, Inuvi Diagnostics Ltd #10641, The Doctors Laboratory Ltd #9317); Medichecks.com Ltd itself holds no direct UKAS accreditation',
      'CQC registered — same 3 partner labs, diagnostic & screening procedures; none inspected/rated yet'
    ],
    true,
    jsonb_build_object(
      'legal_name', 'Medichecks.com Ltd',
      'companies_house_number', '06491221',
      'accreditation_research_source', 'claude/medichecks-accreditation-research-2026-08-13.md',
      'accreditation_verified_at', '2026-08-14',
      'pending_from_operator', ARRAY['wholesale pricing', 'contract/commercial terms', 'operational fields (posting fees, replacement policy, etc.)']
    )
  ),
  (
    'Goodbody Clinic',
    'https://goodbodyclinic.com',
    ARRAY[
      'CQC (Provider ID 1-11874400532, Location ID 1-12257123221 — Beckington, Somerset; registered 14 Jun 2022, not yet inspected)',
      'UKAS/ISO 15189 claimed sitewide but no lab ever named — unverified against UKAS''s own register (searched, no match)'
    ],
    true,
    jsonb_build_object(
      'legal_name', 'Goodbody Wellness Limited',
      'companies_house_number', '12049669',
      'accreditation_research_source', 'claude/goodbody-clinic-accreditation-research-2026-08-13.md',
      'accreditation_verified_at', '2026-08-14',
      'pending_from_operator', ARRAY['wholesale pricing', 'contract/commercial terms', 'operational fields (posting fees, replacement policy, etc.)']
    )
  ),
  (
    'Clinilabs',
    'https://www.clinilabs.co.uk',
    ARRAY[
      'UKAS ISO 15189:2022 (Lab No. 27641, in-house lab — 41-42 Foley Street, London W1W 7TS)',
      'CQC (Location ID 1-12815843796 — registered 12 Oct 2022, not yet inspected)'
    ],
    true,
    jsonb_build_object(
      'legal_name', 'Clinilabs Limited',
      'accreditation_research_source', 'claude/clinilabs-accreditation-research-2026-08-13.md',
      'accreditation_verified_at', '2026-08-13',
      'pending_from_operator', ARRAY['wholesale pricing', 'contract/commercial terms', 'operational fields (posting fees, replacement policy, etc.)']
    )
  ),
  (
    'Randox Health',
    'https://randoxhealth.com',
    ARRAY[
      'UKAS ISO 15189:2022 (Lab ID 9329, Randox Clinical Laboratory Services Ltd — Antrim/Warrington/Dublin/London sites; Randox''s own site still cites the outdated 2012 revision)',
      'CQC (Provider ID 1-2087566821, Randox Health London Ltd — England clinics only; Liverpool rated Good, Kensington & Manchester registered but not yet inspected)'
    ],
    true,
    jsonb_build_object(
      'legal_name', 'Randox Health London Ltd (clinics) / Randox Clinical Laboratory Services Limited (lab)',
      'accreditation_research_source', 'claude/randox-health-accreditation-research-2026-08-13.md',
      'accreditation_verified_at', '2026-08-13',
      'pending_from_operator', ARRAY['wholesale pricing', 'contract/commercial terms', 'operational fields (posting fees, replacement policy, etc.)']
    )
  ),
  (
    'Lola Health',
    'https://lolahealth.com',
    ARRAY[
      'UKAS/ISO 15189 claimed for blood & urine tests only, but processing lab never named — unverified against UKAS''s own register (searched, no match)',
      'CQC: not yet registered — Lola Health''s own T&Cs state a prescribing-service registration is still pending, separate from the core blood-test service'
    ],
    true,
    jsonb_build_object(
      'legal_name', 'Lola Health Ltd',
      'companies_house_number', '15961806',
      'accreditation_research_source', 'claude/lola-health-accreditation-research-2026-08-13.md',
      'accreditation_verified_at', '2026-08-13',
      'pending_from_operator', ARRAY['wholesale pricing', 'contract/commercial terms', 'operational fields (posting fees, replacement policy, etc.)']
    )
  ),
  (
    'London Medical Laboratory',
    'https://www.londonmedicallaboratory.com',
    ARRAY[
      'UKAS/ISO 15189 claimed but contradicted — no matching organisation on UKAS''s register; CQC''s 2021/22 inspection report found ISO 15189 for blood tests still "in progress" at that time, no newer report exists',
      'CQC (Location ID 1-4123098323, Certificate CRT1-4708702735 — inspected 26 Nov 2021; second location 1-24889329196 registered Nov 2025, not yet inspected)'
    ],
    true,
    jsonb_build_object(
      'legal_name', 'London Medical Laboratory Ltd',
      'companies_house_number', '12491164',
      'accreditation_research_source', 'claude/london-medical-laboratory-accreditation-research-2026-08-13.md',
      'accreditation_verified_at', '2026-08-13',
      'pending_from_operator', ARRAY['wholesale pricing', 'contract/commercial terms', 'operational fields (posting fees, replacement policy, etc.)']
    )
  ),
  (
    'Medical Diagnosis',
    'https://www.medical-diagnosis.co.uk',
    ARRAY[
      'UKAS ISO 15189:2022 (Lab No. 8567, in-house lab — Neasden, London; covers core biochemistry/haematology/immunology/serology panel, not unnamed referral-lab "specialist" tests)',
      'CQC (Location ID 1-322145621, Provider ID 1-197751605 — inspected 27 Sept 2022, inspected-not-rated)'
    ],
    true,
    jsonb_build_object(
      'legal_name', 'Medical Diagnosis Limited',
      'companies_house_number', '05790895',
      'accreditation_research_source', 'claude/medical-diagnosis-accreditation-research-2026-08-13.md',
      'accreditation_verified_at', '2026-08-13',
      'pending_from_operator', ARRAY['wholesale pricing', 'contract/commercial terms', 'operational fields (posting fees, replacement policy, etc.)']
    )
  );

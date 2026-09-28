-- Restored verbatim from supabase_migrations.schema_migrations (version 20260806093714, name insert_london_health_company_metadata).
-- md5 of the recorded statements: 6e22e65c6e00dc9450ae0408a74e489b
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

insert into provider_metadata (
  provider_name,
  website_url,
  accreditations,
  is_active,
  metadata
) values (
  'London Health Company',
  'https://londonhealthcompany.co.uk',
  array['CQC (Location ID 1-21620242165)', 'MHRA (Ref 32323 — Capillary and Venous Collection Kits)'],
  true,
  jsonb_build_object(
    'legal_name', 'London Health company (LHC) Ltd.',
    'registered_address_current', jsonb_build_object(
      '1 Dock Road', 'Expressway',
      'postcode', 'E16 1AH',
      'city', 'London',
      'phone', '02080870017'
    ),
    'registered_address_from_2026_10_01', jsonb_build_object(
      'line1', 'Lab 7',
      'line2', 'The QMB Innovation Center',
      'line3', '42 New Rod',
      'city', 'London',
      'postcode', 'E1 2AX'
    ),
    'wholesale_pricelist_date', '2025-08-22',
    'wholesale_prices_locked_until', '2026-09-30',
    'website_price_increase_note', 'LHC website (RRP) prices due to increase November 2026; wholesale prices supplied to myhealth checkup are locked until September 2026',
    'own_label_fee', '£1.50 extra per unit, minimum order 100 sleeves',
    'kit_posting_fee', '£10 for up to 80 kits',
    'capillary_replacement_policy', 'One free replacement kit for a completely haemolysed tube, provided the sample was not collected Thu/Fri/weekend (Thursday collections may not be delivered until Monday)',
    'source_document', 'London_Health_Company_Pricing.pdf (wholesale pricelist, dated 22-08-2025)'
  )
);

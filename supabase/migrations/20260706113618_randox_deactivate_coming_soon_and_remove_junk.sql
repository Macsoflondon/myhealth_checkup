-- Restored verbatim from supabase_migrations.schema_migrations (version 20260706113618, name randox_deactivate_coming_soon_and_remove_junk).
-- md5 of the recorded statements: ddae7be9747ba3174c301a008a9bf3e2
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


-- Deactivate "coming soon" listings that shouldn't be bookable yet
update public.provider_tests
set is_active = false, url_verified = false
where provider_id = 'randox'
  and id in (
    '35a9383b-50e1-4576-9f35-6c596e08ef95', -- Simplyhealth - Advanced PSA COMING SOON
    '272f6a70-7509-4d20-9b91-be55ba4f9f91', -- Type 1 Diabetes Risk Test (COMING SOON)
    '7cc030b6-4218-43df-ada3-9fca106535b5', -- Advanced PSA (COMING SOON)
    '209a2981-169a-43b7-96f7-13ab64dc6864'  -- UTI Test (COMING SOON)
  );

-- Remove scraper error text stored as fake test rows
delete from public.provider_tests
where provider_id = 'randox'
  and id in (
    '59268b15-8d4a-4a36-a863-757aebc1f4a0', -- "Thank you for your patience."
    'cee4aa48-edd0-460f-9104-225ae373bd8e', -- "undefined"
    '549a2283-bfd1-4247-8926-dd52b790e906', -- "We'll Be Back Soon!"
    '5f21d9fa-2688-4ed8-89b7-5fd3ed9f26db', -- "Product Not Found"
    '113cd5e4-b193-4f13-add1-ab87a50751ed'  -- "Randox Health"
  );

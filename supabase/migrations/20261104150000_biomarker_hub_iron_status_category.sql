-- Fix brief 2026-11-03, point 2: core iron markers sit under the wrong
-- consumer category in biomarker_hub. biomarker_library_public shows
-- coalesce(category_consumer, category), so the library filed Ferritin under
-- Haematology, Iron under Vitamins, "Iron stores (Ferritin)" under Bone Health
-- and TIBC under Iron & Nutrients, apart from Serum Iron and Transferrin.
--
-- Move all seven to 'Iron Status', the label the other iron markers use. The
-- site maps 'Iron Status' to its "Iron" group in
-- src/components/biomarker-library/biomarker-categories.ts, which also carries
-- slug overrides so the page is right before this runs.
--
-- Rows are matched by id and name, so a renamed or re-keyed row is skipped
-- rather than overwritten. Re-running is a no-op.

update public.biomarker_hub
set category_consumer = 'Iron Status',
    last_updated = now()
where status = 'active'
  and coalesce(category_consumer, '') <> 'Iron Status'
  and (id, name) in (
    ('672fe286-7c9a-4fb2-8988-a199ad2e4a10'::uuid, 'Ferritin'),
    ('ff900263-593a-439c-b3ad-0c61f3c29572'::uuid, 'Iron stores (Ferritin)'),
    ('0dfa9c19-6350-4517-87b4-323ee295a184'::uuid, 'Iron'),
    ('467ebcac-0b05-44ad-b022-9cf93db9ffee'::uuid, 'Serum Iron'),
    ('269cfda9-f473-4c0a-9ced-cd1944138fa2'::uuid, 'Transferrin'),
    ('13158cb7-f26e-4169-9b61-4c8ad5c85060'::uuid, 'Transferrin Saturation'),
    ('05d5ad44-7a64-4bb4-bf04-86588f191e7e'::uuid, 'TIBC (Total Iron-Binding Capacity)')
  );

alter table provider_tests
  add column if not exists image_is_stock boolean not null default false;

comment on column provider_tests.image_is_stock is
  'true when image_url points at a generic on-brand stock photo (no real per-test photo was available from the provider), so a future real-image sync can tell these apart and prefer a real photo once one becomes available.';
-- Take Medichecks' collection-method add-ons off the site.
--
-- Medichecks sells sample collection as separate Shopify products (nurse
-- visit £59, partner clinic £35, urine in-store £30, urine nurse visit £55).
-- They are fees on top of a test, not tests, but four were listed as active
-- tests. The blood collection fees (£35 clinic, £59 nurse) already show on
-- each blood test through clinic_phlebotomy_cost and home_phlebotomy_cost.
-- mhc-medichecks-sync now skips these products and deactivates their rows on
-- every run; this applies the same change now instead of waiting for the
-- next sync.
update public.provider_tests
set is_active = false,
    updated_at = now()
where provider_id = 'medichecks'
  and url like 'https://www.medichecks.com/products/collection-method-%'
  and is_active;

-- Platform screening 22 Nov 2026: Lola's ESR product page
-- (https://lolahealth.com/products/auto-immunity-monitoring) now redirects
-- to the Lola homepage for UK visitors (checked from eu-west-2 via pg_net),
-- so the listing's Book button sent people to a page with no test on it.
-- The Lola sync stopped refreshing this row on 20 Nov, when the product left
-- Lola's UK feed. Hidden the same way reconcile_delisted_provider_tests()
-- hides a delisted test, and logged so the change can be traced.
with upd as (
  update public.provider_tests pt
  set is_active = false,
      url_verified = false,
      url_verified_at = now(),
      data_status = 'stale',
      updated_at = now()
  where pt.provider_id = 'lola-health'
    and pt.url = 'https://lolahealth.com/products/auto-immunity-monitoring'
    and pt.is_active
  returning pt.id, pt.test_name, pt.price, pt.url
)
insert into public.product_change_log (provider_test_id, provider_id, change_type, old_value, new_value, changed_by)
select upd.id::text, 'lola-health', 'delisted_manual',
       jsonb_build_object('is_active', true, 'test_name', upd.test_name, 'price', upd.price, 'url', upd.url),
       jsonb_build_object('is_active', false, 'reason', 'product page redirects to the provider homepage (platform screening 2026-11-22)'),
       'platform_screening_2026_11_22'
from upd;

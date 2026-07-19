## What happened

I kept triggering authorisation prompts because I split the live data correction into too many separate database write calls. That was the wrong workflow. The correction should have been batched into one operation, then verified with read-only checks.

## Current fix status

Already done:
- Updated `refresh-live-comparison-panels` so it no longer scrapes the first visible `£` price from provider pages.
- Deployed the edge function.
- The function now calculates live-panel prices from `provider_tests`, including mandatory in-clinic collection fees where applicable.
- CliniLabs testosterone should now calculate as:
  - base test price: `£19`
  - mandatory in-clinic collection fee: `£30`
  - displayed in-clinic total: `£49`

## Remaining work

When you approve this, I will finish in one clean pass:

1. Run one read-only audit of `live_comparison_panels`.
2. If any rows are still wrong, run one single batched database correction only.
3. Verify:
   - CliniLabs in-clinic testosterone displays `£49`, not `£19`.
   - No mixed at-home/in-clinic rows remain in a panel.
   - No duplicate provider rows remain in a panel.
   - No `walk-in`, `walk in`, or `clinic-based` wording remains.
4. Verify the homepage live comparison card in the browser.
5. Stop — no repeated DB prompts.

## Technical detail

The root issue is that the live comparison JSON stored `row.price` as the raw product price. For in-clinic tests, that ignored required provider fees already stored in `provider_tests.collection_fee_amount`.

The correct source of truth is:

```text
provider_tests.price
+ mandatory collection fee for the selected collection method
+ required clinical review fee, if applicable
```

The edge function has been changed to use that model.
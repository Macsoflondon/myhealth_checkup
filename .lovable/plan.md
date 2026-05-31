## Change to `src/components/sections/DreamHealthShowcase.tsx`

Add a provider allowlist filter inside the `orderedTests` `useMemo` so only the five approved providers appear in the "Our Partners' Most Popular Tests" carousel and grid:

```ts
const ALLOWED_PROVIDERS = new Set([
  "lola-health",
  "goodbody-clinic",
  "medichecks",
  "randox",
  "london-medical-laboratory",
]);
```

Apply it right after the existing `valid` filter (line 78–80), before the lola-cardiovascular filter:

```ts
const allowed = valid.filter((t) => ALLOWED_PROVIDERS.has(t.provider_id));
```

Then thread `allowed` into the existing `filtered` step. Everything downstream (dedupe, 3-per-provider cap, interleave, slice(0,9)) keeps working unchanged.

## Out of scope
- Other sections (header carousel, comparison pages, provider catalog) — they keep showing all 9 providers.
- Provider definitions in `src/constants/providers.ts` — untouched.
- No DB changes.

## Verification
Reload `/`, scroll to "Our Partners' Most Popular Tests" — only Lola Health, Goodbody, Medichecks, Randox, and London Medical Laboratory test cards appear in the filmstrip and 9-card grid.

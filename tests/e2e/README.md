# E2E tests

Playwright suite. Requires the dev server running on `http://localhost:8080`
(override with `PLAYWRIGHT_BASE_URL`).

```bash
bun add -d @playwright/test
bunx playwright install chromium
bunx playwright test          # runs tests/e2e/*.spec.ts
python3 tests/e2e/verify-subcategories.py   # full-sweep audit across every subcategory route
```

`subcategory-nav.spec.ts` exercises the toolbar dropdown (desktop) and
drawer (mobile) flows for a representative fixture set and asserts
title / canonical / og:url / BreadcrumbList JSON-LD.

`verify-subcategories.py` sweeps **every** `?subcategory=` route parsed
from `src/components/header/NavigationItems.tsx` on both viewports and
prints a pass/fail table.

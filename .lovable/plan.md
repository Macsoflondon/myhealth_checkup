## Goal

Make every `/provider/:providerId` page render in the exact order shown in the screenshots:

1. **SS1** — Hero (branded gradient + What Sets Us Apart + Trust & Accreditation strip)
2. **SS2** — Contact Information + Service Information + Why Choose {provider}
3. **SS3** — Tests from {provider} (the existing `ProviderTestsGrid`)

Then retire the two standalone tests-catalog pages without breaking any inbound links.

## Current state (verified in `src/pages/ProviderProfilePage.tsx`)

Sections currently render in this order:
- Hero (line ~108)
- Trust & Accreditation (line ~317)
- **`ProviderTestsGrid`** (line 352)  ← must move DOWN
- **Contact Information** (line 358)  ← must move UP
- **Service Information** (line 400)  ← must move UP
- **Why Choose {provider}** (line 447)  ← must move UP

Two obsolete routes exist in `src/routes/featureRoutes.tsx`:
- `/provider/:providerId/tests` → `ProviderTestCatalogPage`
- `/providers/<slug>` (×8 hard-coded) → `ProviderTestsCatalogPage`

Both render a full-page tests grid that duplicates what `ProviderTestsGrid` already shows on the profile page.

## Changes

### 1. `src/pages/ProviderProfilePage.tsx` — swap two blocks

Move the `ProviderTestsGrid` render (currently ~line 352) to sit **after** the Contact / Service / Why Choose grid block ends (currently ~line 470s). Net effect:

```text
Hero + What Sets Us Apart + Trust & Accreditation   (unchanged)
Contact Information + Service Information + Why Choose   (moved up)
Tests from {provider}   (ProviderTestsGrid, moved down)
```

No copy, styling, data, or component internals change — this is a pure block reorder inside the same JSX tree. Goodbody rolls out first (verify visually), then applies to all providers because they share this template.

### 2. Redirect the two obsolete routes (files kept, per user instruction)

In `src/routes/featureRoutes.tsx`, replace the element for these routes with a `<Navigate to="/provider/<id>" replace />`:

- `/provider/:providerId/tests` → redirects to `/provider/:providerId`
- All 8 `/providers/<slug>` routes → redirect to `/provider/<slug>`

The page component files (`ProviderTestCatalogPage.tsx`, `ProviderTestsCatalogPage.tsx`) stay on disk untouched — nothing that imports them breaks, and they can be revived later if needed. Any existing internal `<Link>` / SEO / sitemap references keep resolving because the URL still responds, just with a 200 → client-side redirect to the profile page.

### 3. No changes to

- Individual test detail pages (`/provider/:providerId/tests/:testId`, `ProviderTestDetailTemplate`) — kept as-is per your clarification.
- Provider data, scrapers, `ProviderTestsGrid` component, or any test-card styling.
- Header, footer, i18n, or SEO metadata on the profile page.

## Verification (Goodbody first, then remaining 8 providers)

Using Playwright at 375 / 768 / 1280 px:

1. Load `/provider/goodbody-clinic` and screenshot — confirm order matches SS1 → SS2 → SS3.
2. Load `/provider/goodbody-clinic/tests` — confirm it redirects to `/provider/goodbody-clinic`.
3. Load `/providers/goodbody-clinic` — confirm it redirects to `/provider/goodbody-clinic`.
4. Once Goodbody is signed off, sweep the other 8 provider IDs at desktop only for the same three checks (single Playwright run, parallel pages).
5. Run `tsgo` and `npm run build` to confirm no broken imports.

## Sub-agent plan

Because the actual code change is one file reorder + one routes-file edit, the honest answer is this doesn't need a swarm — one focused pass does it safely. I'll use **two** parallel sub-agents only for verification, not implementation:

- **Agent A** — Playwright sweep across all 9 providers at 3 viewports, returning a pass/fail matrix + screenshots.
- **Agent B** — grep the codebase for any remaining hard-coded links to `/providers/<slug>` or `/provider/<id>/tests` and report them so we know the redirects are catching every entry point.

Spawning more agents on a two-file change would create merge conflicts and defeat the point.

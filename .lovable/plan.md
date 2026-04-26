# Full System Debug & Security Review

## What's actually broken right now

The preview is showing **"Something went wrong"** because of this runtime error:

> `Failed to fetch dynamically imported module: …/PartnerShowcaseGrid.tsx`

### Root cause

Earlier in this session the WebP migration deleted `myhealth-mobile-logo.png`, `myhealth-logo-cropped.png`, `header-tagline.png`, etc. `Header.tsx` was updated to point at the new `.webp` files **but the dev server's module graph kept failing to pre-transform** while the fix was being applied:

```
[vite] Internal server error: Failed to resolve import "@/assets/myhealth-mobile-logo.png" from "src/components/layout/Header.tsx"
```

The current files on disk are correct (all imports point at existing `.webp` assets — I verified). But Vite's in-memory module graph for that browser session is poisoned, so every lazy chunk in `Index.tsx` (`PartnerShowcaseGrid`, `MissionSection`, etc.) fails its dynamic import and the `ErrorBoundary` swallows the entire page.

### Verified-clean state of the codebase
- `src/components/layout/Header.tsx` → all 3 logo imports use `.webp` ✓
- `src/components/layout/Footer.tsx` → `.webp` ✓
- `src/components/header/Logo.tsx` → `.webp` ✓
- `src/components/sections/Hero.tsx` → 5 hero `.webp` imports all exist ✓
- `public/images/tests/` → 43 `.webp`, 0 `.png` ✓
- `GoodbodyTestGallery.tsx` → all `/images/tests/*.webp` references match ✓
- No remaining `.png` imports referencing deleted assets ✓

So **no code changes are needed to fix the crash** — the dev server just needs a clean restart to rebuild its module graph.

---

## Plan

### 1. Force a Vite dev-server restart to clear the poisoned module graph
- Touch `vite.config.ts` (a no-op whitespace edit triggers `[vite] vite.config.ts changed, restarting server...`).
- This forces Vite to rebuild its dependency graph from scratch and the dynamic imports will succeed.

### 2. Fix the one real security finding: `VITE_ENCRYPTION_KEY` naming risk
The agent security scanner flagged a **WARN-level** issue:

> `supabase/functions/encrypt-sensitive-data/index.ts:22` falls back to `Deno.env.get('VITE_ENCRYPTION_KEY')`. Any `VITE_*` variable Vite finds in `.env` is bundled into the **client JS** — meaning if anyone ever sets that secret locally, the AES-GCM key ships to every visitor's browser.

Fix:
- Edit the edge function to **only** read `ENCRYPTION_KEY` (drop the `VITE_` fallback).
- Update `src/services/__tests__/EncryptionService.test.ts` `vi.stubEnv()` calls to use `ENCRYPTION_KEY`.
- The Supabase secret is already named `VITE_ENCRYPTION_KEY` in this project — I'll add a new `ENCRYPTION_KEY` secret (same value) and the user can delete the old `VITE_` one once verified.

### 3. Document the rest of the security posture (no code changes — just for the user's awareness)

**Agent scanner findings (besides #2 above):** all 6 other findings are `info`-level and already marked as ignored / verified-secure:
- ✓ Console logging — no sensitive data found
- ✓ Edge function input validation — comprehensive
- ✓ Rate limiting — DB-backed for `lml-nearest`, AI Gateway for the rest
- ✓ `SECURITY DEFINER` functions — fixed `search_path`, no dynamic SQL
- ✓ Client-side role checks — UI only, server-side enforced via `has_role()`
- ✓ Storage buckets (`videos`, `test-results`) — private, owner-folder RLS

**Aikido pentest:** zero findings.

**Supabase linter:** 32 WARN entries — **all 32 are the same advisory** (`pg_graphql Anon Role Exposes Objects in Introspection`). This is the public catalogue tables (clinics, tests, biomarkers, prices) being discoverable via `/graphql/v1` introspection. Since these are intentionally public read-only catalogue data with no PII, this is expected behaviour — **no action required**, but worth noting.

**Database:** 30 tables, 95 RLS policies, all enabled. Storage private. PII fields encrypted server-side with `enc:` prefix trigger guard.

---

## Files to be edited

1. `vite.config.ts` — trivial whitespace touch to force server restart
2. `supabase/functions/encrypt-sensitive-data/index.ts` — remove `VITE_ENCRYPTION_KEY` fallback
3. `src/services/__tests__/EncryptionService.test.ts` — update env stub name
4. Supabase secret — add `ENCRYPTION_KEY` (same value as existing `VITE_ENCRYPTION_KEY`)

## What I am NOT changing
- No image references — all are correct
- No RLS policies — all 95 verified
- No edge function logic beyond the one secret rename
- No CSP / headers — current setup is solid (CSP in report-only is the right monitoring phase)


The user wants to:
1. Replace the Thriva logo across the platform with the uploaded `Thrivalogo.png`.
2. Tighten the padding/zoom so the logo mirrors how the Medichecks logo is rendered (which uses `scale-125` in `AccreditedProvidersBar` to fill its container).

**Investigation findings:**
- Thriva logo is referenced in 3 places:
  - `src/components/providers/ProviderLogo.tsx` → `/lovable-uploads/provider-thriva.png`
  - `src/constants/providers.ts` → `PROVIDER_LOGOS['thriva']` → `/lovable-uploads/provider-thriva.png`
  - `src/utils/providerUtils.ts` → external Thriva CDN URL
- `AccreditedProvidersBar.tsx` applies `scale-125` only to Medichecks. Thriva needs the same treatment to match the tightness.
- The uploaded image has substantial whitespace padding around the logo mark itself, so I'll trim it during the copy step (or apply `scale-125` consistently and rely on object-contain).
- DB: I'll check `provider_tests`/providers tables to see if any logo URL is stored DB-side that needs updating too.

## Plan

1. **Copy new asset**: `lov-copy user-uploads://Thrivalogo.png public/lovable-uploads/provider-thriva.png` (overwrites the existing file — every consumer using `/lovable-uploads/provider-thriva.png` updates automatically).

2. **Update `AccreditedProvidersBar.tsx`**: extend the `scale-125` rule to Thriva so it visually matches Medichecks' tightness:
   ```tsx
   className={`max-h-full max-w-full object-contain ${(id === 'medichecks' || id === 'thriva') ? 'scale-125' : ''}`}
   ```

3. **Update `ProviderLogo.tsx`**: no path change needed (already points to `/lovable-uploads/provider-thriva.png`), but confirm consumers like `FeaturedProviders` render it cleanly in their `p-3` container.

4. **Check & update DB**: query `providers` / `provider_tests` for any stored `logo_url` referencing the old Thriva CDN. If found, write a migration to update to `/lovable-uploads/provider-thriva.png`.

5. **Update `src/utils/providerUtils.ts`**: replace the external Thriva CDN URL with the local path for consistency (avoids broken external links).

6. **Verify**: navigate to `/` and `/provider/thriva` to visually confirm tighter logo rendering matches Medichecks.

No component refactors needed — single asset swap + scale tweak + optional DB sync.

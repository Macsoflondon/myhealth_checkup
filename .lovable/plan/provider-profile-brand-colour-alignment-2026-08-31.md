# Provider profile: brand colour alignment

## What changes

The "Trust & Accreditation" band on provider profile pages currently uses each provider's `primary` colour — the colour at the *far end* of the hero gradient (red for Medical Diagnosis, green for Clinilabs). You want it to use the colour sitting behind the logo at the *start* of the hero gradient (teal for Medical Diagnosis, blue for Clinilabs).

- Switch the trust band background from `brand.primary` to `brand.accent`, so it always echoes the logo-side colour of the hero.
- Keep the white heading, white shadow ring and white inner cards exactly as they are — contrast stays correct because accents are dark saturated tones.
- Apply the same accent-first treatment to the "Browse all tests" button on the provider profile, so the CTA matches the band rather than clashing with it.

## Technical detail

- `src/pages/ProviderProfilePage.tsx` (Trust Signals banner, around line 217): `backgroundColor: brand.primary` becomes `brand.accent`; the no-brand fallback stays on the theme primary token.
- Same file: the provider CTA button gets an inline `backgroundColor: brand.accent` with white foreground when a brand exists, falling back to the existing variant otherwise.
- No changes to `src/data/providerBranding.ts` — every provider already defines an `accent`, so this works across all 8 profiles without per-provider edits.

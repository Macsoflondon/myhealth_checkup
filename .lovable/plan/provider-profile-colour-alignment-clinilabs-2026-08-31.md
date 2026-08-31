# Provider profile: colour alignment (Clinilabs)

Goal: the "Trust & Accreditation" band on provider profiles should sit in the blue/teal family that surrounds the logo, not the orange-red. For Clinilabs specifically: mostly `#1565C0`, with `#2E7D32` used sparingly as an accent.

## What changes

1. **Trust & Accreditation band** (`src/pages/ProviderProfilePage.tsx`)
   - Background switches from `brand.primary` to `brand.accent`, so it picks up the logo-side colour for every provider.
   - Add a thin left/top rule in `brand.primary` (the small green hit for Clinilabs) so the second brand colour is still present but subordinate.
   - Keep the heading, shield icon and clock icon white; the inner white cards stay as they are for contrast.

2. **Clinilabs brand tokens** (`src/data/providerBranding.ts`)
   - Confirm `primary: #2E7D32`, `accent: #1565C0`, and matching `primaryLight` / `accentLight`. Already set — no change expected, verified during implementation.

3. **Provider CTA button** on the profile hero
   - Where the provider brand exists, the primary CTA uses `brand.accent` as the fill with white text, matching the new band, rather than the previous red-leaning primary.

## Technical notes

- Colours stay driven by `getBranding(provider.name)`; no hardcoded hex in the page.
- Contrast check: white text on `#1565C0` and `#2E7D32` both clear WCAG AA at the sizes used.
- No data, routing or business-logic changes — presentation only.

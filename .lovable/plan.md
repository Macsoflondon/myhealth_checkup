

## Brand-colored "Why Choose" feature cards for each provider

### Problem
The "Why Choose [Provider]?" card on provider profile pages currently uses a hardcoded green color scheme (`#f0fdf4` background, `#16a34a` icons) for all providers. Some features are also conditional on data fields existing, meaning not all providers show all six items.

### Changes

**File: `src/pages/ProviderProfilePage.tsx` (lines 447-493)**

Replace the current conditional feature grid with a fixed six-item grid that always renders all six features, using the provider's brand `primary` color from `providerBranding.ts`:

1. Derive `featureColor` and `featureBg` from `brand.primary` (with `1A` alpha suffix for backgrounds). Fall back to Goodbody green (`#16a34a` / `#f0fdf4`) if no branding exists.
2. Remove all conditionals (`provider.accreditation &&`, `provider.clinics &&`, `provider.phone &&`, `provider.email &&`) so every provider always shows all six items:
   - Fully Accredited Labs (Shield icon)
   - Multiple Locations (MapPin icon)
   - Phone Support (Phone icon)
   - Email Support (Mail icon)
   - Doctor Reviewed Results (Award icon)
   - Fast Turnaround (Clock icon)
3. Apply `featureColor` to icons and `featureBg` to the rounded-lg background of each item.

### Result
- Goodbody stays green (its brand primary is `#009B8D`, close to green)
- Medichecks features will be pink-tinted
- Randox will be blue-tinted
- Each provider gets its own branded color scheme
- All six features always appear on every provider page


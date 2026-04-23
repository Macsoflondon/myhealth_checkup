

## Add white padding around Goodbody, Thriva and Randox logos in the Trusted Partners carousel

### Problem
In the homepage `PartnersGrid` carousel, all logos render with `max-h-[90px] sm:max-h-[120px]` inside a `h-32 sm:h-40` white card. The Medichecks asset (`provider-medichecks-light.png`) has built-in transparent padding around the wordmark, so it visually breathes inside the card. Goodbody (`provider-goodbody-new-v3.png`), Thriva (`provider-thriva.png`) and Randox (`provider-randox.png`) are tightly cropped to the artwork, so the same max-height makes them touch the card edges and look clipped.

We will not re-crop the source assets. Instead we will reduce the rendered max-height for those three providers so the white card itself supplies consistent padding around the logo — matching Medichecks' visual weight.

### Change

**File:** `src/components/sections/PartnersGrid.tsx` (around lines 103–128)

Replace the single hard-coded `max-h-[90px] sm:max-h-[120px]` with a per-provider lookup that gives the tightly-cropped logos a smaller cap:

```tsx
const LOGO_SIZE: Record<string, string> = {
  // Tightly cropped assets — render smaller so the white card pads them
  'goodbody-clinic': 'max-h-[64px] sm:max-h-[84px]',
  'thriva':          'max-h-[64px] sm:max-h-[84px]',
  'randox':          'max-h-[64px] sm:max-h-[84px]',
};
const DEFAULT_LOGO_SIZE = 'max-h-[90px] sm:max-h-[120px]';
```

Then in the map:
```tsx
className={`w-auto object-contain transition-all duration-300 group-hover:scale-110 ${
  LOGO_SIZE[provider.id] ?? DEFAULT_LOGO_SIZE
}`}
```

Also remove the now-unused `isGoodbody` line.

### Result
- Medichecks, Lola Health, London Medical Lab, London Health Company, Medical Diagnosis, Clinilabs: unchanged (`max-h-[90px]/[120px]`).
- Goodbody, Thriva, Randox: capped at `max-h-[64px]/[84px]`, giving each ~20–28px of visible white padding on every side of the card — matching Medichecks' breathing room and stopping the apparent clipping.
- No asset changes, no card-size changes, no carousel-logic changes.


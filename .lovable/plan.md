## Goal

Move the "All listed providers meet every one of the following standards" bar (currently sitting further down the homepage, rendered by `StatsBand` via `AccreditedProvidersBar`) to sit **directly under the hero video**, replacing the current navy emoji trust strip. Keep the pill-icon style of that standards bar and fold the emoji-bar items into its list so nothing is lost.

## Changes

**1. `src/components/sections/AccreditedProvidersBar.tsx`** — extend `trustItems` with the two labels from the old emoji bar that aren't already represented. UKAS-Accredited Labs and CQC-Regulated Clinics already cover "UKAS Accredited Labs" and "CQC Registered Providers", so only two are new:

```ts
const trustItems: TrustItem[] = [
  { icon: FlaskConical, label: "UKAS-Accredited Labs" },
  { icon: ShieldCheck,  label: "CQC-Regulated Clinics" },
  { icon: BadgeCheck,   label: "ISO 15189 Certification" },
  { icon: Lock,         label: "GDPR Compliant" },
  { icon: Tag,          label: "Transparent Pricing" },
  { icon: Stethoscope,  label: "No GP Referral Needed" },
  { icon: ShieldLock,   label: "Data Never Shared" },    // new (uses ShieldLock or Lock alt)
  { icon: Star,         label: "Trusted Comparison" },   // new
];
```

Icon choices: `Lock` is already used for GDPR — use `EyeOff` (or `ShieldOff`) for "Data Never Shared" to keep each icon distinct, and `Star` for "Trusted Comparison". Style, colours (alternating turquoise/pink pills), typography and marquee behaviour stay exactly as-is.

**2. `src/pages/Index.tsx`** — delete the `TRUST_ITEMS` constant and the navy `#081129` emoji strip block. In its place, render the standards bar directly under the hero:

```tsx
<HeroMasthead />

<Suspense fallback={<SectionFallback />}>
  <AccreditedProvidersBar />
</Suspense>

<BrowseByCategoryBar compact placement="hero" />
```

The `AccreditedProvidersBar` lazy import already exists at the top of `Index.tsx` — no new import needed.

**3. `src/components/sections/StatsBand.tsx`** — remove the `<AccreditedProvidersBar />` render (and its import) so the bar isn't duplicated on the page. Leave the rest of `StatsBand` untouched.

## Out of scope

- No copy edits to the heading text or the six existing item labels.
- No changes to hero video, category bar, AI quiz section, or any section below `StatsBand`.
- No changes to `MainLayout`'s use of `AccreditedProvidersBar` on non-home routes.

## Verify

Playwright screenshot at 390px and 1440px confirming: hero → standards bar (with heading + 8 pill items, mobile marquee still scrolling) → category bar → AI quiz, and the bar no longer appears again inside `StatsBand`.



## Plan: Homepage Desktop Refinements

### 1. Shrink Desktop Header Padding
**File:** `src/components/layout/Header.tsx`
- Reduce vertical padding around the logo area. Currently `py-1 lg:py-1.5` on the flex container. Will reduce top/bottom padding so the header is ~3 lines shorter while keeping logo and button sizes unchanged. Target: `pt-0 pb-0` or minimal padding, letting the logo's own height define the bar.

### 2. "Most Popular Tests" Nav Button — Remove Pink Background
**File:** `src/components/header/NavigationMenu.tsx`
- The `highlighted` flag on "Most Popular Tests" applies `text-brand-pink bg-brand-pink/10` (pink tinted background). Change to `text-brand-pink bg-transparent` so the text stays pink but the button background is clear/transparent.

### 3. Hero Headline — Force Two Lines on Desktop
**File:** `src/components/sections/Hero.tsx`
- Currently the headline is a single `<span className="block">` containing "Compare the UK's leading private health test providers" which wraps based on viewport width. Will split into two explicit lines:
  - Line 1: "Compare the UK's leading"
  - Line 2: "private health test providers"
- Keep the turquoise divider and "All in one place!" below as-is.

### 4. Trust Signals Bar — White Background
**File:** `src/components/sections/Hero.tsx`
- Change the trust signals section background from `bg-[#f0fafb]` (light blue tint) to `bg-white`.

### 5. Journey Simplified — Bolder Body Text
**File:** `src/components/sections/JourneySimplified.tsx`
- Change description text from `text-muted-foreground` to `text-foreground font-medium` for the step descriptions and the intro paragraph, making them more readable.

### 6. Partners Grid — Add "Why Trust Us" Style Label
**File:** `src/components/sections/PartnersGrid.tsx`
- Add a small turquoise label above the "Our Trusted Partners" heading, matching the style used in TrustPlatformSection: horizontal lines flanking uppercase text like "Accredited & Verified" or "Handpicked for Quality".

### 7. Partners Grid — Speed Up Carousel
**File:** `src/components/sections/PartnersGrid.tsx`
- Increase scroll speed from `0.4` to `0.8` (double speed).

### 8. TrustPlatformSection — Bolder, Whiter Text
**File:** `src/components/sections/TrustPlatformSection.tsx`
- Change subtitle paragraph from `text-white/60` to `text-white font-medium`.
- Change feature card descriptions from `text-white/60` to `text-white/90` for brighter readability.
- Change feature card titles from `text-white` (already white) — confirm they stay bright.

### Files Changed
- `src/components/layout/Header.tsx`
- `src/components/header/NavigationMenu.tsx`
- `src/components/sections/Hero.tsx`
- `src/components/sections/JourneySimplified.tsx`
- `src/components/sections/PartnersGrid.tsx`
- `src/components/sections/TrustPlatformSection.tsx`


## What the screenshots actually show

Sequence 1–9 is one scroll animation of a stacked deck of **tilted device mockup cards** (screenshots of real websites — Kora, KYMA, Mugen, Axiom), not emoji info tiles.

- **Frames 1–2**: hero state. The deck sits to the right of the headline as a fanned stack — one card front-and-centre (Kora — turquoise/orange flower screenshot inside an iMac-style frame), others tilted/peeking behind it at small rotations.
- **Frames 3–5**: as the user scrolls, the deck slides down and grows. Cards spread apart, rotations exaggerate, more of each mockup is revealed.
- **Frames 6–7**: deck fully expanded into two large side-by-side device mockups (Kora + KYMA), each labelled underneath with project name + "View Project".
- **Frames 8–9**: locks into a clean **2×2 grid of four device-mockup cards** (Kora, KYMA, Mugen, Axiom) — each card is a real website screenshot rendered inside a rounded device frame, with a title + subtitle + "View Project" link below.

So "the four cards" = four real test/provider screenshots displayed as tilted device mockups, animating from a fanned hero stack → expanded 2×2 grid as the user scrolls.

What I shipped (emoji + "Blood Tests / Cancer Screening / Wellness / Hormones" text tiles) is wrong on every axis: wrong content, wrong visual, no animation, no scroll choreography.

## Mapped to myHealthCheckup

Four test/provider screenshot cards:
1. Medichecks — Advanced Well Woman panel
2. Goodbody Clinic — full body MOT
3. London Medical Laboratory — hormone panel
4. Randox Health / Lola — Cancer screening panel

Each rendered as a real screenshot/branded panel inside a rounded "device" frame with subtle shadow + 3D tilt.

## Plan

### 1. Source the four card visuals
Use the existing provider test screenshots/branded panels already in the project where available (PROVIDER_LOGOS + realProviderData). For any missing, generate four branded test-card visuals (1600×1000) styled as a clean test/result page mockup with provider logo + test name + price + biomarker chips — same visual register as the LaunchFolio Kora/KYMA mockups but health-test themed.

### 2. New component: `HeroTiltedDeck.tsx`
Replaces the current 2×2 emoji grid on the right side of the hero.

Structure:
```text
<HeroTiltedDeck>
  ├─ card 1 (Kora-equivalent) — front, centred, rotate -2deg
  ├─ card 2 — behind-left, rotate -8deg, translateX(-30%)
  ├─ card 3 — behind-right, rotate +6deg, translateX(+25%)
  └─ card 4 — far back, rotate +12deg, translateX(+40%), scale .9
```

Each card = rounded-2xl wrapper, soft drop shadow, subtle inner ring, full-bleed screenshot inside. `perspective: 1200px` on container, `transform-style: preserve-3d` on cards.

### 3. Scroll-driven choreography
Use `useScroll` + `useTransform` from `framer-motion` (already in the project) bound to the hero section.

- 0% scroll progress → fanned stack (hero state, frames 1–2)
- 30% → cards drift apart, rotations relax toward 0
- 60% → two large mockups side-by-side (frames 6–7)
- 100% → final 2×2 grid (frames 8–9), each card gets its title + "View Project" caption fading in

The grid endpoint lives in a sibling section below the hero so scroll naturally lands on it. The deck itself animates from `position: absolute` in the hero to laying out as a grid via transform values — no layout thrash, GPU-only transforms.

### 4. Below-the-fold grid
Add `FeaturedTestsGrid.tsx` immediately under the hero — the resting state for the deck. 2 cols on desktop, 1 col on mobile. Each card: device-framed screenshot + project name + tagline + "View Test →" linking to the real test detail route.

### 5. Mobile
Disable the scroll choreography under `lg`. On mobile show a static fanned stack in the hero (3 cards visible, slight rotation) and a vertical stack of full-width device cards below — matches the spirit of the reference without trying to do parallax on a phone.

### 6. Clean up
- Remove the emoji `CARDS` array + the right-hand 2×2 grid from `HeroMasthead.tsx`.
- Keep the urgency pill, headline, subhead, CTAs, social proof, and provider marquee untouched.
- Reduce hero right-column min-height so the fanned deck has breathing room.

### 7. Verification
- Run Playwright: scroll the homepage from 0 → 2000px in 6 steps, screenshot each, confirm visual progression matches frames 1, 3, 5, 7, 9.
- Mobile viewport (375×812) screenshot to confirm static layout.
- Build passes, no console errors.

## Technical notes

- `framer-motion` `useScroll({ target: heroRef, offset: ["start start", "end start"] })` for scroll progress 0→1 scoped to the hero, then a sibling tracker for 1→2 covering the resting grid.
- Use `useTransform` arrays to interpolate `rotate`, `x`, `y`, `scale` per card across keyframes.
- `will-change: transform` on each card; throttle by relying on framer-motion's RAF.
- Asset pipeline: any newly generated mockup PNGs go through `lovable-assets create` → `src/assets/*.asset.json` so they CDN-serve.

## Files

- **New**: `src/components/sections/HeroTiltedDeck.tsx`, `src/components/sections/FeaturedTestsGrid.tsx`
- **Modified**: `src/components/sections/HeroMasthead.tsx` (remove emoji grid, slot in `HeroTiltedDeck`), `src/pages/Index.tsx` (mount `FeaturedTestsGrid` directly under hero, inside the same sticky scope so scroll choreography reads continuously)
- **Possibly new assets**: `src/assets/hero-deck/{medichecks,goodbody,lml,randox}.png.asset.json` if existing provider imagery is too small/low-fidelity for the device-frame treatment

## Open questions before I build

1. Should the four cards be **real provider test screenshots** (pulled from `realTestData` + provider logos) or **generated branded mockups** in the LaunchFolio aesthetic?
2. Click target on each card — open the test detail modal, or route to the provider's test page?
3. Keep the provider logo marquee + social proof from the current hero, or do you want those removed too while we rework this section?

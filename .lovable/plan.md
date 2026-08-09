# Reduce trusted-platform caption to one line and verify breakpoint parity

## What we are changing
The caption "Your trusted platform for comparing private health and screening tests." in the white standards bar currently wraps onto two lines at desktop widths. We will shrink its desktop font size just enough to keep it on a single line, while preserving the same responsive scale as the hero slogan "Your health. Your choice." on mobile and tablet.

## Steps

1. **Adjust caption font size in `src/components/sections/AccreditedProvidersBar.tsx`**
   - Keep the mobile (`text-[clamp(1.05rem,5vw,1.9rem)]`) and tablet/sm (`sm:text-[clamp(1.3rem,3.4vw,...)`) clamp expressions identical to the hero slogan in `HeroMasthead.tsx` so sizing remains matched at those breakpoints.
   - Lower only the desktop upper bound of the `sm:` clamp so the full caption fits on one line within the container at ~1900 px viewport (e.g., from `2.65rem` to roughly `2.05rem–2.15rem`).
   - Add `whitespace-nowrap` at `sm:` and above to enforce the single-line behaviour on desktop/tablet; allow natural wrapping on mobile only.

2. **Verify visual fit across breakpoints**
   - Capture Playwright screenshots at 375 px, 768 px, and 1920 px viewports on the homepage.
   - Confirm the caption is a single line at 768 px and 1920 px.
   - Confirm it wraps cleanly and remains readable at 375 px.
   - Confirm the caption and slogan computed font sizes are equal at mobile and tablet breakpoints.

3. **Run build/lint checks**
   - Run `npm run build:dev` and `npm run lint` to ensure the Tailwind arbitrary-value classes compile and no lint regressions are introduced.

## Out of scope
- No changes to the hero slogan sizing or wording.
- No changes to the standards badges or section background colour.

# Kill the navy flash on the hero

Two changes so the hero never shows a bare navy box while the first image loads.

## 1. Preload the first slide

The first hero image is a bundled asset, so its final hashed URL is only known at build time. The route that renders the hero adds a `<link rel="preload" as="image" fetchpriority="high">` pointing at that imported URL, so the browser starts fetching it in parallel with the JS bundle instead of after hydration.

## 2. Gradient/blur placeholder behind the image

Until the first slide decodes, the image container shows a soft navy gradient with a tiny blurred version of the photo behind it, instead of flat `#081129`. It cross-fades out the moment the slide paints, so there is no visible pop.

## Technical detail

- `src/routes/index.tsx` (home route): add the preload link via the route `head()` `links` array, using the same `hero-jogging-woman.png` import URL that `HeroMasthead` uses. Move the import into a small shared module (e.g. `src/components/sections/hero-slides.ts`) so route and component agree on one URL and the slide list isn't duplicated.
- `src/components/sections/HeroMasthead.tsx`:
  - Add a `firstLoaded` state, set from the first slide's `onLoad` (plus an `img.complete` check on mount for cached loads).
  - Render an absolutely positioned placeholder div inside the image wrapper, below the slides: a base64 LQIP of the jogging-woman frame as `background-image` with `background-size: cover`, `filter: blur(24px) scale(1.05)`, plus the existing navy gradient over it. Same pattern already used in `src/components/sections/Hero.tsx` (`LQIP_DESKTOP` / `LQIP_MOBILE`).
  - Fade the placeholder out (`opacity-0`, ~400ms) once `firstLoaded` is true; keep it as the SSR/no-JS state so prerendered snapshots also show it rather than flat navy.
  - Keep `loading="eager"` / `fetchPriority="high"` on slide 0 as-is.
- No layout, sizing, or copy changes; slide rotation logic untouched.

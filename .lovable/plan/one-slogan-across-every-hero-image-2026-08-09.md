# One slogan across every hero image

Replace the five rotating captions in the hero image with a single fixed line:

**Your trusted platform for comparing private health and screening tests.**

## What changes

- Same text on every slide — no more rotating labels, so nothing changes as the images cycle.
- Moves from the bottom-left corner to bottom-centre of the hero image.
- The turquoise dot is removed.
- Font size matches the "YOUR HEALTH. YOUR CHOICE." slogan above it.
- The frosted navy pill background stays so the text stays readable over the photos.

## Technical detail

- `src/components/sections/hero-slides.ts`: drop the per-slide `label` field (or leave the type but stop using it) and export a single `HERO_CAPTION` constant with the new copy.
- `src/components/sections/HeroMasthead.tsx`:
  - Replace the `absolute left-[18px] bottom-[18px]` wrapper with a bottom-centred one (`absolute inset-x-0 bottom-4 flex justify-center px-4`, `max-w-[90%]`, centred text).
  - Remove the turquoise dot span and the `key={label-...}` re-mount/fade, since the text no longer changes per slide.
  - Apply the slogan's clamp sizing: `text-[clamp(1.05rem,4.6vw,1.75rem)] sm:text-[clamp(1.25rem,3.2vw,2.5rem)]`, Montserrat, white, keeping the `bg-[#081129]/45 backdrop-blur` pill.
  - Caption stays desktop-only (`hidden lg:block`) as it is today, so the mobile hero is untouched.
- `e2e/hero-mobile-proportions.spec.ts` references the old slide-label strings in its "Slide label bubble" test; update that selector to the new caption (test is mobile-only where the bubble is hidden, so it should be dropped or retargeted).

Plan to adjust hero typography in `src/components/sections/HeroMasthead.tsx`:

1. **Wordmark ("myhealthcheckup")** — Replace the custom `text-[clamp(2.25rem,8vw,4.5rem)]` with the homepage H2 standard scale `text-2xl sm:text-3xl md:text-4xl`. Preserve the brand navy/pink split text colors.

2. **Slogan ("Your health. Your choice. One trusted platform.")** — Apply the same homepage H2 standard scale `text-2xl sm:text-3xl md:text-4xl` to the slogan span, keeping the turquoise/pink brand accent words.

3. **Compare headline** — Increase the current `text-[clamp(2.5rem,12vw,11rem)]` clamp by two standard font sizes: bump the minimum to ~`3.75rem` (two steps up from text-4xl) and the viewport/max values proportionally to maintain dominance over the H2 elements.

4. **Verify** — Run `tsc --noEmit` and capture a homepage preview screenshot to confirm the new hierarchy.
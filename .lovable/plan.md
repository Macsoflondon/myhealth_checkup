Plan to update the HeroMasthead header typography and colours in `src/components/sections/HeroMasthead.tsx`:

1. **Navigation font size** — Match the carousel/ticker text size (`text-xs sm:text-sm md:text-base`). Keep uppercase, bold, and tracking tight. Ensure the non-accent links use navy.
2. **Wordmark size** — Increase the responsive `clamp(...)` by three standard Tailwind sizes, from `clamp(1.25rem, 6.2vw, 2.25rem)` to `clamp(2.25rem, 8vw, 4.5rem)` (min 20px → 36px, max 36px → 72px). Keep Montserrat bold and the split `myhealth`/`checkup` colours.
3. **Slogan size** — Make “Your Health. Your Choice. One Trusted Platform.” match the wordmark size using the same `clamp(...)` value.
4. **Header colour audit** — Convert every non-turquoise / non-pink text in the header section (wordmark “myhealth”, nav links, H1 “Compare.”, and slogan framing words) to `text-brand-navy` (brand navy #081129), preserving the existing turquoise and pink accents.
5. **Verification** — Run `tsc --noEmit` and capture a Playwright desktop + mobile screenshot of the hero header to confirm the sizes and colours look correct.
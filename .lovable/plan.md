# Hero "fits in one screen" sizing

Reference shows the entire hero card visible on load: header, big "Compare." title, tagline, image, footer copy — all above the fold with breathing room on all sides.

Currently the image alone is 700px on desktop, which pushes the footer copy ("One price you can actually trust." row) below the fold.

## Changes — `src/components/sections/HeroMasthead.tsx`

1. **Section sizing** — give the outer `<section>` a `min-h-[100svh]` + flex column so contents distribute vertically and the whole card targets one viewport on load. Keep existing rounded card chrome.

2. **Image height → viewport-relative, capped** — replace the fixed pixel heights with viewport-based + max caps so the image scales down on shorter screens instead of pushing footer off:
   - mobile: `h-[42svh] max-h-[420px]`
   - tablet (`sm`): `h-[44svh] max-h-[460px]`
   - desktop (`md`): `h-[46svh] max-h-[520px]`
   - large (`lg`): `h-[48svh] max-h-[560px]`

3. **Tighten vertical rhythm** so the title still feels huge but the footer copy stays in frame:
   - title top margin `mt-10 → mt-6 md:mt-8`
   - title `mb-3 → mb-2`
   - carousel `my-4 → my-3`
   - footer grid `pt-1.5 → pt-3` and add `mt-auto` so it hugs the bottom of the card

4. **Mobile-specific** — stack tagline row cleanly (already does), keep ad card visible. Logo wordmark stays size; nav links collapse as today.

5. No copy, no colour, no logo, no asset changes. Image `object-position` per-slide CSS vars stay as-is.

## Outcome

On desktop and tablet at typical heights (≥800px), the entire hero card — from `myhealthcheckup` wordmark down to "Results typically in 2–5 working days" — sits within the viewport on load, matching the reference rhythm. On mobile the same balance holds with a slightly shorter image.

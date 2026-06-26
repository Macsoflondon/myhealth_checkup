## Goal
Make `HeroMasthead` and the new mobile language flag render correctly at 360–414px widths — no overflow, balanced type scale, tighter padding, readable slide label.

## Changes

**`src/components/sections/HeroMasthead.tsx`**

1. `Wordmark` — change `text-4xl` to `text-[clamp(1.25rem,6.2vw,2.25rem)]` so "myhealthcheckup" fits on a 360px screen and scales up to current size on tablet+.
2. Section padding/min-height — `px-4 sm:px-6 md:px-9 pt-5 sm:pt-7 pb-4 min-h-[92svh] sm:min-h-[100svh]`.
3. Top border-bottom row — reduce `pb-2` already fine; keep.
4. H1 "Compare." — change clamp floor: `text-[clamp(3.25rem,15vw,11rem)]` with `mb-6 sm:mb-10 mt-2 sm:mt-4`. Stops the giant 80px floor from clipping on 360–390px phones.
5. Slogan span — wrap with `leading-snug` and reduce mobile size: `text-base sm:text-lg`.
6. Hero image wrapper — `my-2 -mx-4 sm:-mx-6 md:-mx-9 min-h-[42svh] sm:min-h-[50svh] md:min-h-[55svh]` so it doesn't gobble the viewport on phones.
7. Slide label bubble — mobile-friendly size + max width: `text-sm sm:text-lg md:text-2xl max-w-[80%] left-3 bottom-3 sm:left-[18px] sm:bottom-[18px] px-2.5 py-1 sm:px-3 sm:py-1.5`.
8. Ticker wrapper — `pt-2 sm:pt-4`.

**`src/components/header/LanguageSwitcher.tsx`** (glass variant only)

- Flag wrapper currently `w-5 h-3.5` causes the emoji to render as a tiny invisible box. Replace with a flexible `inline-flex items-center justify-center min-w-[22px] h-[22px]` and bump the flag emoji to `text-[18px] leading-none`. Keep the soft tile background (`bg-white/60 rounded-[3px] shadow-sm px-1`) so it still reads as a flag chip.

## Out of scope
- No copy/text changes.
- No layout swaps below the hero.
- Desktop hero appearance unchanged (all changes are mobile-up overrides).

## Verification
- Playwright at 360×780, 390×844, 414×896: confirm wordmark, H1, slogan, slide label, and category bar right cluster all render fully without overflow; flag glyph visible inside the pink glass pill.

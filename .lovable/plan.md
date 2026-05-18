## Goal

Tighten the Accredited Providers bar's internal vertical rhythm so its overall height feels in line with the TrustPlatformSection above and the footer below (both use `py-8 sm:py-10 md:py-12`).

## Tuning (single file: `src/components/sections/AccreditedProvidersBar.tsx`)

1. **Eyebrow row (line 29)** — currently `py-4 sm:py-6 md:py-8 lg:py-[30px]` is way too tall and dominates the section. Replace with `py-3 sm:py-4 md:py-5` and tighten gap from `gap-2` → `gap-3` for proper eyebrow proportions.

2. **Heading margin (line 40)** — `mb-4 md:mb-5` is fine but bump to `mb-5 md:mb-6` so the gap to the accreditor row matches the gap below it.

3. **Accreditor row (line 45)** — drop redundant nested flex wrapper (lines 46–58 collapse into the outer flex). Increase `gap-x-6` → `gap-x-8 md:gap-x-10` for better breathing room, and bump `mb-5 md:mb-6` → `mb-6 md:mb-8` to balance against the larger logo row below.

4. **Provider logo grid (line 61)** — tighten gap from `gap-2 md:gap-3` → `gap-3 md:gap-4` for consistent rhythm with other grid sections. Reduce logo container height from `h-[80px] sm:h-[100px]` → `h-[64px] sm:h-[80px]` to bring overall section height closer to neighbour sections.

5. **Tile padding (line 70)** — reduce `p-3 md:p-4` → `p-2.5 md:p-3` to match the tighter logo container.

## Rationale

The outer section is now `py-8/10/12` (matching neighbours), but internal stacking (eyebrow `py-[30px]` + tall logo row `h-[100px]`) inflated total height past adjacent sections. Trimming inner spacing + logo container height brings the section's total visual height in line.

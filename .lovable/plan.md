
The user wants the "Backed by Expert Guidance" section (ExpertQuotes component on the homepage) shrunk by half — keep all content, just reduce its visual footprint.

## Changes to `src/components/sections/ExpertQuotes.tsx`

**Section padding** — halve vertical space:
- `py-8 sm:py-10 md:py-12` → `py-4 sm:py-5 md:py-6`

**Header block** — tighten:
- Header `mb-6 sm:mb-8` → `mb-3 sm:mb-4`
- SVG swoosh `width="80" height="20"` → `width="40" height="10"`, `mb-4` → `mb-2`
- Subtitle `text-sm sm:text-base mt-3` → `text-xs sm:text-sm mt-2`

**Quote cards** — shrink padding and type:
- Card padding `p-6 sm:p-8` → `p-3 sm:p-4`
- Quote icon container `w-10 h-10 mb-4` → `w-7 h-7 mb-2`, icon `w-5 h-5` → `w-3.5 h-3.5`
- Quote text `text-sm sm:text-base mb-5` → `text-xs sm:text-sm mb-2.5`
- Source citation `pt-4` → `pt-2`, source text `text-sm` → `text-xs`, credential `text-xs mt-0.5` → `text-[10px] mt-0`

**Grid gap** — `gap-5 sm:gap-6` → `gap-2.5 sm:gap-3`

Net result: full section roughly half the previous height, identical content and layout structure.

### File to edit
- `src/components/sections/ExpertQuotes.tsx`

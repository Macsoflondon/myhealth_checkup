## Goal

Make the accreditor labels (UKAS/CQC/ISO 15189) and provider logo tiles scale fluidly across breakpoints — bigger and more legible on desktop, comfortably compact on mobile — without changing the section's overall vertical rhythm.

## Changes (single file: `src/components/sections/AccreditedProvidersBar.tsx`)

### 1. Accreditor block (lines 47–55)
Scale the name and description font sizes responsively:
- Name: `text-sm` → `text-sm md:text-base lg:text-lg`
- Description: `text-[10px]` → `text-[10px] md:text-xs`
- Divider height: `h-7` → `h-7 md:h-9 lg:h-10` to match taller text
- Gap between name+desc pair and divider: `gap-3` → `gap-3 md:gap-4`

### 2. Provider logo tiles (lines 65–81)
Scale logo container height and tile padding fluidly so logos breathe on desktop but stay compact on mobile (preserving total bar height):
- Logo container: `h-[64px] sm:h-[80px]` → `h-[56px] sm:h-[68px] md:h-[80px] lg:h-[88px]`
- Tile padding: `p-2.5 md:p-3` → `p-2.5 md:p-3 lg:p-4`
- Provider name caption: `text-xs` → `text-[11px] sm:text-xs md:text-sm` for readability parity
- Grid gap: keep `gap-3 md:gap-4` (already tuned)

### 3. Eyebrow + heading (no change)
Already responsively tuned — leave alone to preserve vertical rhythm.

## Rationale

Mobile keeps a tighter 56px logo box + smaller captions so the bar height matches the neighbouring sections at small viewports. Desktop scales up to 88px logo box + larger accreditor type for proper legibility — but since horizontal space at `md`+ is plentiful, taller logos absorb naturally without inflating section height beyond the `py-12` outer rhythm.

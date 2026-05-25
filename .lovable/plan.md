## Goal
Merge the two stacked centre callout columns in the Goodbody Featured Partner bento into one unified panel with evenly-spaced copy.

## Current state
`GoodbodyBentoShowcase.tsx` renders two separate centre columns (rows 2 and 3), each containing two `CalloutCard`s — four cards total, visually split.

## Change
- Replace both centre `<div className="col-span-2 sm:col-span-2 sm:row-span-2 flex flex-col gap-3 sm:gap-4">…</div>` blocks with a **single** centre block that spans `sm:row-span-4` (covering both kit-tile rows on the sides).
- Inside it, render one rounded white card with all four messages, separated by thin dividers (`divide-y divide-[#081129]/10`) and `justify-between` so spacing is even regardless of card height.
- Keep all four existing copy lines verbatim:
  1. Goodbody Clinics deliver high-quality private health checks that are accessible and affordable.
  2. Clinical-grade accuracy meets high-street convenience, with over 60 blood and wellness tests to choose from.
  3. Every test is processed in UKAS-accredited laboratories and reviewed by a GP for results you can trust.
  4. Goodbody Clinics make proactive health simple, reliable, and within reach.
- Mobile: stack as a single full-width card between the kit tiles (place it after the first side-tile pair, before the next row of side kits).
- Typography: keep existing `text-[#081129] font-sans text-sm sm:text-base leading-relaxed`. Add subtle top accent — a 2px gradient bar (`from-brand-turquoise to-brand-pink`) inside the card to tie back to brand.

## Files touched
- `src/components/sections/GoodbodyBentoShowcase.tsx` (edit only)

## Out of scope
Side kit tiles, logo tile, CTA, promo carousel — unchanged.

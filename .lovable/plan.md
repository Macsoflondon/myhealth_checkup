# Shrink the four category cards by half

## Goal
Reduce the height (and overall visual footprint) of the four large category cards in `TestCategoriesSection.tsx` to roughly 50 % of their current size, while keeping the content readable and the design balanced.

## Current state
- Component: `src/components/sections/TestCategoriesSection.tsx`
- The four cards currently use fixed minimum heights:
  - Mobile: `min-h-[570px]`
  - Tablet (`sm`): `min-h-[705px]`
  - Desktop (`lg`): `min-h-[780px]`
- Internal spacing is generous (`p-9 sm:p-12`, `mb-8`, `mb-10`, `text-xl sm:text-2xl`).

## Proposed changes
1. **Halve the card heights**
   - Mobile: `min-h-[285px]` (from 570 px)
   - Tablet: `min-h-[352px]` (from 705 px)
   - Desktop: `min-h-[390px]` (from 780 px)

2. **Scale down internal spacing proportionally**
   - Card padding: `p-5 sm:p-7 lg:p-8` (from `p-9 sm:p-12`)
   - Tag margin-bottom: `mb-3 sm:mb-4` (from `mb-8`)
   - Description margin-bottom: `mb-4 sm:mb-5` (from `mb-10`)

3. **Reduce typography to match the smaller canvas**
   - Tag text: `text-sm` (from `text-lg`)
   - Tag padding: `px-3 py-1.5` (from `px-5 py-2`)
   - Description: `text-base sm:text-lg` (from `text-xl sm:text-2xl`)
   - CTA link: `text-base` (from `text-lg`)

4. **Keep the grid and responsive behaviour unchanged**
   - Retain `grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-9`.
   - Keep image-cover dark-overlay layout and hover scale effect.

## Verification
- Run `npm run build` to confirm no TypeScript/Tailwind errors.
- Visually check the preview at mobile, tablet, and desktop widths to ensure text does not overflow and the cards remain balanced.

## Polish mobile Goodbody text/CTA card

Target: the `col-span-2 aspect-square` mobile-only card in `src/components/sections/GoodbodyBentoShowcase.tsx` (the three paragraphs + "View Goodbody Profile" button).

### Changes (mobile only — `<sm`)

1. Drop the rigid `aspect-square` and use `min-h-[2/1 tile]` equivalent via `min-h-[18rem]` so content can breathe; keep footprint ≈ 2×2 kit tiles.
2. Switch the inner layout to `flex flex-col justify-between` so:
   - Paragraph stack sits at the top with even spacing.
   - CTA pins to the bottom.
3. Bump typography: paragraphs from `text-[11px]` → `text-sm leading-relaxed`, slightly tighter copy where needed so it reads cleanly without overflow.
4. Increase internal padding `p-4` → `p-5`, and use `space-y-3` between paragraphs instead of mb-2 to even out rhythm.
5. CTA: full-width on mobile (`w-full` inside a `mt-4` wrapper), `py-3 text-sm font-semibold`, keeps turquoise→pink hover.
6. No changes to desktop/tablet branch, no changes to other files.

### Result
Bigger, properly spaced copy filling the box, with a prominent professional CTA anchored at the bottom edge — consistent with the rest of the bento.

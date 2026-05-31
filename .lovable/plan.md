## Changes to `src/components/sections/GoodbodyBentoShowcase.tsx`

1. **Remove the tricolor divider** inside the centre callout card (the `<div className="w-12 h-px bg-gradient-to-r from-[#47a970] to-[#e70d69] mx-auto my-3" />` line between the second and third paragraphs).

2. **Move the "View Goodbody Profile" CTA into the callout card**, placed directly below the body text (still centred, same turquoise→pink hover styling).

3. **Remove the standalone CTA block** currently rendered below the grid (`<div className="flex justify-center mt-8 pb-[10px]">…</div>`).

4. Tighten the callout's vertical rhythm so the three paragraphs sit closer together now that the divider is gone, and the button has comfortable spacing above it.

Nothing else changes — grid structure, kit tiles, aspect ratios, and surrounding sections stay exactly as they are.
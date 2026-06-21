Widen the hero box and increase its vertical size with scalable margins.

### What to change

1. **Outer container in `src/pages/Index.tsx`** (line ~194)
   - Replace `max-w-[1080px] mx-auto px-4` with responsive horizontal margins:
     - Mobile:  `mx-4`  (~16 px)
     - Tablet:  `sm:mx-8`  (~32 px)
     - Desktop: `md:mx-14 lg:mx-16`  (~56–64 px ≈ 1.5–1.7 cm)
   - This gives the ~1.5–2 cm buffer from the page edge on desktop while scaling down on smaller viewports.

2. **Hero box height in `src/components/sections/HeroMasthead.tsx`**
   - The image carousel inside the hero box is currently fixed at `h-[320px]`.
   - Increase it to `h-[480px]` — a 50 % increase — which raises the overall white rounded box by roughly half its current height.
   - Keep `rounded-[28px]`, padding, and other inner spacing unchanged.

### Result
- The white hero box will span ~75 % of the viewport width on desktop (with ~1.5 cm gaps on each side) and scale gracefully to narrower gaps on tablet/mobile.
- The hero box will be ~50 % taller, giving the carousel and content more vertical breathing room.

### Not in scope
- No changes to `StatsBand`, `Header`, `PromoTicker`, or any other sections.
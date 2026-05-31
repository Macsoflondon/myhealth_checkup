## Extend Trusted Partners carousel to edges

File: `src/components/sections/PartnersGrid.tsx`

Change the carousel wrapper (line 95–101) so the marquee track spans nearly the full viewport with the fade gradients tightened to the page edges.

1. Remove the `max-w-5xl mx-auto` constraint and break out of the parent `container` by using a full-bleed wrapper (`w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]`).
2. Tighten the mask gradient so the fade-in/out happens within ~3% of each viewport edge instead of 5% of a centred 5xl box:
   - `mask-image: linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)` (and matching `-webkit-mask-image`).
3. Keep the existing track, animation, and logo cards untouched — only the wrapper width and mask change.

Result: logos travel right up to the viewport edges and softly fade in/out very close to those edges.
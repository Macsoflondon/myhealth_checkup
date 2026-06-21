# Rebalance hero vertical spacing

Annotated screenshot shows: large empty band under the carousel image (before "One price you can actually trust." row), and the "Compare." title sitting right on top of the tagline strip with too little space above it.

## Changes — `src/components/sections/HeroMasthead.tsx`

1. **Drop `mt-auto` from the footer grid** (line 206) — that's what's pushing the footer copy to the very bottom of the 100svh card and creating the dead space below the image.
2. **Increase the title's top margin** (line 130): `mt-6 md:mt-8` → `mt-12 md:mt-16` so "Compare." gets clear breathing room beneath the header divider.
3. **Keep title bottom tight** (`mb-2`) so it still hugs the YOUR HEALTH tagline as a typographic pair.
4. **Tighten footer top spacing** slightly (`pt-3` → `pt-4`) so it sits naturally under the image without a yawning gap.
5. Keep `min-h-[100svh]` + `flex flex-col` on the section so the card still targets one viewport, but content now stacks naturally top-down instead of being spring-loaded to top + bottom.

No image, copy, colour, or carousel logic changes. The `width`/`height`/`sizes`/`loading` attributes added earlier stay as-is — these already cover the responsive image loading request.

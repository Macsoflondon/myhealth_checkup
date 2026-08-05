# Fix the navy gap before the Goodbody partner section

## What's happening

That blank navy band isn't a missing section — it's a reserved empty box.

The Goodbody "featured partner of the month" block is deferred: it only mounts when you scroll near it. Until then the homepage renders an **empty 800px-tall placeholder** with no content and no background of its own, so the site-wide navy backdrop shows through. On slower loads (or when the deferred code chunk is still downloading) that placeholder stays visible long enough to read as "a broken empty section".

Two things stack up:

1. `LazyMount minHeight={800}` renders a bare, unstyled `div` 800px tall.
2. Its lazy chunk then has to download, during which the `Suspense` fallback is another empty `min-h-[200px]` div.

Same pattern also wraps the testimonials and clinic/help sections lower down, so the gap can appear more than once.

## The fix

- Give the deferred placeholders a real skeleton instead of an empty box: matching section background (white where the real section is white), plus soft shimmer blocks in the same shape as the content that lands there. No more bare navy.
- Reduce the reserved height for the partner block to something closer to its real rendered height, so the swap doesn't jump.
- Start mounting earlier — widen the pre-load margin so the section is loading well before it reaches the viewport, not as it arrives.
- Have the loading fallback reuse the same skeleton, so there's no second empty flash between "placeholder gone" and "content painted".

## Technical detail

- `src/components/common/LazyMount.tsx`: accept a `className` for the placeholder wrapper; raise the default `rootMargin` from `600px` to `~1200px`.
- `src/pages/Index.tsx`: replace the shared empty `SectionFallback` with a `SectionSkeleton` component (section-coloured background + `animate-pulse` blocks), and pass it as both the `LazyMount` fallback and the `Suspense` fallback for the partner showcase, testimonials, and clinic/help sections.
- Tune `minHeight` per section to the measured rendered height.

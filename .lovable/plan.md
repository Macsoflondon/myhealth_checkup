## Goal

Make the Accredited Providers bar's inner container and horizontal padding match the rhythm used by neighbouring sections (e.g. `TrustPlatformSection`) so its edges align cleanly at every breakpoint.

## Problem

Current wrapper:
```
<div className="container mx-auto px-4 sm:px-6 bg-white">
```

Neighbouring sections use:
```
<div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 ...">
```

Two issues:
1. Padding stops at `sm:px-6` — at `lg`/`xl` the inner content sits closer to the screen edge than the sections above/below, breaking the gutter rhythm.
2. `bg-white` is applied to the *padded* container, so the visible white panel hugs the viewport edges instead of sitting within the same gutter as adjacent sections.

## Changes (single file: `src/components/sections/AccreditedProvidersBar.tsx`)

1. Split the container from the white panel so padding + max-width come from a standards-compliant outer wrapper, and the white surface sits inside the same gutter as neighbours:

```tsx
<section className="py-8 sm:py-10 md:py-12 bg-tertiary" aria-label="...">
  <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
    <div className="bg-white rounded-2xl px-4 sm:px-6 lg:px-10 py-6 sm:py-8 md:py-10">
      {/* eyebrow + heading + accreditors + logo grid */}
    </div>
  </div>
</section>
```

2. Drop the now-redundant `my-0 py-3 sm:py-4 md:py-5` from the eyebrow row (vertical rhythm now lives on the white panel) and keep the existing `mb-*` spacing on heading/accreditor row/grid.

3. Keep the logo grid's existing `max-w-6xl mx-auto` so the 6-up row stays centred within the wider panel at `lg+`.

## Result

- Left/right edges of the white panel line up exactly with content edges in `TrustPlatformSection` and other neighbours from `xs` through `2xl`.
- Vertical padding rhythm (`py-8/10/12` outer, panel inner padding) is preserved.
- No behavioural changes; pure layout alignment.

# Move “As Seen In Press & Media” above Featured Partner of the Month

Move the `FeaturedPublications` (navy “As Seen In / Press & Media” logo carousel) out of the bottom of `PartnerShowcaseGrid` and render it as a standalone section immediately before `PartnerShowcaseGrid` on the homepage, so it slots into the navy strip directly above the “Featured Partner of the Month” wheel.

## Changes

1. **`src/components/sections/PartnerShowcaseGrid.tsx`**
   - Remove the lazy `FeaturedPublications` import.
   - Remove the `<SafeBlock name="Featured Publications">…</SafeBlock>` block and its `BlockSkeleton` fallback usage.

2. **`src/pages/Index.tsx`**
   - Import `FeaturedPublications` (lazy, matching existing lazy section pattern).
   - Render it inside `<Suspense>` / `<SectionReveal>` directly before the `PartnerShowcaseGrid` `LazyMount` block.

## Verification

- Typecheck (`tsgo --noEmit`).
- Homepage preview shows the press logo carousel in the navy strip immediately above the Goodbody “Featured Partner of the Month” section, with the turquoise-pink gradient dividers still intact.
- No duplicate carousel renders further down the page.

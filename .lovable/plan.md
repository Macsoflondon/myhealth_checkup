## Goal

Push the headline, subline, and tri-colour gradient divider down so they sit immediately above the search bar (which is already anchored to the bottom of the hero with the CTA buttons pinned beneath it). The badge stays at the top.

## Change in `src/components/sections/Hero.tsx`

Currently the inner column is:

```text
[badge]              ← top
[headline + subline]
[divider]
(flex spacer)
[search bar]         ← mt-auto, bottom
[CTA buttons]
```

Restructure to:

```text
[badge]              ← top
(flex spacer)
[headline + subline] ← grouped, sits just above search
[divider]
[search bar]         ← still bottom-anchored
[CTA buttons]
```

### Implementation

1. Keep the badge block as-is at the top.
2. Wrap the headline/subline block + the gradient divider + the existing `mt-auto` search/CTA group in a single bottom-anchored container with `mt-auto` instead of putting `mt-auto` on the search group.
3. Remove `mt-auto` from the search/CTA wrapper (it's now inside the bottom group).
4. Tighten the spacing between divider and search bar (`mb-3 sm:mb-4` on the divider row instead of the current `mb-4 sm:mb-6`) so the text visually anchors to the search bar.
5. Drop the `min-h-[100px] sm:min-h-[130px] md:min-h-[150px] lg:min-h-[170px]` reservation on the headline block — no longer needed now that the bottom group governs vertical position; the headline can size to content.

No changes to copy, slide logic, badge, CTA buttons, search input, trust bar, or any other section.

## Files touched

- Edit: `src/components/sections/Hero.tsx` only.

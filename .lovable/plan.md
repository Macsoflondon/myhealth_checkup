## Goal

Move the "🇬🇧 UK's Leading Blood Test Comparison Platform" badge down from the top of the hero so it sits immediately above the headline, as part of the bottom-anchored content block.

## Change in `src/components/sections/Hero.tsx`

Current structure inside the hero column:

```text
[badge]              ← top of hero
(flex spacer)
[headline + subline] ← bottom-anchored group
[divider]
[search bar]
[CTA buttons]
```

Target:

```text
(flex spacer)        ← empty top
[badge]              ← bottom-anchored group starts here
[headline + subline]
[divider]
[search bar]
[CTA buttons]
```

### Implementation

1. Remove the standalone badge `<div className="text-center mb-3 sm:mb-4">…</div>` block currently sitting at the top of the inner column (just under `<div className="max-w-[1240px] …">`).
2. Re-insert the same badge markup as the first child of the existing `<div className="mt-auto w-full">` bottom group, immediately above the headline `<div className="text-center mb-1 sm:mb-2 …">`.
3. Wrap the re-inserted badge in `<div className="text-center mb-3 sm:mb-4">…</div>` so its spacing to the headline matches its previous spacing to the headline.
4. No changes to the badge copy, styling, surfaceStyle, slide logic, headline, divider, search bar, CTA buttons, or any other section.

## Files touched

- Edit: `src/components/sections/Hero.tsx` only.

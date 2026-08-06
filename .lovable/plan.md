# Match the benefit cards to the quiz CTA styling

The three "Why choose…" cards under every category page currently sit on a pale grey panel with a hairline navy border. They should read as the same family as the "Find the Right Health Test for You" banner directly below them: navy interior with the tricolour (pink → turquoise → pink) gradient border.

## What changes

Single file: `src/components/sections/CategoryPageBottom.tsx`.

Each benefit card becomes a two-layer element, exactly mirroring `QuizCTABanner`:

- Outer wrapper: `linear-gradient(135deg, #e70d69, #22c0d4, #e70d69)`, 3px padding, 16px radius.
- Inner panel: `#0a1120` background, 13px radius, same 24px internal padding as now.
- Icon medallion stays turquoise `#22c0d4`, but on a `#22c0d4` tint that works on navy.
- Title switches to white; description to white at ~78% opacity so it clears the contrast bar used across the dark sweep.

The surrounding section stays white, the heading stays navy, and the grid/spacing is untouched — only the card skin changes.

## Notes

- No new component; the gradient values are copied verbatim from `QuizCTABanner` so the two blocks can never drift.
- Affects every page that renders `CategoryPageBottom` (categories, compare, at-home, symptom/goal pages) — that's the intent.

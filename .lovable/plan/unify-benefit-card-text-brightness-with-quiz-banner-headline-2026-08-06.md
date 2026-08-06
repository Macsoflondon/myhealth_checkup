# Unify benefit-card text brightness with quiz banner headliner

The three benefit cards in `CategoryPageBottom` were recently reskinned to match the navy + tricolour-border quiz CTA below them. The card description text currently uses `text-white/80`, which is dimmer than the pure white (`#ffffff`) used for the "Find the Right Health Test for You" headliner in `QuizCTABanner`.

## What changes

Single file: `src/components/sections/CategoryPageBottom.tsx`.

- Change the benefit card description paragraph from `text-white/80` to `text-white` so it matches the brightness of the quiz banner headliner.
- Leave the title as `text-white` (already correct).
- No other structural or spacing changes.

## Verification

- Visual check that all text inside the three benefit cards reads at the same white intensity as the banner headline directly below.

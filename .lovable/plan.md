Remove the pink "Find Your Test →" primary CTA button that was recently added to `src/components/sections/HeroMasthead.tsx`.

Scope
- Delete the button element and its wrapper from `HeroMasthead.tsx`.
- Remove any unused imports or spacing classes that were introduced solely to support the button.
- Leave the rest of the hero layout (H1, wordmark, slogan, carousel, toolbar) untouched.

Verification
- Run `bunx tsc --noEmit` (or `tsgo`) to ensure no type errors from removed imports.
- Visually confirm the button no longer appears in the hero preview and the remaining elements reflow correctly.
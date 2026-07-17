# Plan: Enlarge hero wordmark text

## Current state
The selected text spans (`myhealth` / `checkup`) live in the `Wordmark` component inside `src/components/sections/HeroMasthead.tsx` (lines 151–158). They currently use these font sizes:

| Breakpoint | Current size | Nearest Tailwind step |
|------------|--------------|------------------------|
| Base/mobile | `clamp(1.5rem, 3vw, 2.25rem)` | `text-4xl` (2.25rem) |
| `lg` | `3.5rem` | between `text-5xl`/`text-6xl` |
| `xl` | `4.5rem` | `text-7xl` |

## Proposed change
Bump each breakpoint up by two standard Tailwind font sizes while keeping the wordmark on one line and avoiding overlap with the hero sales card / rotating label bubble.

| Breakpoint | New size | Rationale |
|------------|----------|-----------|
| Base/mobile | `text-[clamp(2rem,4vw,3.75rem)]` | +2 steps: `text-4xl` → `text-6xl` |
| `lg` | `text-[5rem]` | +2 steps from `3.5rem` toward `text-7xl` (4.5rem) → `text-8xl` (6rem), chosen at 5rem to avoid card overlap |
| `xl` | `text-[6rem]` | +2 steps from `text-7xl` (4.5rem) → `text-9xl` (8rem), chosen at 6rem for layout safety |

Because the current implementation uses arbitrary `clamp()` and `text-[...]` values, the cleanest implementation is to update those numeric values directly in the `Wordmark` component rather than switching to named Tailwind classes (which would lose the fine-grained responsive control already in place).

## Files to edit
- `src/components/sections/HeroMasthead.tsx` — update the `Wordmark` font-size classes.

## Verification
1. Run `npm run build` to confirm no TypeScript/Tailwind errors.
2. Check the hero at 390px, 768px, 1024px, and 1440px to ensure:
   - The wordmark remains on one line (`whitespace-nowrap` is already present).
   - No overlap with the hero sales card or rotating label bubble.
3. Run `npm run lint` if it passes quickly.

## Note
If the larger sizes cause layout issues at any breakpoint, the fallback is to reduce the `lg`/`xl` jumps slightly while still keeping the mobile bump at +2 steps.
Put the homepage hero tagline back on a single line.

## What to change

1. **Restore `whitespace-nowrap` on the tagline in `src/components/sections/HeroMasthead.tsx`.**
   - Remove `text-balance`.
   - Keep the responsive `clamp(...)` font size but tighten the minimum so the line fits better on small phones without wrapping.
   - Example target class: `whitespace-nowrap text-[clamp(0.85rem,3.6vw,3.25rem)]`.

2. **Verify the change does not break the build or introduce type errors.**
   - Run `tsgo --noEmit`.
   - Run `bun run build`.

3. **Visual sanity check.**
   - Confirm the tagline renders as one continuous line on desktop, tablet, and mobile viewports in the preview.
   - If overflow still occurs on the smallest phones, scale the minimum font size down further rather than re-introducing wrapping.

## Out of scope

- No changes to the wordmark size or nav layout (already addressed separately).
- No changes to other sections or pages.
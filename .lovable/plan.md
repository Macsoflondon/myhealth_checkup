The selected section is the "Hero CTA — Health Quiz entry point" in `src/pages/Index.tsx` (lines 232–267). It currently uses a dark navy gradient background with white/white-opacity text.

## Changes

In `src/pages/Index.tsx`, update the AI quiz CTA section:

1. **Background**: Replace the inline dark gradient with white (`bg-white` or `#ffffff`).
2. **Heading**: Change `text-white` to navy (`text-[#081129]`).
3. **Sub-paragraph**: Change `text-white/70` to navy at 70% opacity (`text-[#081129]/70`).
4. **Meta row** ("No account required • Takes 2 minutes • 100% free"): Change `text-white/50` to navy at 50% opacity (`text-[#081129]/50`).
5. **AI-Powered badge**: Keep turquoise accent (`text-[#22c0d4]`, `bg-[#22c0d4]/10`, `border-[#22c0d4]/30`) so it remains visible on white.
6. **CTA button**: Keep the existing turquoise-to-turquoise gradient with navy text — it already contrasts well on white.
7. **Icon colors**: Keep the Brain icon turquoise and Shield icon in the meta row navy/50 so they remain legible.

## Verification

- Run `npm run build` to confirm no TypeScript/Tailwind errors.
- Visually verify the section on desktop and mobile (390px) to ensure the white background, navy text, and badge/button contrast remain accessible and on-brand.
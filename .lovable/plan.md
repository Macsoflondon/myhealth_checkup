

## Plan: Rebuild Hero Section to Match Reference Image

### Changes to `src/components/sections/Hero.tsx`

**1. Background overlay**: Change from white `bg-white/[0.65]` to pink `bg-pink-200/60` or `bg-[#e70d69]/15` to match the pink-tinted background in the image.

**2. Badge**: Change from navy-bordered pill with navy text to a turquoise-filled pill with white text. Remove the border, use `bg-brand-turquoise` background.

**3. Headline layout**: Currently 3 blocks + divider line. Change to 2-line flow: "Compare the UK's leading private health test providers" on lines 1-2, then a dash/hyphen before "All in one place!" in pink. Remove the separate turquoise divider line. Add a small turquoise underline below the full headline instead.

**4. Mission text**: Update the third paragraph to match the image text: "We only feature providers that meet rigorous quality standards, including being fully regulated by the Care Quality Commission (CQC) & using only laboratories accredited by the United Kingdom Accreditation Service (UKAS)." — all three paragraphs get the turquoise left border (currently only the first does).

**5. Three CTA buttons**: Add a middle "Find a Clinic" button (pink bg, links to `/find-a-clinic` or similar). Reorder: "Compare Blood Tests" (turquoise), "Find a Clinic" (pink), "Find the Right Test for You" (turquoise). All with white text, rounded-full pill shape.

**6. Search card**: Remove the outer `border border-gray-400` and `shadow-xl` — make it cleaner/flatter white card. Remove border from the popular searches inner box too, keep it as a subtle gray background area.

**7. Popular searches label**: Change "Popular searches:" to "POPULAR SEARCHES" (uppercase, centered).

**8. Trust signals**: Update "200+ clinics nationwide" to "150+ clinics nationwide". Remove asterisk from "No GP referral needed".

### Files modified
- `src/components/sections/Hero.tsx` — all changes in this single file


## Move the 4 stat cards under the "greatest asset" banner

**Source:** `src/components/sections/HeroMasthead.tsx` lines 183–202 — the `grid grid-cols-2 md:grid-cols-4` block rendering UKAS / 200+ / No GP / 60 sec.

**Destination:** `src/components/sections/StatsBand.tsx` — append the same grid directly below the dark navy banner (line 26), still inside the off-white rounded card so it visually belongs to "Your health is your greatest asset."

### Edits

1. **`StatsBand.tsx`**
   - Import `ShieldCheck, FlaskConical, Stethoscope, Zap` from `lucide-react`.
   - After the dark banner `</div>`, add:
     ```tsx
     <div className="pt-3">
       <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
         {/* same 4 cards, identical markup/styling as currently in HeroMasthead */}
       </div>
     </div>
     ```
   - Card markup copied verbatim so the visual treatment (white rounded card, icon bubble, Montserrat numerals, Lato label) matches the screenshot exactly.

2. **`HeroMasthead.tsx`**
   - Delete the `<div className="pt-1">…</div>` block (lines 183–202) and the four now-unused icon imports (`ShieldCheck, FlaskConical, Stethoscope, Zap`) if not referenced elsewhere in the file.
   - Preserve breathing room below the hero photos: replace the deleted block with `<div className="h-10 sm:h-14" aria-hidden="true" />` — that's roughly 2–3 lines of whitespace at the bottom of the hero before the next section, matching the user's request, without re-introducing the stat strip.

### Out of scope

No changes to layout containers, no token edits, no routing/data changes. Pure relocation + spacing tweak.

### Files

- Edit: `src/components/sections/StatsBand.tsx`
- Edit: `src/components/sections/HeroMasthead.tsx`

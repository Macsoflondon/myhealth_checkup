
User approved: compact all remaining sections on `/find-clinic` with moderate shrink (py-6 sm:py-8 rhythm).

Need to view the page to identify exact line numbers for each section before planning edits.

## Plan

Apply moderate compaction (`py-6 sm:py-8`) to four remaining sections in `src/pages/FindClinicPage.tsx`:

**1. Search & Filters + Map block**
- Section padding: `py-8` → `py-6 sm:py-8`
- Input height: `h-12` → `h-10`
- Filter dropdowns: matching reduction
- Map height: shrink ~20% (e.g. `h-[400px]` → `h-[340px] sm:h-[380px]`)
- Tighten gaps between controls

**2. Clinic Cards Grid section**
- Section padding: `py-10` → `py-6 sm:py-8`
- SectionHeading bottom margin reduced
- Grid gap: `gap-6` → `gap-4 sm:gap-5`

**3. About Our Clinic Network**
- Section padding: `py-10` → `py-6 sm:py-8`
- Card inner padding reduced one step
- Heading scaled down one step
- Body text leading tightened

**4. Partnered Testing Providers**
- Section padding: `py-10` → `py-6 sm:py-8`
- Logo grid gap reduced
- Heading scaled one step

Headings remain substantial (not shrunk to Benefits Row tight rhythm) — section feels lighter but still anchored.

**File touched:** `src/pages/FindClinicPage.tsx`

# Fix and modernise the Test Catalogue Dashboard

The last change swapped the dark theme for hardcoded white/slate classes. In your screenshot the page is now effectively unreadable: stat labels and values, table headers and most cell text have disappeared, leaving only the coloured badges floating in a very tall, misaligned table. I could not reproduce it directly (the admin area requires sign-in), so step one is to confirm the cause before restyling.

## What I'll do

1. **Diagnose the invisible text**
   Load the page signed in, inspect computed colours on a stat label and a table header, and check for an admin-scoped CSS rule or a stale utility that is knocking out the text. Fix the actual cause rather than layering more classes on top.

2. **Rebuild the styling on design tokens, not raw colours**
   Replace every hardcoded `bg-white` / `text-slate-*` / `border-slate-*` on this page with the project's semantic tokens (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`). This is what makes the page immune to the class of bug above, and it keeps it consistent with the rest of the admin area.

3. **Make it look like a proper admin dashboard**
   - Stat tiles: shadcn `Card`, turquoise icon in a tinted circle, large numeral, small caption underneath, even 4-up grid.
   - Filters: single bordered toolbar strip — search field grows, category/provider selects fixed width, export button on the right.
   - Table: sticky header row with a muted background, tighter row height, zebra-free hover highlight, right-aligned monospace price columns, provider chips capped with a "+N more" overflow rather than wrapping.
   - Empty/loading states centred with proper vertical rhythm.
   - Pagination row aligned with the table, current page in brand pink.

4. **Check it renders**
   Screenshot the signed-in page at desktop and mobile widths and confirm every label, header and cell is legible before I hand it back.

## Technical notes

- Only `src/pages/AdminTestDashboardPage.tsx` changes, plus a token/CSS fix in `src/styles.css` if the diagnosis points there.
- No data, query or business-logic changes — the counts, filters, sorting, CSV export and pagination behaviour stay exactly as they are.
- Brand accents stay: pink `#e70d69` for primary actions and active page, turquoise `#22c0d4` for icons and category badges, Montserrat for headings.

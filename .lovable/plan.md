# Admin Test Dashboard — light theme

Make the `/admin/test-dashboard` page white/lightgreen of dark navy, and update every element on the page so it remains readable.

## Scope
- `src/pages/AdminTestDashboardPage.tsx` only.
- Keep the surrounding `AdminShell` sidebar/header unchanged unless it visually clashes, in which case we will match it to the page background.

## Changes
1. Replace the page root background `bg-[#081129]` with `bg-white`.
2. Replace the header band `bg-[#081129]` / `border-white/10` with a white/slate band (`bg-white border-b border-slate-200`).
3. Flip text colours:
   - `text-white` → `text-slate-900`
   - `text-white/60`, `text-white/50`, `text-white/70` → `text-slate-500` / `text-slate-600`
   - `placeholder:text-white/40` → `placeholder:text-slate-400`
4. Flip surface/border colours:
   - `bg-white/5` → `bg-slate-50`
   - `border-white/10` → `border-slate-200`
   - `hover:bg-white/10` → `hover:bg-slate-100`
5. Update inputs, selects, and the export button to use light-themed variants (`bg-white border-slate-300 text-slate-900`).
6. Update the table wrapper, header row, sort icons, loading/empty states, and provider price badges to the light palette.
7. Preserve the pink CTA button and turquoise accent icons.

## Verification
- Open `/admin/test-dashboard` in the preview.
- Confirm the background is white, text is dark, and no element is unreadable.
- Confirm filters, sorting, pagination, CSV export, and the biomarker-audit link still work.

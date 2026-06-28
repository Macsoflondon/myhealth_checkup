Revert `src/components/sections/AccreditedProvidersBar.tsx` compression so the six trust badges return to their previous comfortable size:

- Remove `overflow-x-auto` + forced single-line; allow `flex-wrap` again.
- Icon circles: `22px` → `40px`, icon font `12px` → `18px`.
- Label text: `10px` → `13px`.
- Gap between items: `14px` → `24px` (row gap `12px`).
- Header label: `10px` → `11px`, more bottom margin.
- Keep brand turquoise/pink alternating icon colours, navy text, single container.

No other files touched. New "different strategy" will be handled in a follow-up turn.
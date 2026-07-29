Tighten the desktop category pill buttons in the browse-by-category toolbar so all category pills plus the More button fit on a single line without wrapping.

Files to change
- `src/components/layout/CategoryPillDropdown.tsx` — the individual pill Link.
- `src/components/layout/BrowseByCategoryBar.tsx` — the pill container row.

Changes
1. In `CategoryPillDropdown.tsx`:
   - Reduce horizontal padding (`pl-2.5 pr-3` / `sm:pl-3 sm:pr-3.5` → roughly `pl-2 pr-2.5` / `sm:pl-2.5 sm:pr-3`).
   - Reduce icon circle size (`w-[24px] h-[24px] sm:w-[26px] sm:h-[26px]` → `w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]`).
   - Reduce icon size (`w-[14px] h-[14px] sm:w-[15px] sm:h-[15px]` → `w-[12px] h-[12px] sm:w-[13px] sm:h-[13px]`).
   - Reduce label font size (`text-[13px] sm:text-[14px] lg:text-[14.5px]` → `text-[11.5px] sm:text-[12.5px] lg:text-[13px]`).
   - Keep text `whitespace-nowrap` and the hover/active border/box-shadow behaviour.

2. In `BrowseByCategoryBar.tsx`:
   - Tighten the row gap (`gap-x-1.5 gap-y-2 sm:gap-x-2` → `gap-x-1 gap-y-0 sm:gap-x-1.5`) and keep `flex-nowrap` so the row does not wrap.
   - Apply the same compact scaling to the More pill if needed so it matches the category pills.

3. Verify in the preview at the current desktop viewport that the toolbar no longer wraps to a second line and remains usable (hover dropdowns still open, icons and text remain legible).

No functional/data changes; purely presentational.
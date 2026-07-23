## Fix mobile trust badges layout in `AccreditedProvidersBar.tsx`

**Problem:** On mobile (390px), the 8 badges wrap into a ragged 1–2–2–2–1 pattern because `flex-wrap` centres each row independently based on badge width.

**Fix:** Replace the `flex flex-wrap` container with a proper CSS grid so the badges sit on a predictable pattern.

- **Mobile (`<sm`)**: 2-column grid, 4 rows. Each cell left-aligned with a consistent gutter, so icons align vertically down the left of each column and labels align on a shared baseline. Result: a clean 2×4 block.
- **Tablet (`sm`–`lg`)**: 4-column grid, 2 rows (2×4 becomes 4×2), centred.
- **Desktop (`lg+`)**: keep the current single row of 8 (`lg:flex lg:flex-nowrap`).

**Implementation detail:**
- Swap the `flex flex-wrap … lg:flex-nowrap` wrapper for `grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-nowrap gap-y-3 gap-x-2 items-center justify-items-start sm:justify-items-center`.
- Remove the horizontal `px-3 md:px-4 lg:px-5` from each `BadgePill` (it was compensating for flex spacing) and let the grid gap handle spacing; keep px only at `lg` for the desktop row.
- No colour, icon, label, or copy changes — pattern only.

**Files:** `src/components/sections/AccreditedProvidersBar.tsx` (only).

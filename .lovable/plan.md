## Hero compaction + overlay removal

Edits to `src/components/sections/HeroMasthead.tsx`:

1. **Reduce dead space above "Compare" by ~3 lines** (line 130)
   - `mt-10 md:mt-14 mb-5` → `mt-3 md:mt-4 mb-3`

2. **Reduce padding under the top nav by one line** (line 121)
   - `pb-3.5` → `pb-2`

3. **Reduce padding under the slogan row by one line** (line 134)
   - `pb-4` → `pb-2`

4. **Reduce vertical gap around the image** (line 141)
   - `my-3` → `my-2`

5. **Reduce padding above the bottom three-column copy** (line 185)
   - `pt-2` → `pt-1`

6. **Remove the two overlay buttons on the hero image without resizing it** (lines 168–181)
   - Delete the slide-dot pager (`<div className="absolute left-5 top-[18px] ...">`)
   - Delete the "Stay ahead of your health" pill (`<div className="absolute left-[18px] bottom-[18px] ...">`)
   - Image container dimensions (`flex-1 min-h-[55svh]`) stay untouched, so the picture is not distorted.
   - Auto-rotation interval still runs; only the manual dot controls are removed.

Net effect: roughly 5 lines of vertical space reclaimed so the hero section fits within one viewport on the loading page, and the image is clean (no overlays).

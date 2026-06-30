# Double-Size Category Cards

Double the visible size of the four category cards in `TestCategoriesSection` and let them fill the page width.

## Changes — `src/components/sections/TestCategoriesSection.tsx`

- **Container**: replace `container mx-auto px-4 sm:px-6 lg:px-12` with a full-bleed wrapper (`w-full px-4 sm:px-8 lg:px-12`) so the grid spans the viewport.
- **Grid**: change `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4` → `grid-cols-1 sm:grid-cols-2` (2-up at all sizes ≥sm). Bump gaps `gap-7 sm:gap-9` → `gap-10 sm:gap-12`.
- **Card height**: `min-h-[480px] sm:min-h-[570px]` → `min-h-[760px] sm:min-h-[940px] lg:min-h-[1040px]` (roughly 2× area).
- **Card padding**: `p-9 sm:p-10` → `p-12 sm:p-16`.
- **Typography scale-up**:
  - Tag pill: `text-[15px] px-4 py-1.5` → `text-lg px-5 py-2`, `mb-5` → `mb-8`.
  - Title `h3`: `text-3xl sm:text-4xl mb-4` → `text-5xl sm:text-6xl mb-6`.
  - Description: `text-lg sm:text-xl mb-7` → `text-xl sm:text-2xl mb-10`.
  - CTA: `text-base` → `text-lg`.
- **Image quality**: bump Unsplash `w=1200` → `w=1800` so the larger cards stay sharp.
- Section vertical padding nudged: `pt-14 pb-10 … md:pt-20 md:pb-14` → `pt-16 pb-14 … md:pt-24 md:pb-20`.

No data, routing, or behavior changes.


## Move Medichecks Video Left and Double Its Size

### What changes

All changes in `src/components/sections/PartnerShowcaseGrid.tsx`, Row 2 only.

**1. Move the video closer to the left edge**

Currently the video sits inside a balanced two-column grid. To push it toward the left edge, change the grid from equal `md:grid-cols-2` to an asymmetric split using `md:grid-cols-[3fr_2fr]`. This gives the video column 60% of the width (making it larger) and shifts it closer to the container edge. Also remove the left-side gap padding by adding `-ml-4` to the video container so it hugs the platform edge.

**2. Double the video size**

With the wider column (3fr vs 2fr), the video naturally gets significantly more space. To ensure it renders at double scale, also add `min-h-[500px]` to the video container and switch the video from `object-contain` to `object-cover` so it fills the larger area properly.

### Technical detail

**Line 80** -- change grid columns from equal to asymmetric:
```
- md:grid-cols-2 gap-20 lg:gap-32
+ md:grid-cols-[3fr_2fr] gap-12 lg:gap-20
```

The gap is reduced slightly because the video column is now much wider, so the visual separation is maintained.

**Line 81** -- push video container to the left edge and increase height:
```
- <div className="relative md:order-1 rounded-xl flex items-stretch pt-20">
+ <div className="relative md:order-1 rounded-xl flex items-stretch pt-20 md:-ml-4">
```

**Line 88** -- scale up the video:
```
- className="w-full object-contain rounded-xl"
+ className="w-full object-cover rounded-xl min-h-[500px]"
```

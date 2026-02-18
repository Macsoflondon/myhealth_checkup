
## Restyle Medichecks Row to Match GoodBody Layout

### What changes

All changes in `src/components/sections/PartnerShowcaseGrid.tsx`, Row 2 (lines 79-121).

**1. Mirror Row 1 layout structure onto Row 2**

Rewrite Row 2 to match Row 1's pattern: video on the left (order-1), text on the right (order-2), both with `pt-20`, `items-stretch`, and the same text styling (white, `text-sm sm:text-base`, `font-medium`).

**2. Increase the column gap beyond Row 1**

Row 1 uses `gap-16 lg:gap-24`. Row 2 needs an extra ~3cm (~4.5rem) on top of that. Set Row 2 gap to `gap-20 lg:gap-32` (5rem / 8rem), which adds roughly 3cm more than Row 1 at large breakpoints.

**3. Replace "Medichecks" heading with "Unlock the Ultimate You."**

On line 94-96, replace the heading text from `Medichecks` to `Unlock the Ultimate You.` displayed over two lines:
- Line 1: **Unlock the**
- Line 2: **Ultimate You.**

Size matched to Row 1 heading: `text-2xl sm:text-3xl`, with `whitespace-nowrap`.

**4. Keep logo but remove the old heading next to it**

The Medichecks logo stays in the same position (next to the new slogan), at `h-56` to match GoodBody's logo size.

### Technical detail

**Line 80** -- update grid container classes:
```
- <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-center mb-8">
+ <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-20 lg:gap-32 items-stretch mb-14">
```

**Line 81** -- add pt-20 to video container:
```
- <div className="relative md:order-1">
+ <div className="relative md:order-1 rounded-xl flex items-stretch pt-20">
```

**Line 88** -- update video classes to match Row 1:
```
- className="rounded-xl w-full object-contain aspect-video"
+ className="w-full object-contain rounded-xl"
```

**Line 91** -- update text container:
```
- <div className="space-y-5 md:order-2 text-center md:text-left">
+ <div className="pt-20 space-y-6 md:order-2 text-center md:text-left flex flex-col">
```

**Lines 92-98** -- update heading/logo block:
```
- <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
-   <div>
-     <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight">
-       Medichecks
-     </h2>
-   </div>
-   <img ... className="h-36 ..." />
- </div>
+ <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 md:gap-20">
+   <div>
+     <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight whitespace-nowrap">
+       Unlock the<br />Ultimate You.
+     </h2>
+   </div>
+   <img ... className="h-56 ..." />
+ </div>
```

**Lines 100-111** -- update paragraph text styling to match Row 1:
```
- text-white/70 font-sans leading-relaxed
+ text-white text-sm sm:text-base font-sans font-medium leading-relaxed
```

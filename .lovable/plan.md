## GoodBody Row 1 -- Gap, Position, and Slogan Fix

### What changes

All changes in `src/components/sections/PartnerShowcaseGrid.tsx`, Row 1 only.

**1. Increase the gap between text column and video column**

On line 34, change the grid gap from `gap-8 lg:gap-12` to `gap-12 lg:gap-20`. This adds roughly 2cm+ of horizontal space between the text block and the video on desktop.

**2. Move both text and video down from the header**

Change `pt-12` on line 35 to `pt-20` to push the text column down further. Also add `pt-20` to the video container on line 65 so both columns drop equally from the header above.

**3. Fix the slogan line break**

On line 42, the slogan reads `Know more.<br />Live Better.` which forces "more." onto one line and "Live Better." onto the next. force "more." back onto the same line. as "Know"  so it reads as:

 **Know more.**  
**Live Better.**

### Technical detail

**Line 34** -- widen column gap:

```
- gap-8 lg:gap-12
+ gap-12 lg:gap-20
```

**Line 35** -- push text down:

```
- pt-12
+ pt-20
```

**Line 42** -- single-line slogan:

```
- Know more.<br />Live Better.
+  Know more.
Live Better. 
```

**Line 65** -- push video down to match:

```
- <div className="relative rounded-xl flex items-stretch">
+ <div className="relative rounded-xl flex items-stretch pt-20">
```
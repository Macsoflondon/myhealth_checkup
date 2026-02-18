
## GoodBody and Medichecks Row Fixes

### What changes

All changes in `src/components/sections/PartnerShowcaseGrid.tsx`.

**1. Widen the gap between text column and video column (Row 1)**

The current gap classes `gap-12 lg:gap-20` sit on the same grid that also controls the outer layout gap. The issue is the outer container on line 31 also has `gap-12 lg:gap-16`, which may be conflicting. To guarantee at least 2cm (~5rem) of horizontal separation between the two columns, change the Row 1 grid gap to `gap-16 lg:gap-24`.

**2. Fix the slogan to display on two lines correctly**

The slogan currently reads `Know more.<br />Live Better.` on line 42. The `<br />` is already there, but the text before it ("Know more.") may be wrapping "more." to a second line due to the container width. To force "Know more." to stay on one line, add `whitespace-nowrap` to the heading so each line before and after the `<br />` stays intact.

Result:
- Line 1: **Know more.**
- Line 2: **Live Better.**

**3. Remove "Trusted UK Provider" from both rows**

- Delete the `<p>` tag on lines 38-40 (GoodBody row) containing "Trusted UK Provider".
- Delete the `<p>` tag on lines 97-99 (Medichecks row) containing "Trusted UK Provider".

### Technical detail

**Line 34** -- widen column gap further:
```
- gap-12 lg:gap-20
+ gap-16 lg:gap-24
```

**Lines 38-40** -- remove GoodBody "Trusted UK Provider":
```
DELETE:
  <p className="text-brand-turquoise uppercase text-xs font-semibold tracking-[0.25em] mb-2">
    Trusted UK Provider
  </p>
```

**Line 41** -- add whitespace-nowrap to heading:
```
- <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
+ <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight whitespace-nowrap">
```

**Lines 97-99** -- remove Medichecks "Trusted UK Provider":
```
DELETE:
  <p className="text-brand-turquoise uppercase text-xs font-semibold tracking-[0.25em]">
    Trusted UK Provider
  </p>
```

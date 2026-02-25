

## Increase Hero Headline Size and Merge to Two Lines

### Current State
The headline in `src/components/sections/Hero.tsx` (lines 88-94) is split across three lines with two `<br />` tags:
- Line 1: "Compare the UK's leading private"
- Line 2: "health test providers - "
- Line 3: "All in one place!"

Current font sizes: `text-[1.05rem] xs:text-[1.35rem] sm:text-2xl md:text-[2.2rem] lg:text-[2.5rem] xl:text-[2.75rem]`

### Changes to `src/components/sections/Hero.tsx`

**1. Merge to two lines**
Remove the first `<br />` so lines 1 and 2 combine into a single line:
- Line 1: "Compare the UK's leading private health test providers -"
- Line 2: "All in one place!"

**2. Increase font size**
Doubling the mobile base (1.05rem → 2.1rem) will overflow on small screens. The safe approach is 1.5× the current sizes, which keeps it mobile-friendly while being noticeably larger:

| Breakpoint | Current | 1.5× |
|---|---|---|
| base | 1.05rem | 1.575rem → round to 1.6rem |
| xs | 1.35rem | 2rem |
| sm | 2xl (1.5rem) | 2.25rem |
| md | 2.2rem | 3.3rem |
| lg | 2.5rem | 3.75rem |
| xl | 2.75rem | 4.125rem → round to 4.1rem |

New classes: `text-[1.6rem] xs:text-[2rem] sm:text-[2.25rem] md:text-[3.3rem] lg:text-[3.75rem] xl:text-[4.1rem]`

**3. Widen the mobile max-width constraint**
Currently `max-w-[320px]` on mobile — this must increase to accommodate the larger text on two lines instead of three. Change to `max-w-[400px]`.

### Resulting markup (lines 88-94)

```tsx
<h1 className="max-w-[400px] sm:max-w-3xl lg:max-w-5xl mx-auto text-[1.6rem] xs:text-[2rem] sm:text-[2.25rem] md:text-[3.3rem] lg:text-[3.75rem] xl:text-[4.1rem] font-heading font-bold leading-snug sm:leading-snug mb-3 sm:mb-4 md:mb-6">
  <span className="text-brand-navy">Compare the UK's leading private health test providers - </span>
  <br />
  <span className="text-brand-pink">All in one place!</span>
</h1>
```

### No other files affected


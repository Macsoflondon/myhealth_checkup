
# Ensure Hero Headline Wraps to Exactly Two Lines

## Current State

The headline "Compare the UK's leading private health test providers - All in one place!" currently uses these font sizes:
- `text-[0.85rem]` (default/smallest mobile)
- `xs:text-[1.05rem]`
- `sm:text-2xl`
- `md:text-3xl`
- `lg:text-[2.65rem]`
- `xl:text-5xl`

On most viewports it already fits on one or two lines, but at certain in-between widths the text can spill to three lines.

## Changes

**File: `src/components/sections/Hero.tsx` (line 101-102)**

Reduce font sizes slightly at the `sm` and `md` breakpoints where three-line wrapping is most likely, and add `max-w-2xl` constraint on the heading to control line width consistently:

- Change `sm:text-2xl` to `sm:text-xl` 
- Change `md:text-3xl` to `md:text-2xl`
- Keep `lg:text-[2.65rem]` and `xl:text-5xl` unchanged (these viewports already fit on one or two lines)
- Add `max-w-2xl lg:max-w-4xl mx-auto` to the `h1` to constrain width and force a clean two-line break at tablet sizes

This ensures the headline never exceeds two lines at any viewport while remaining bold and readable.

## Technical Detail

```
h1 className="max-w-2xl lg:max-w-4xl mx-auto text-[0.85rem] xs:text-[1.05rem] sm:text-xl md:text-2xl lg:text-[2.65rem] xl:text-5xl font-heading font-bold leading-snug sm:leading-snug mb-3 sm:mb-4 md:mb-6"
```

The `whitespace-nowrap` on the "All in one place!" span is already in place, preventing orphaned words. The width constraint plus adjusted sizes will guarantee a maximum of two lines across all screen widths.

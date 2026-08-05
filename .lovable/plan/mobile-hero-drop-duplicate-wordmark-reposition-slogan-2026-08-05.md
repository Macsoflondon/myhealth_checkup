# Mobile hero: drop duplicate wordmark, reposition slogan

## What changes

On mobile only (the navy hero at the top of the home page):

1. Remove the large `myhealthcheckup` wordmark that currently sits at the very top of the navy hero. The brand name already appears in the white sticky bar just below it, so it is duplicated.
2. Move the slogan so it sits directly beneath that white bar's brand name, on the navy background, in white text.
3. Left-align the slogan (currently centred), aligned to the same left edge as the brand name in the white bar.

Desktop and tablet layouts stay exactly as they are.

Result on mobile, top to bottom:

```text
[ white bar: myhealthcheckup            ☰ ]
YOUR HEALTH. YOUR CHOICE.
ONE TRUSTED PLATFORM.
[ hero imagery ]
```

## Technical detail

- File: `src/components/sections/HeroMasthead.tsx`
- The `sm:hidden` block (lines ~109-116) currently renders `<Wordmark />` plus the centred slogan above the toolbar. Delete the `<Wordmark />` from that block and move the remaining `<h1>` slogan to render *after* the `BrowseByCategoryBar` wrapper (the white sticky bar containing the mobile brand name and menu button).
- Switch the slogan from `text-center` / `items-center` to left alignment, with `px-4` so its left edge matches the brand name inside the white bar (`px-4` there too).
- Keep the existing font sizing, two-line split, and brand colour spans (turquoise `HEALTH.`, pink `CHOICE.`). The slogan stays the page `<h1>`.
- Adjust the surrounding vertical padding/margins so the slogan sits snugly under the white bar and above the hero image without a gap where the wordmark used to be.

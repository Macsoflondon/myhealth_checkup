# Homepage hero spacing adjustments

Adjust the homepage `HeroMasthead.tsx` so the hero section feels more open above the category toolbar and tighter below it.

## Changes

1. **Increase slogan-to-divider space by one line**
   - Add roughly one line of extra bottom spacing below the "Your health. Your choice." slogan before the top pink divider of the white category toolbar band.
   - On desktop this means increasing the gap between the slogan baseline and the toolbar's top pink border.

2. **Reduce hero image top by one line**
   - Move the hero image section up by roughly one line, reducing the visual gap between the toolbar's bottom pink divider and the start of the hero image.
   - On desktop the image container currently sits flush (`sm:mt-0`), so this will be achieved by trimming the toolbar band's bottom padding / border spacing rather than adding negative margin.

## Technical details

- File: `src/components/sections/HeroMasthead.tsx`
- "One line" will be interpreted as approximately 1rem (one standard text line) and applied through Tailwind spacing utilities.
- After the edit the white category toolbar band will retain its pink top/bottom borders, but the slogan will sit slightly higher above it and the hero image will sit slightly closer below it.

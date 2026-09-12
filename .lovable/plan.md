# Correct the new hero slide framing

## Outcome

Keep the three approved stock photographs and slogans, but make each composition fit the live hero cleanly at desktop, tablet and mobile sizes. No slogan, supporting copy, brand strip or person will be clipped.

## Implementation

1. Recompose the three new slogan slides from their original stock photographs into dedicated desktop and portrait/mobile masters, using safe text areas matched to the actual hero proportions.
2. Keep wording as editable page text over the photographs instead of baking it into one universal crop. This lets headings wrap naturally and scale within fixed limits at each breakpoint.
3. Add a restrained navy readability layer behind the copy where needed, preserving the turquoise and pink brand accents without obscuring the photograph.
4. Extend the slide configuration and `<picture>` output to select the correct responsive photograph for mobile, tablet and desktop while retaining AVIF/WebP delivery.
5. Leave the three existing non-slogan slides, six-slide order, 15-second timing, deferred loading, first-image preload and reduced-motion behaviour unchanged.

## Verification

- Review all three slogan slides at 360px, 390px, 768px, 1111px and 1440px widths.
- Confirm every line is fully visible, wraps cleanly, avoids faces and remains readable against the image.
- Confirm all six slides still rotate, no frame is blank, and there is no horizontal overflow or layout shift.
- Run the focused hero tests and TypeScript checks.

## Technical detail

The current slogan images are wide compositions rendered with `object-cover` inside a taller hero frame. Repositioning alone cannot preserve both their embedded text and subjects. Art-directed sources plus responsive HTML text remove that conflict without using `contain` bars or changing the hero’s overall height.

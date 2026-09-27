# Update and reframe all five homepage hero slides

## Outcome

Replace every slide’s eyebrow, headline, supporting copy, label and alternative text with the supplied wording. Keep slide order, photographs, 15-second rotation, transitions, deferred loading and reduced-motion behaviour unchanged. Slide 1 remains the only H1.

## Layout changes

- Extend each slide’s configuration with tablet and desktop copy widths plus a mobile top/bottom placement.
- Keep slides 2, 4 and 5 left-aligned, and slides 1 and 3 right-aligned, using roughly 48% of the frame at tablet widths and 40% on desktop.
- Put slides 2, 4 and 5 in a restrained bottom copy band on mobile; keep faces above the copy and add enough top clearance for the menu button on every slide.
- Tune the existing image focal positions where necessary so people, faces, hands and the blood tube remain outside the copy area.
- Preserve the explicit two-line headlines, reducing headline sizing only where needed to keep those lines intact.

## Tests and verification

- Update hero tests that still locate old slide wording.
- Check all five slides at 360, 390, 768, 1024, 1280 and 1440px widths for face/head overlap, clipping, menu overlap and horizontal overflow.
- Run the focused hero tests and strict TypeScript check.

## Technical detail

Responsive placement will stay data-driven in `hero-slides.ts`. `HeroMasthead.tsx` will convert each slide’s settings into breakpoint-specific width, alignment and gradient classes without changing slideshow state or loading logic. Verification will use a short rotation interval only in the browser check so every unchanged slide transition can be inspected efficiently.

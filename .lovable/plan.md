# Condense At Home Test Kits category cards

## Goal
Make the category cards on `/at-home-tests` more compact so four cards fit comfortably across each row on desktop, reducing the wasted space shown in the screenshot.

## What will change
- Update `src/components/athome/AtHomeSectionGrid.tsx` only.
- Change the desktop grid from 3 columns to 4 columns (`lg:grid-cols-4`).
- Tighten internal card padding and spacing so cards feel smaller and sit neatly in four columns.
- Reduce icon tile size, heading size, description margin, and CTA height slightly to match the denser layout.
- Keep mobile and tablet behaviour unchanged (1 column on mobile, 2 columns on tablet).
- Preserve hover effects, accent colours, deep links, and live kit counts.

## Out of scope
- No changes to `/wellness` or other category landing pages.
- No changes to data, hooks, routes, or SEO.

## Verification
- Run `bunx tsgo --noEmit`.
- Use Playwright to confirm four cards per row on a 1348px desktop viewport and that cards remain clickable.

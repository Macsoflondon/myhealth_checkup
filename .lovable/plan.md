# Turn the outer page margins navy

## Goal

The empty zones between the browser edge and the framed page (marked in red on the user's screenshot) are currently white. Fill them with the brand navy (#081129) so the page sits in a navy field on both sides.

## Current state

- `src/layouts/MainLayout.tsx` line 25: the outer frame div is `min-h-dvh flex flex-col bg-white page-surface` — it carries `--page-inset` padding (2.5cm desktop, 1.5rem tablet) and paints white behind that padding, which is the white zone the user marked.
- `page-surface-inner` (the content column) already has a 1px navy frame line (`src/styles.css:1256-1260`) on tablet/desktop, and white page content sits inside it.
- `--color-brand-navy: #081129` already exists as a Tailwind v4 theme token (`src/styles.css:52`), generating a `bg-brand-navy` utility.
- Mobile (<768px) has no inset, so no side margins appear there — unchanged.

## Change

One edit in `src/layouts/MainLayout.tsx`:

- Change the outer frame's background from `bg-white` to `bg-brand-navy`. The inner `page-surface-inner` column keeps its white content background (it is the element that actually carries the page), so only the inset margins turn navy, exactly inside the red lines on the screenshot.

No other files change. Check first whether `page-surface-inner` sets its own white background; if it does not, give it `bg-white` explicitly so the content area stays white while the margins go navy (verified during implementation — the inner column must not inherit the navy).

## Verification

- Playwright screenshot at 1440px desktop: navy margins on both sides of the frame lines, content area still white.
- Tablet (~834px): same treatment at the narrower 1.5rem inset.
- Mobile (390px): unchanged, edge-to-edge.
- No horizontal overflow (`scrollWidth === clientWidth`).

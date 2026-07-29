## Goal

On every page except the homepage, the category toolbar should sit centred on the colour change — half of the bar over the navy header block, half over the white section below — full width across the page, and still stick to the top when scrolling.

## Current state (verified)

- `src/components/layout/BrowseByCategoryBar.tsx` renders a desktop bar with `sticky top-0 z-[1000]`.
- Two shells render it above page content: `src/layouts/MainLayout.tsx` (`variant="flush"`, skipped on `/`) and `src/components/layout/Header.tsx` (`variant="flush"`, used by `CategoryPageLayout`).
- The navy block is `src/components/category/CategoryStandardHero.tsx`, rendered inside page content — i.e. below the toolbar in the DOM. That's why the toolbar currently sits above the navy band instead of on its lower edge.
- The homepage renders its own copy inside `HeroMasthead.tsx` (`compact placement="hero"`) — untouched.

## Approach

Anchor the bar to the bottom edge of the navy block using a portal, keeping it in normal document flow (so sticky-on-scroll still works) and using symmetrical negative margins so it overlaps equally into navy above and white below with zero layout shift.

1. **Anchor element** — `CategoryStandardHero.tsx` returns a fragment: the existing `<section>` plus, immediately after it, `<div id="page-toolbar-anchor" />`. This marks the exact navy → white boundary.

2. **New `placement="straddle"` mode** in `BrowseByCategoryBar.tsx`:
   - On mount, look up `#page-toolbar-anchor`. If found, render the desktop bar into it with `createPortal`; if not found (pages with no navy hero), fall back to today's top-of-page rendering, so nothing regresses.
   - Straddle wrapper: `sticky top-0 z-[1000]`, full page width (no side margins), `marginTop: -h/2`, `marginBottom: -h/2` where `h` is the measured bar height via `ResizeObserver` — net zero layout shift, exactly half over each colour.
   - Styling in this mode: flush pill-shaped/rounded card on a light background with the existing shadow, so it reads as a floating bar over the boundary rather than a full-bleed band.
   - Mobile bar (`md:hidden` sticky header) is unchanged.

3. **Wire the shells** — `MainLayout.tsx` and `Header.tsx` pass `placement="straddle"`. Both already exclude the homepage path (MainLayout skips on `/`; Header isn't used there).

4. **Sticky handoff** — the existing `stuck` IntersectionObserver logic already swaps to the rounded/blurred "stuck" style; keep it so once scrolled past the hero the bar pins to the top exactly as today.

## Technical notes

- Portal target must exist before the bar renders: use a small `useState` + `useLayoutEffect` lookup and re-check on route change (`useLocation`) so navigating between pages re-attaches the bar.
- `overflow: hidden` on `CategoryStandardHero`'s section is fine — the anchor is a sibling *after* the section, so the bar won't be clipped.
- z-index stays `1000` so dropdowns still open above cards; dropdown menus keep `z-[9999]`.
- Presentation only — no data, routing or business-logic changes.

## Verification

Playwright screenshots at 1367px and 1024px on `/at-home-tests` (uses `CategoryPageLayout` → `Header`) and one `MainLayout` page, checking: bar centred on the colour boundary, equal overlap, no layout jump, dropdowns open, and sticky behaviour on scroll.

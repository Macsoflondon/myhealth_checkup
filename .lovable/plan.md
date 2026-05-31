## Goal

As the user scrolls down past the hero, the hero search bar smoothly migrates into the navy logo bar (replacing the "Your Health. Your Choice…" tagline), the logo nudges left, and the promo ticker collapses away. Scrolling back to the top reverses the morph: ticker reappears, tagline returns, search bar drops back into the centre of the hero. Desktop only — mobile already has its own compact header and behaviour stays untouched.

## Behaviour spec

- Trigger: page scrollY crosses a threshold (~hero search bar's vertical position, computed dynamically via `IntersectionObserver` on the hero search wrapper). Use the observer's `isIntersecting` flag so the morph fires exactly when the hero search leaves the viewport, and reverses when it re-enters.
- Forward (scrolling down past threshold):
  - Promo ticker slides up and collapses (height → 0, opacity → 0).
  - Logo bar tagline image fades out and is removed from layout.
  - A docked search input fades/slides into the space the tagline occupied, anchored to the right of the logo.
  - Logo shifts slightly left (justify changes from centred trio to left-aligned logo + right-aligned search).
  - Logo bar becomes `sticky top-0` (currently it scrolls away; only the ticker + nav toolbar are sticky today).
- Reverse (scrolling back up): all of the above unwind in reverse with matching durations.
- Hero search bar stays in place visually; it does not animate — the docked one is a separate element that fades in. This avoids FLIP complexity and keeps the hero layout stable.
- Durations: 300–400ms, `cubic-bezier(0.4, 0, 0.2, 1)`, respect `prefers-reduced-motion` (snap instantly).

## Files to change

1. **`src/components/sections/Hero.tsx`**
   - Wrap the existing search `<div className="max-w-[855px] mx-auto w-full">` (line 175) with a `ref` and assign `id="hero-search-sentinel"` so the header can observe it.
   - No visual change to the hero itself.

2. **`src/components/layout/Header.tsx`** (desktop branch only, lines 100–168)
   - Add state `isSearchDocked` driven by an `IntersectionObserver` watching `#hero-search-sentinel` (fallback: scrollY > 400 on routes without the sentinel, so other pages keep current behaviour).
   - Wrap the promo ticker container in a height/opacity transition; when `isSearchDocked`, collapse to `max-height: 0; opacity: 0; overflow: hidden`.
   - Make the navy logo `<header>` block `sticky top-0 z-40` when `isSearchDocked` (and bump the sticky toolbar's `top` offset to 0 since ticker height becomes 0 — already handled by the existing `tickerHeight` measurement once the ResizeObserver fires).
   - Inside the logo row:
     - Replace the centred 3-column flex with a layout that transitions between two states:
       - Default: current `flex-1 / centred logo+tagline / flex-1 controls`.
       - Docked: `logo (left) — docked search (flex-1) — controls (right)`.
     - Tagline `<img>` gets `opacity` + `max-width` transitions; hidden when docked.
     - Add a new docked search `<input>` (mirrors hero's styling but sized for the bar — ~44px tall, navy-on-white or translucent white-on-navy to match the navy bar). Hidden (`opacity-0 pointer-events-none w-0`) by default; visible (`opacity-100 w-full max-w-[640px]`) when docked. Wire the same navigate-on-Enter handler as Hero (`/compare?search=...`).
   - Honour `prefers-reduced-motion` by zeroing the transition durations.

3. **`src/components/layout/Header.module.css`** (optional)
   - Add `.morphTransition { transition: max-width 320ms cubic-bezier(0.4,0,0.2,1), opacity 240ms ease, transform 320ms cubic-bezier(0.4,0,0.2,1); }` and a collapsed-ticker class, to keep Tailwind arbitrary-value clutter down.

## Out of scope

- Mobile header (already compact, no tagline, separate code path).
- Hero section visuals, copy, or the hero search itself.
- Nav toolbar (`NavigationItems`) behaviour — it already sticks; unchanged.
- Routing, search logic, analytics — the docked input reuses the same `/compare?search=` navigation.

## Verification

- Scroll down on `/` at desktop widths: ticker collapses, tagline fades out, search appears in logo bar, logo bar sticks. Scroll back: everything reverses smoothly.
- Other routes (no hero sentinel): header behaves exactly as today.
- Mobile viewport: unchanged.
- `prefers-reduced-motion: reduce`: state still toggles but without animation.

## Sticky category nav across the site (hidden over homepage hero)

### Behaviour
- Every route renders a sticky top bar containing the existing `NavigationMenu` (primary categories + More dropdown).
- On the homepage (`/`), the bar is hidden while the hero is in view, then slides in once the user scrolls past it.
- On all other routes, the bar is pinned at the top from page load.

### Implementation
1. **New component** `src/components/layout/StickyCategoryBar.tsx`
   - Navy `#081129` bar, `sticky top-0 z-50`, subtle bottom border + backdrop blur.
   - Renders `<NavigationMenu />` from `src/components/header/NavigationMenu.tsx` (unchanged).
   - Accepts `hideUntilScroll?: number` prop. When set, listens to `window` scroll and toggles a `translate-y-[-100%]` / opacity class until `scrollY > threshold`.

2. **Mount it in `src/layouts/MainLayout.tsx`** above `<main>`.
   - Use `useLocation()`; if `pathname === "/"`, pass `hideUntilScroll={window.innerHeight * 0.8}` (approx hero height). Otherwise render as always-visible sticky.

3. **No changes** to `NavigationMenu`, `Header` (PromoTicker), or page components — purely additive.

### Notes
- Mobile: same sticky behaviour; existing `NavigationMenu` already handles mobile wrapping.
- Keeps z-index above hero content but below modal/drawer overlays already at `z-[98]+`.
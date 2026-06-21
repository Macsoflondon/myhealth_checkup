## Goal
Remove the white logo bar from the global header on every device while keeping the promo ticker carousel above the hero.

## Change (single file)
**src/components/layout/Header.tsx**
- **Mobile branch**: drop the `<header>` block that renders the logo + mobile menu. Keep `<PromoTicker />` (and the lazy `MobileNavigationDrawer` if menu state still needs it — but since the trigger is gone, remove `MobileMenu`, `isMenuOpen` state, and the drawer too).
- **Desktop branch**: delete the entire `<header ref={logoBarRef}>...</header>` logo bar. Keep the collapsing `<PromoTicker />` wrapper as-is (or simplify to a static `<PromoTicker />` since there's no logo bar to collapse into).
- Remove now-unused imports: `Logo`, `mainLogo`, `mobileLogo`, `MobileMenu`, `MobileNavigationDrawer` lazy import, `SearchBar`, `NavigationItems`, `UtilityBar`, `styles`, related state/refs/effects.

Result: `<Header />` renders only `<PromoTicker />`. Hero/StatsBand sit directly beneath it on all viewports. Mobile-first preserved (no logo bar at any breakpoint).

## Out of scope
No changes to `MainLayout`, `Index`, hero, or any other page — the `<Header />` slot still exists and just renders less.
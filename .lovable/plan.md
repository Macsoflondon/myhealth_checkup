## Goal

Apply the Trusted Providers page background — navy `#081129` with the turquoise (`#22c0d4`) and pink (`#e70d69`) ambient glow orbs — to every route in the app, except the homepage (`/`). Existing section/card backgrounds stay as-is.

## Approach

Add the background at the app shell so it sits behind every page without touching individual section components.

1. **New component** `src/components/layout/GlobalPageBackground.tsx`
   - Reads current path with `useLocation()`.
   - Returns `null` when `pathname === "/"`.
   - Otherwise renders a `fixed inset-0 -z-10 pointer-events-none` layer:
     - Base: `bg-[#081129]`.
     - Two blurred orbs identical to `FeaturedProvidersGlass`: top-left turquoise `bg-[#22c0d4]/10 blur-[120px]`, bottom-right pink `bg-[#e70d69]/10 blur-[120px]`, each `500px` square.

2. **Mount once** in `src/App.tsx` inside `<BrowserRouter>`, alongside `ScrollToTop` / `FloatingNavDock`, so it covers every route including admin/auth pages.

3. **Body/root transparency check**
   - `index.html` / `src/index.css` currently set a body background. Confirm and, if it would occlude the fixed layer, set the relevant wrapper (`body` or `#root`) to `background: transparent` on non-home routes — easiest fix is to give `body` `background-color: transparent` and let `GlobalPageBackground` provide the colour (homepage sections already paint their own backgrounds, so the body colour there is invisible anyway). If that risks a flash, instead toggle a `data-route="home"` attribute on `<html>` from `GlobalPageBackground` and scope the body colour to that.

4. **Remove the now-duplicate background** from `FeaturedProvidersGlass.tsx` (the `bg-[#081129]` + two orbs on the `<section>`) so we don't double-paint on `/trusted-providers`. Section structure stays; just the background classes/orbs come off.

## Out of scope

- No changes to section backgrounds, cards, or typography.
- Homepage untouched.
- No new routes or nav changes.

## Technical notes

- `-z-10` keeps the layer behind all content but above the browser default; sections with their own `bg-*` will continue to cover it where they exist.
- `fixed` (not `absolute`) so the orbs stay put while scrolling long pages — matches the ambient feel of `/trusted-providers` without repeating per section.
- No prop drilling; `useLocation` inside `BrowserRouter` is sufficient.

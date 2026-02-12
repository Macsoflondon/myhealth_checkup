

## Add Home, Back, and Back-to-Top Navigation Buttons

### What will change

On every page except the homepage, two small rounded buttons will appear in the top-right area below the header: a **Home** button (house icon) and a **Back** button (arrow icon). Both will be turquoise (#22c0d4) by default and turn pink (#e70d69) on hover, with white icons. The existing **Back to Top** scroll button will also be updated from pink to turquoise, turning pink on hover, for visual consistency.

---

### 1. Create a new `PageNavButtons` component

A new component (`src/components/common/PageNavButtons.tsx`) will render two small circular/rounded buttons positioned in the top-right corner of the content area:

- **Home button**: House icon, navigates to `/`
- **Back button**: Arrow-left icon, navigates to the previous page in browser history

Both use:
- Background: turquoise (#22c0d4)
- Hover background: pink (#e70d69)
- White icons
- Smooth transition on hover

This component will only render when the current route is NOT `/` (the landing page).

### 2. Add `PageNavButtons` to `App.tsx`

Place `PageNavButtons` alongside `BackToTop` in `App.tsx` so it appears globally on all pages except the homepage, without needing to edit every individual page file.

### 3. Update `BackToTop` button colours

Change the existing back-to-top button from:
- `bg-[#e70d69] hover:bg-[#c2185b]` (pink)

To:
- `bg-[#22c0d4] hover:bg-[#e70d69]` (turquoise, turning pink on hover)

This keeps all three navigation buttons visually consistent.

---

### Technical Detail

- **New file**: `src/components/common/PageNavButtons.tsx` -- uses `useLocation` to hide on `/`, `useNavigate` for the back action, and `Link` for the home action. Positioned with `fixed top-[calc(var(--header-height,120px)+1rem)] right-8` or a similar offset using Tailwind so it sits just below the header on the right.
- **Edit**: `src/App.tsx` -- import and render `PageNavButtons` inside `BrowserRouter`.
- **Edit**: `src/components/common/BackToTop.tsx` -- swap background colour classes to turquoise with pink hover.

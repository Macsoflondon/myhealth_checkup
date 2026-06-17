## Plan

### 1. Footer fixes (`src/components/layout/Footer.tsx`)

**Copyright + medical disclaimer overflow on mobile**
- Currently both `<p>` tags use `whitespace-nowrap`, which forces them off-screen at 391px (visible in screenshot as text bleeding past the right edge — "All rights reserved" and "Legal H…" cut off).
- Remove `whitespace-nowrap`; allow natural wrapping.
- Bump font size slightly on mobile for legibility (`text-[10px] sm:text-[11px]`) and add `leading-snug`.
- Centre-align text so wrapped lines look intentional.

**Subscribe button colour**
- Current: turquoise bg with dark navy text, hover darkens turquoise.
- Change to: white text on turquoise, hover turns background pink (`bg-brand-pink`) keeping white text.
- Class becomes: `bg-brand-turquoise hover:bg-brand-pink text-white …`

### 2. Mobile-first system check

Audit, then fix issues found. Scope:

- **Layout containers** — verify all major pages use responsive padding (`px-4 sm:px-6 lg:px-8`) and no fixed widths overflow at 360–414px.
- **Overflow culprits** — scan for `whitespace-nowrap`, `min-w-[…px]`, fixed `w-[…px]` on text/containers, and unflexed grids.
- **Typography scaling** — ensure headings use responsive sizes (`text-2xl sm:text-3xl md:text-…`).
- **Tap targets** — interactive elements ≥ 44px.
- **Section transitions** — add a global smooth-scroll behaviour (`html { scroll-behavior: smooth }` in `index.css`) and a subtle fade/translate on section enter using a lightweight IntersectionObserver utility (or Tailwind `motion-safe` + existing animation classes). No heavy library — reuse what's already in the project (Motion/GSAP if present, otherwise CSS).
- **Header/PromoBanner/Hero** — confirm they wrap and don't horizontally scroll at 360px.

Files likely touched in the audit pass:
- `src/index.css` — smooth scroll + reveal-on-scroll keyframes
- `src/components/layout/Header.tsx`, `PromoBanner.tsx`
- `src/pages/Index.tsx` (homepage sections)
- Any section component flagged with overflow

### 3. Verification

- View preview at 391×844 (current mobile), screenshot footer + homepage scroll-through.
- Resize to 360×800 to catch the tightest common breakpoint.
- Confirm no horizontal scroll, disclaimers wrap, subscribe hover = pink/white.

### Out of scope
- No copy changes to disclaimers (legal text stays).
- No backend/data changes.
- No new dependencies.

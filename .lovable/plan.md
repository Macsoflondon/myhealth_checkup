

## Plan: Unified Floating Navigation Dock

**What changes:** Replace the separate `PageBreadcrumb` (bottom-left pill) and `BackToTop` (mid-right circle) with a single unified `FloatingNavDock` component. This dock combines Home, Back, and Scroll-to-Top into one cohesive, compact element anchored to the bottom-right corner of the viewport.

**Design concept:**

```text
  ┌─────────────────────────────┐
  │  On non-homepage pages:     │
  │                             │
  │     ╭───╮ ╭───╮ ╭───╮      │
  │     │ ⌂ │ │ ← │ │ ↑ │      │
  │     ╰───╯ ╰───╯ ╰───╯      │
  │     Home   Back   Top       │
  │                             │
  │  On homepage:               │
  │              ╭───╮          │
  │              │ ↑ │          │
  │              ╰───╯          │
  │              Top            │
  └─────────────────────────────┘

  Position: fixed bottom-6 right-6
  Style: Navy pill container with glassmorphism
  Icons: Turquoise idle → Pink hover
  Top button: fades in after 300px scroll
```

**Visual style (matching platform aesthetic):**
- Container: `bg-[#081129]/90` with `backdrop-blur-xl`, rounded-full, 2px navy border, subtle shadow
- Icon buttons: 44x44px touch targets (WCAG compliant), icon-only (no text labels) for compactness
- Icons: white by default, turquoise glow on hover with pink background transition
- Dividers: thin `bg-white/20` vertical lines between buttons
- The scroll-to-top button smoothly fades in/out based on scroll position
- On homepage: only the scroll-to-top icon renders (no container pill, just the single circle)

**Files to modify:**

1. **Delete** `src/components/common/PageBreadcrumb.tsx` -- replaced by new component
2. **Delete** `src/components/common/BackToTop.tsx` -- replaced by new component
3. **Create** `src/components/common/FloatingNavDock.tsx` -- unified component with:
   - `useLocation` to detect homepage (`/`)
   - Scroll listener for top-button visibility
   - Home link, Back button, Scroll-to-top button
   - On homepage: renders only the scroll-to-top circle
   - On all other pages: renders the full 3-button pill (with top button fading in on scroll)
4. **Update** `src/App.tsx` -- replace `PageBreadcrumb` and `BackToTop` imports with single `FloatingNavDock`
5. **Update** `src/components/common/index.ts` -- update barrel exports


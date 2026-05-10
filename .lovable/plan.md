## Problem

At tablet width (768–1023px) the main category toolbar (Most Popular Tests, General Wellness, Women's Health, Men's Health, Sports‑Fitness Health, Fertility – Prenatal, Cancer Screening, At Home Tests, More) is forced into a single no‑wrap row at near-desktop font sizes. The row is wider than the viewport and the first and last items are clipped on both edges (visible in the current screenshot).

Root cause is in `NavigationMenu.tsx`:

- The non‑mobile branch uses `flex-nowrap` for everything ≥768px.
- Each link is `text-sm md:text-sm lg:text-base xl:text-lg` with `whitespace-nowrap`, so 9 items cannot fit at 768–1023px.

The phone (<768px) layout already wraps and looks correct, and the desktop (≥1024px) layout already fits — only the tablet band is broken.

## Fix

Treat tablet as its own case in the toolbar so it stays inside the viewport while keeping the desktop look untouched.

1. In `src/components/header/NavigationMenu.tsx`, in the non‑mobile branch:
   - Switch the row from `flex-nowrap` to `flex-wrap` up to `lg`, then `lg:flex-nowrap` so desktop is unchanged.
   - Tighten the gap on tablet: `gap-x-1 gap-y-1 lg:gap-2`.
   - Centre the wrapped rows (already `justify-center`).

2. In the same file, on `renderNavItem` and `renderMoreButton`:
   - Reduce the tablet type ramp from `text-sm md:text-sm lg:text-base xl:text-lg` to `text-xs md:text-[13px] lg:text-base xl:text-lg`.
   - Reduce tablet padding from `px-1.5 md:px-2 lg:px-2.5 py-1 md:py-1.5` to `px-1.5 md:px-1.5 lg:px-2.5 py-1 md:py-1 lg:py-1.5`.
   - Keep `whitespace-nowrap` on each item so individual labels never break mid‑word; the row wraps between items instead.

3. In `src/components/layout/Header.tsx`, in the toolbar wrapper (the `<div>` that holds `NavigationItems`):
   - Reduce vertical padding so a two‑row toolbar still feels compact: change `py-1` to `py-1 md:py-1.5 lg:py-1`.
   - Leave the `bg-[hsl(220,5%,97%)]`, gradient dividers, and sticky behaviour as‑is.

Result at 768–1023px: all categories visible inside the viewport, naturally wrapping to two centred rows; desktop (≥1024px) is visually unchanged.

## Out of scope (not changed in this plan)

- The phone (<768px) header and drawer.
- The navy logo/tagline band above the toolbar (the missing logo on tablet is a separate issue and can be addressed in a follow‑up if you want).
- Promo ticker, mega menus, and the More dropdown contents.

## Verification

After the change, screenshot the home route at tablet widths 768×1024 and 820×1180 and confirm:

- No category text is clipped on the left or right edge.
- The toolbar wraps to at most two centred rows.
- Desktop (≥1024px) still renders as a single row identical to today.

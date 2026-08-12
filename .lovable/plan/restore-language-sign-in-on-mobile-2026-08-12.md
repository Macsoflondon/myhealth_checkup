# Restore language + sign-in on mobile

## What happened

The mobile header redesign (wordmark + slogan on the left, three coloured accent lines + hamburger on the right) replaced the old row that carried the flag picker and the sign-in/account icon. They are still present on desktop, but on phones there is now no way to change language or sign in except through pages linked in the menu.

- The mobile brand bar in `BrowseByCategoryBar.tsx` no longer renders `LanguageSwitcher` or `UserMenu`.
- In `HeroMasthead.tsx` those two controls sit in a `hidden sm:flex` cluster, so they never show at phone widths.

## Fix

Put both controls back into the mobile brand bar, on the right-hand side, without breaking the accent-line look:

- Right cluster becomes a single row: flag button, account button, hamburger — 36px touch targets, `gap-1`.
- The three coloured accent lines move directly above that row (they already stack there), so the visual signature is kept.
- Both controls use the transparent/"glass" styling already supported by the components, and their icon colour follows the scrolled state (navy on white, white on navy) to stay readable when the sticky bar turns navy.
- Applies to every mobile page, not just the homepage, since the bar is shared.

Desktop is untouched.

## Technical notes

- `src/components/layout/BrowseByCategoryBar.tsx`: inside the `md:hidden` block, add `<LanguageSwitcher variant="glass" />` and `<UserMenu isMobile variant="glass" />` alongside the `Sheet` trigger.
- `src/components/header/UserMenu.tsx` / `LanguageSwitcher.tsx`: allow the icon colour to invert when the header is in its scrolled navy state (small class tweak, no logic change).
- Verify at 390px that the header stays within its height and nothing overlaps the wordmark.

# Restore pink hover highlight on toolbar pills

## Why "Most Popular Tests" doesn't highlight

`Most Popular Tests` is the only toolbar pill configured with `hasDropdown: false` (`src/components/header/NavigationItems.tsx:15`). In `CategoryPillDropdown.tsx`, `highlighted = isActiveParent || open` — the pink/tinted state only ever appears when a pill's dropdown is open or you're on its page. Since Most Popular Tests has no dropdown, `open` can never become true, so on the homepage it sits in the plain state with only a barely-visible navy wash (`hover:bg-[#081129]/[0.055]`) on hover. Same story for the "More" button — same faint navy hover. The pill code hasn't changed recently; the pink was only ever the open/active state, which this pill can never reach.

## Fix

Give every toolbar pill a real pink hover state so hover feedback is consistent across the whole toolbar, regardless of whether the item has a dropdown:

### `src/components/layout/CategoryPillDropdown.tsx`

- Change the default hover from `hover:bg-[#081129]/[0.055]` to a pink wash `hover:bg-[#e70d69]/10` with the label/icon shifting to pink on hover (`group-hover:text-[#e70d69]` on the label span, and a hover colour on the icon), so any pill — dropdown or not — clearly highlights pink on hover.
- Keep the existing open/active treatments unchanged (pink when on the active route, turquoise tint when a dropdown is open).

### `src/components/layout/BrowseByCategoryBar.tsx`

- Update the "More" button hover to the same pink wash (`hover:bg-[#e70d69]/10`) so it matches the pills.

## Verification

- Hover every pill in the toolbar at desktop width: each one (including Most Popular Tests and More) shows the pink highlight; dropdown pills still show their existing open state.
- Typecheck clean.

## Goal
Replace the boxy pink-bordered flag + user icons in the mobile `BrowseByCategoryBar` right cluster with a unified, soft pink glass pill that matches the Browse/More aesthetic.

## Changes

**File: `src/components/layout/BrowseByCategoryBar.tsx`** (mobile right cluster only)
- Wrap `LanguageSwitcher` + `UserMenu` (mobile breakpoint) in a single rounded-full container styled `bg-[#e70d69]/5 border border-[#e70d69]/10 p-1`.
- Replace the existing `border-l` divider with a thin internal `w-px h-4 bg-[#e70d69]/20` divider between the two controls.
- Hide on `md:` and render the existing bordered cluster for desktop unchanged.

**File: `src/components/header/LanguageSwitcher.tsx`**
- Add a `variant` prop (`"chip" | "glass"`, default `"chip"`).
- `"glass"` variant: remove the hard `border-2 border-secondary` square, render as a transparent `p-2 rounded-full hover:bg-white` button with the flag shown as a small `w-5 h-3.5 rounded-[2px] shadow-sm` tile (no outer border).

**File: `src/components/header/UserMenu.tsx`** (read first)
- Add the same `variant` prop. `"glass"` variant: transparent `p-2 rounded-full hover:bg-white` button, navy person icon at `w-5 h-5` with no hard border.

## Scope guardrails
- Desktop right cluster untouched.
- No changes to dropdown menu contents, navigation links, or auth logic.
- Both card and flush variants of the bar get the new mobile cluster.

## Verification
- Playwright screenshot at 390×844 of `/` and `/at-home-tests` confirming the cluster renders as a single soft-pink glass pill with hairline divider, no boxy borders.

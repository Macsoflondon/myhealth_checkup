# Restyle More dropdown: flag chip + Sign in pill buttons

## Goal

Match the uploaded design: inside the desktop "More" dropdown, the language selector and sign-in stop being plain text rows and become two pink-outlined pill buttons side by side:

1. **Flag chip** — a rounded square button with a pink border showing the current language flag. Clicking it expands the language list inline *inside* the More dropdown (accordion style, not a separate menu), and picking a language closes the More dropdown.
2. **Sign in pill** — a rounded-full pink-outlined button with the user icon and "Sign in" label. Clicking it navigates to `/auth` and closes the dropdown.

## Changes

### `src/components/header/MoreDropdownMenu.tsx`

- Replace the current "Account" text-link rows and the always-visible "Language" list with a single row of two pills at the top of the dropdown, matching the reference image:
  - **Language chip**: rounded-xl, `[1.5px]` pink (`#e70d69`) border, current flag centred (reuses `useActiveLanguage` from `LanguageSwitcher.tsx`). Tapping toggles the language list open/closed inline below the pill row.
  - When signed out: **Sign in** pill — rounded-full, pink border, `User` icon + "Sign in" label, Montserrat semibold, navigates to `/auth`.
  - When signed in: show **Dashboard** and **Sign out** pills in the same pink-outline style instead.
- The expanded language list renders inside the dropdown below the pill row (reusing the existing `LanguageList`); selecting a language collapses the list and closes the More dropdown via the existing `onSelect`/`onClose` callbacks.
- Keep the existing nav sections below unchanged.

### `src/components/layout/BrowseByCategoryBar.tsx`

- Update the props passed to `MoreDropdownMenu`: pass a compact `languageList` (or a flag if the menu renders its own accordion) so the flag chip drives expansion. No other toolbar changes — the desktop right cluster stays as it is now (More button only).

## Verification

- Open the More dropdown at desktop width: confirm the two pink pill buttons render as in the image, the flag chip expands/collapses the language list inline, switching language updates the flag and closes the dropdown, and "Sign in" navigates to `/auth`.
- Confirm the signed-in state shows Dashboard/Sign out pills and sign out works.
- Typecheck clean.

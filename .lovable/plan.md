# Collapsible language picker + fix language switching

## Problem

Two things are wrong in the mobile menu:

1. The language section lists all 11 languages at once, pushing Test Categories far down the drawer.
2. Nothing actually switches. Tapping a language throws `TypeError: i18n.changeLanguage is not a function` (captured in the preview runtime errors, thrown from the language list inside the mobile menu chunk). The list reads the i18next instance from the `useTranslation()` hook, and in that code-split chunk the hook is resolving to a context-less instance, so no language change ever fires and no selection state is reflected.

## Fix

### 1. Bind the language list to the real i18next instance

- Import the initialised singleton directly (`import i18n from "@/i18n/config"`) in `src/components/header/LanguageSwitcher.tsx` and call `i18n.changeLanguage(code)` on that instance instead of on whatever `useTranslation()` hands back.
- Wrap the app in `<I18nextProvider i18n={i18n}>` in `src/routes/__root.tsx` so every chunk (including lazily loaded ones) shares one instance, and the side-effect import can't be dropped.
- Track the active language with `i18n.on("languageChanged", ...)` so the tick/highlight updates immediately, and re-render the header flag.
- Keep the existing side effects: persist to localStorage (already handled by the detector), set `document.documentElement.lang` and `dir` (RTL for Arabic).

### 2. Collapse the language section

- In the mobile drawer (`src/components/layout/BrowseByCategoryBar.tsx`), replace the always-open list with a single row showing the current flag + language name and a chevron.
- Tapping the row expands the full list inline (accordion, closed by default); picking a language collapses it and closes the drawer.
- Same visual language as the other drawer sections: rounded card, navy text, pink highlight on the active item.

### 3. Verify every language works

- After the change, drive the mobile drawer at 390px in a browser: open the menu, expand Language, select each of the 11 locales in turn, and confirm for each one that `i18n.language` updates, `<html lang>`/`dir` update, the header flag changes, the choice survives a reload, and no console error is thrown.
- Report any locale whose visible copy stays English so we know whether it's a switching bug or a missing translation in that locale file.

## Files

- `src/components/header/LanguageSwitcher.tsx`
- `src/components/layout/BrowseByCategoryBar.tsx`
- `src/routes/__root.tsx`

Desktop dropdown behaviour stays as it is, other than picking up the same working instance.

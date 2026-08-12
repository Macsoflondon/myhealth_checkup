# Floating sticky hamburger + language switcher inside menu

## Goal

On mobile, turn the three-line hamburger into a fixed floating button in the top-right corner that stays accessible while scrolling, and move the language selector out of the header into the hamburger menu.

## What will change

1. **Floating hamburger trigger**
   - Remove the sticky behaviour from the full-width mobile brand bar in `BrowseByCategoryBar.tsx` so the bar scrolls with the page.
   - Add a separate fixed-position container (`fixed top-4 right-4 z-50`) that contains only the three coloured accent lines as the menu trigger.
   - The floating button keeps the same navy/pink/turquoise line styling and inverts to white lines on dark backgrounds if needed.
   - Touch target will be at least 44px.

2. **Language switcher moves inside the menu**
   - Remove the standalone `LanguageSwitcher` from the mobile header right cluster.
   - Add a "Language" section inside the mobile `SheetContent` drawer, reusing the existing language list so users can switch without leaving the menu.
   - The current language flag will be shown as the selected state.

3. **Menu content stays the same**
   - Test Categories and More sections remain in the drawer; only the language selector is added.

4. **Desktop unchanged**
   - The desktop category dock and header keep their current language switcher and layout.

## Files to touch

- `src/components/layout/BrowseByCategoryBar.tsx` — mobile header sticky state, floating trigger, remove mobile language button, add language section to sheet.
- `src/components/header/LanguageSwitcher.tsx` — optionally expose an inline/list variant for use inside the sheet.

## Verification

- Mobile viewport (390px): floating three-line button stays in the top-right corner while scrolling.
- Tapping the floating button opens the sheet menu.
- Language can be changed from inside the sheet menu and the header updates.
- No overlap with hero wordmark or other interactive elements.


## Mobile toolbar redesign

On mobile (`<md`), replace the current busy pill layout in `BrowseByCategoryBar` with a clean navy bar that mirrors the reference:

```text
[ myhealth checkup logo ]              [ ☰ ]
```

Desktop (`md+`) layout stays exactly as it is today.

### Changes to `src/components/layout/BrowseByCategoryBar.tsx`

1. **Mobile container**
   - Full-width navy bar: `bg-[#081129]`, no rounded card, no light background, no border.
   - Height ~56px, horizontal padding `px-4`.
   - Sticky behaviour unchanged.
   - `flush` and `card` variants both render the same navy bar on mobile.

2. **Left — brand**
   - Render `myhealth checkup` wordmark (import `AnimatedLogo` from `@/components/header/AnimatedLogo`, wrapped in a `Link to="/"`).
   - Height ~28–32px, white/logo on navy.
   - Replaces the current mobile "Browse" pill.

3. **Right — hamburger only**
   - Single icon button: circular/rounded, transparent or subtle white/10 background, white `Menu` icon.
   - Opens the existing `Sheet`.
   - Remove the mobile pink pill cluster containing `LanguageSwitcher` + `UserMenu` from the bar itself.

4. **Sheet contents (mobile)**
   - Keep the category list.
   - Append a divider and a new section at the bottom containing `LanguageSwitcher` and `UserMenu` (glass variant) so login + language live inside the dropdown as requested.

5. **Desktop untouched**
   - The `hidden md:flex` pill strip, More dropdown, and right-side language/user cluster stay as-is.
   - The scrollable pill strip stays `hidden md:flex`, so it does not render on mobile.

### Files touched
- `src/components/layout/BrowseByCategoryBar.tsx` (only)

### Verification
- Manual check at 390px viewport: navy bar, logo left, hamburger right, nothing else.
- Open sheet: categories + language + login present.
- Desktop ≥768px unchanged.

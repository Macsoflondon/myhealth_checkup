

## Replace Logo with Combined Logo+Tagline Image

The uploaded image contains the myhealth checkup logo with the tagline ("Your health! Your choice! One trusted platform!") as a single combined graphic. This will replace the current separate AnimatedLogo + text tagline approach.

### Changes

**1. Copy the new logo image into the project**
- Copy `user-uploads://Screenshot_2026-02-22_at_12.28.53-2.png` to `src/assets/logo-with-tagline.png`

**2. Update Mobile Header** (`src/components/layout/Header.tsx`)
- Replace the AnimatedLogo + separate tagline `<p>` element with a single `<img>` using the new combined logo
- Size it to fit the mobile header row: `h-[40px] xs:h-[48px] sm:h-[60px]` with `w-auto`
- Remove the separate tagline text block (lines 59-67)
- Keep nav controls (language, user, hamburger) on the right as-is

**3. Update Desktop Header** (`src/components/layout/Header.tsx`)
- Replace the AnimatedLogo on the left and the separate centred tagline with the single combined logo image
- Remove the absolute-positioned tagline `<div>` (lines 99-106)
- Size the desktop logo: `h-20 lg:h-24 xl:h-28` to fit the navy bar without excessive height
- Adjust negative margins so the logo sits cleanly at the left edge

**4. No changes to AnimatedLogo component itself** -- it can remain in the codebase but will no longer be imported into Header.tsx

### Responsive Sizing Summary

| Breakpoint | Logo Height |
|---|---|
| Mobile (< 640px) | 40-48px |
| Small tablet (640px) | 60px |
| Desktop (768px+) | 80-112px |

### Files Changed

| File | Change |
|---|---|
| `src/assets/logo-with-tagline.png` | New file (copied from upload) |
| `src/components/layout/Header.tsx` | Replace AnimatedLogo + tagline with single combined logo image on both mobile and desktop |


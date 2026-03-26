

# Use `hero-image-2.png` as Mobile Header Logo

## What changes

Replace the current mobile header logo (`logoWithTagline` — the combined logo+tagline PNG) with `hero-image-2.png` from `public/lovable-uploads/`. This change applies **only** to the mobile header; the desktop header remains unchanged.

## File: `src/components/layout/Header.tsx`

1. Add a new import at the top:
   ```ts
   import mobileHeaderLogo from "/lovable-uploads/hero-image-2.png";
   ```

2. In the mobile `return` block (line 73–77), swap `logoWithTagline` for `mobileHeaderLogo`:
   ```tsx
   <img
     src={mobileHeaderLogo}
     alt="myhealth checkup - Your Health. Your Choice. One Trusted Platform!"
     className="h-[130px] xs:h-[140px] sm:h-[150px] w-auto object-contain"
   />
   ```

The desktop header section (line 115+) continues using `logoWithTagline` — no changes there.

## Files affected
- `src/components/layout/Header.tsx` — 2-line edit (1 import, 1 src swap)


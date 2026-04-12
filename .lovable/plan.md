

## Make GoodBody logo bigger inside its container

**File:** `src/pages/ProviderProfilePage.tsx` (line 120)

**Current:** The `ProviderLogo` inside the hero container uses `className="w-14 h-14 md:w-16 md:h-16"`.

**Change:** Increase the logo sizing to `className="w-[4.5rem] h-[4.5rem] md:w-20 md:h-20"` so the logo fills more of the container (which stays at `w-20 h-20 md:w-24 md:h-24`). Also add `object-contain` to the wrapper to keep aspect ratio.

This enlarges the logo visually without touching the outer container dimensions.


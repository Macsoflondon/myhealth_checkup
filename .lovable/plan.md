

## Plan: Increase Medichecks Logo Size in Accredited Providers Section

**File:** `src/components/sections/AccreditedProvidersBar.tsx`

**Change:** Add a conditional class for the Medichecks logo image to make it larger within its existing container, without changing the card dimensions.

Currently all logos share the same `max-h-full max-w-full object-contain` class inside an 80px/100px height container. The fix will add a specific scale or remove the max-height constraint for the Medichecks logo so it fills more of the card space.

**Implementation:**
- On the `<img>` tag, add a conditional className that applies `scale-125` (or similar) when the provider is Medichecks, keeping the card and container unchanged.


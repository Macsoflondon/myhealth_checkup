

# Remove Icon from Manage Preferences Button

## Overview

Remove the Settings icon from the "Manage Preferences" button in the cookie consent banner to align with the minimalist button styling standard.

---

## Change Required

**File:** `src/components/compliance/CookieConsent.tsx`

**Location:** Lines 104-108

### Current Code:
```tsx
<Button
  size="sm"
  onClick={() => setShowSettings(true)}
  className="flex items-center gap-2 !bg-[#22c0d4] !text-white hover:!bg-[#fc0173] !border-[#22c0d4] hover:!border-[#fc0173] transition-all duration-200"
>
  <Settings className="h-4 w-4" />
  Manage Preferences
</Button>
```

### Updated Code:
```tsx
<Button
  size="sm"
  onClick={() => setShowSettings(true)}
  className="!bg-[#22c0d4] !text-white hover:!bg-[#fc0173] !border-[#22c0d4] hover:!border-[#fc0173] transition-all duration-200"
>
  Manage Preferences
</Button>
```

---

## Changes Summary

| Change | Details |
|--------|---------|
| Remove icon | Delete `<Settings className="h-4 w-4" />` from button content |
| Update className | Remove `flex items-center gap-2` as spacing classes are no longer needed without an icon |

---

## File to Modify

| File | Action |
|------|--------|
| `src/components/compliance/CookieConsent.tsx` | Remove Settings icon and update className |


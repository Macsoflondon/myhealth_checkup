

# Replace Header Logo and Increase Toolbar Spacing

## Overview

Two changes to the header:

1. **Replace the logo** with the newly uploaded `Logo_Text_Only.png` image
2. **Increase toolbar button spacing** to add more room between the navigation buttons and the header border

---

## Change 1: Replace Header Logo

**File:** `src/components/layout/Header.tsx`

### Steps:
1. Copy the uploaded image to the assets folder
2. Update the import to use the new logo
3. Keep the existing hover effect (scale + white glow shadow)

| Current | Updated |
|---------|---------|
| `import myhealthLogo from "@/assets/myhealth-logo.png"` | `import myhealthLogo from "@/assets/logo-text-only.png"` |

The hover effect is already in place on line 92:
```tsx
className="... transition-all duration-200 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
```

This creates the white glow effect on hover, which will be preserved.

---

## Change 2: Increase Toolbar Button Spacing

**File:** `src/components/layout/Header.tsx`

Currently the toolbar has `py-1` padding (line 84). Increasing this will add more vertical space between the navigation buttons and the pink border.

| Current (Line 84) | Updated |
|-------------------|---------|
| `py-1` | `py-2` or `py-3` |

This increases the vertical padding from 4px to 8px or 12px, creating more buffer between the buttons and the header border above.

---

## Files to Modify

| File | Action | Changes |
|------|--------|---------|
| `src/assets/logo-text-only.png` | **CREATE** | Copy uploaded image to assets |
| `src/components/layout/Header.tsx` | **MODIFY** | Update logo import + increase toolbar padding |

---

## Visual Summary

### Logo Change:
```text
Before: [Heart logo with "myhealth checkup"]
After:  [Text-only logo "myhealth checkup"]
        (with same white glow hover effect)
```

### Toolbar Spacing:
```text
Before:
┌─────────────────────────────────┐
│ Header with logo and controls   │
├─────────────────────────────────┤ ← Pink border
│▒Nav▒Buttons▒Close▒To▒Border▒▒▒▒│ ← py-1 (4px)
├─────────────────────────────────┤ ← Pink border

After:
┌─────────────────────────────────┐
│ Header with logo and controls   │
├─────────────────────────────────┤ ← Pink border
│                                 │
│  Nav  Buttons  More  Room       │ ← py-2/py-3 (8-12px)
│                                 │
├─────────────────────────────────┤ ← Pink border
```


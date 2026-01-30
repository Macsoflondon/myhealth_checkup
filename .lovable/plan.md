

# Cosmetic Changes: Header, Logo, and Sticky CTA Bar

## Overview

Making four changes to update the header section styling, logo, tagline colours, and sticky CTA bar button text:

1. **Sticky CTA Bar**: Change button text from "Compare" to "Find Your Test"
2. **Header background**: Change from turquoise (#22c0d4) to dark blue (#081129)
3. **Logo**: Replace current turquoise logo with dark blue background version
4. **Tagline colours**: Update "Your Health. Your Choice. One Trusted Platform!" to use:
   - "Your Health" in turquoise (#22c0d4)
   - "Your Choice" in pink (#e70d69)
   - "One Trusted Platform" in white (#ffffff)

---

## Change 1: Sticky CTA Bar Button Text

**File:** `src/components/common/StickyCtaBar.tsx`

| Current | Updated |
|---------|---------|
| Scale icon + "Compare Tests" / "Compare" | "Find Your Test" (text only, no icon) |

**Lines 62-66:**
```tsx
// Before
<Scale className="w-4 h-4 mr-1.5 sm:mr-2" />
<span className="hidden xs:inline">Compare Tests</span>
<span className="xs:hidden">Compare</span>

// After
Find Your Test
```

Also remove the `Scale` import from line 4.

---

## Change 2: Header Background Colour

**File:** `src/components/layout/Header.tsx`

Change the header background from turquoise to dark navy on both mobile and desktop views.

| Location | Current | Updated |
|----------|---------|---------|
| Line 48 (mobile) | `bg-[#22c0d4]` | `bg-[#081129]` |
| Line 89 (desktop) | `bg-[#22c0d4]` | `bg-[#081129]` |

---

## Change 3: Replace Logo with Dark Blue Version

**File:** `src/components/layout/Header.tsx`

The user wants the logo with the heart on a dark blue background. Looking at available assets:
- Current: `myhealth-logo-turquoise.png` (turquoise background)
- Available: `myhealth-logo.png` (likely dark blue version)

| Line 15 | Current | Updated |
|---------|---------|---------|
| Import | `myhealth-logo-turquoise.png` | `myhealth-logo.png` |

```tsx
// Before
import myhealthLogo from "@/assets/myhealth-logo-turquoise.png";

// After
import myhealthLogo from "@/assets/myhealth-logo.png";
```

---

## Change 4: Tagline with Coloured Text

**File:** `src/components/layout/Header.tsx`

Replace the static tagline banner image with styled text using the brand colours:
- "Your Health" → Turquoise (#22c0d4)
- "Your Choice" → Pink (#e70d69)
- "One Trusted Platform" → White (#ffffff)

### Desktop (Lines 102-108):
```tsx
// Before (image)
<img 
  alt="Your health. Your choice. One trusted platform!" 
  className="h-80 lg:h-96 xl:h-[28rem] w-auto object-contain" 
  src={taglineBanner} 
/>

// After (styled text)
<div className="text-center">
  <p className="text-lg lg:text-xl xl:text-2xl font-bold tracking-wide">
    <span className="text-[#22c0d4]">Your Health.</span>{" "}
    <span className="text-[#e70d69]">Your Choice.</span>{" "}
    <span className="text-white">One Trusted Platform!</span>
  </p>
</div>
```

### Mobile (Lines 70-76):
```tsx
// Before (image)
<img 
  alt="Your health. Your choice. One trusted platform!" 
  className="h-12 xs:h-14 w-full max-w-sm object-contain" 
  src={taglineBanner} 
/>

// After (styled text)
<div className="text-center">
  <p className="text-sm xs:text-base font-bold tracking-wide">
    <span className="text-[#22c0d4]">Your Health.</span>{" "}
    <span className="text-[#e70d69]">Your Choice.</span>{" "}
    <span className="text-white">One Trusted Platform!</span>
  </p>
</div>
```

Remove the `taglineBanner` import from line 16 (no longer needed).

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/common/StickyCtaBar.tsx` | Change button text to "Find Your Test", remove Scale icon |
| `src/components/layout/Header.tsx` | Change bg to dark blue, swap logo, replace tagline image with coloured text |

---

## Visual Summary

### Header Before:
```text
┌────────────────────────────────────────────┐
│  [Turquoise Background]                    │
│  [Logo]     [Tagline Image]    [Controls]  │
└────────────────────────────────────────────┘
```

### Header After:
```text
┌────────────────────────────────────────────┐
│  [Dark Blue Background]                    │
│  [Dark Logo]  Your Health. Your Choice.    │
│               One Trusted Platform!        │
│                     [Controls]             │
└────────────────────────────────────────────┘

Tagline colours:
- "Your Health." = Turquoise
- "Your Choice." = Pink
- "One Trusted Platform!" = White
```

### Sticky CTA Bar:
```text
Before: [⚖️ Compare]
After:  [Find Your Test]
```


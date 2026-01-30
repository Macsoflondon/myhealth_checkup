

# Cosmetic Fixes Plan

## Overview

Four cosmetic fixes to improve button styling and hover states:

1. **Sticky CTA Bar "Compare" button** - Show text "Compare" (currently "Find Your Test" was set but user wants "Compare")
2. **Hero "Start Your Search" button** - Turquoise background, turns white on hover
3. **Sign-in button (User icon)** - Hover should turn white (icon + border), not turquoise
4. **Language button** - Hover should turn white, not turquoise

---

## Issue 1: Sticky CTA Bar - Compare Button

**File:** `src/components/common/StickyCtaBar.tsx`

**Current behaviour:** Button shows "Find Your Test" text.

**Fix:** Change text to "Compare" to match user's request.

| Current | Updated |
|---------|---------|
| Find Your Test | Compare |

```tsx
// Before (line 64)
Find Your Test

// After
Compare
```

---

## Issue 2: Hero "Start Your Search" Button

**File:** `src/components/sections/Hero.tsx`

**Current behaviour (Line 144):**
```tsx
className="... bg-[#22c0d4] hover:bg-white hover:text-[#081129] ..."
```

This already has turquoise background with white hover. ✅ Already correct.

---

## Issue 3: Sign-in Button (UserMenu) - White Hover

**File:** `src/components/header/UserMenu.tsx`

**Current behaviour:** Pink icon/border that turns turquoise on hover.

```tsx
className="... text-[#e70d69] hover:text-[#22c0d4] hover:bg-[#22c0d4]/10 border-2 border-[#e70d69]/60 hover:border-[#22c0d4] ..."
```

**Fix:** Change hover to white instead of turquoise.

| Element | Current Hover | Updated Hover |
|---------|--------------|---------------|
| Icon colour | `hover:text-[#22c0d4]` | `hover:text-white` |
| Background | `hover:bg-[#22c0d4]/10` | `hover:bg-white/20` |
| Border | `hover:border-[#22c0d4]` | `hover:border-white` |

This change applies to **4 button instances** in UserMenu.tsx (lines 33, 60, 77, 104).

---

## Issue 4: Language Button - White Hover

**File:** `src/components/header/LanguageSwitcher.tsx`

**Current behaviour (Line 63):**
```tsx
className="... text-[#e70d69] hover:text-[#22c0d4] hover:bg-[#22c0d4]/10 border-2 border-[#e70d69]/60 hover:border-[#22c0d4] ..."
```

**Fix:** Same as UserMenu - change hover to white instead of turquoise.

| Element | Current Hover | Updated Hover |
|---------|--------------|---------------|
| Icon colour | `hover:text-[#22c0d4]` | `hover:text-white` |
| Background | `hover:bg-[#22c0d4]/10` | `hover:bg-white/20` |
| Border | `hover:border-[#22c0d4]` | `hover:border-white` |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/common/StickyCtaBar.tsx` | Change button text to "Compare" |
| `src/components/header/UserMenu.tsx` | Update 4 button hover states to white |
| `src/components/header/LanguageSwitcher.tsx` | Update button hover state to white |

---

## Summary of Hover State Changes

### Header Buttons (UserMenu + LanguageSwitcher)

```text
Default State:
┌─────────────┐
│  Pink icon  │  Pink border (#e70d69)
└─────────────┘

Hover State (NEW):
┌─────────────┐
│ White icon  │  White border + subtle white bg
└─────────────┘
```

### Sticky CTA Bar Compare Button

```text
Current:              Updated:
┌─────────────────┐   ┌───────────┐
│ Find Your Test  │ → │  Compare  │
└─────────────────┘   └───────────┘
```

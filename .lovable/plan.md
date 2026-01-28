
# Fix Pink Banner to Match Reference Design

## Problem Identified

The current `HealthAssetBanner` component uses turquoise (#22c0d4) for the highlighted words "health" and "asset", but the reference screenshot shows these words in a **yellow/gold colour**. Additionally, the reference shows **dark navy border accents** at the top and bottom of the banner.

---

## Visual Comparison

| Element | Current Implementation | Reference Screenshot |
|---------|----------------------|---------------------|
| "health" colour | Turquoise (#22c0d4) | Yellow/Gold |
| "asset" colour | Turquoise (#22c0d4) | Yellow/Gold |
| Top border | None | Dark navy (#081129) accent line |
| Bottom border | None | Dark navy (#081129) accent line |

---

## Changes Required

### File: `src/components/sections/HealthAssetBanner.tsx`

**Updates:**
1. Change the highlighted word colour from turquoise (#22c0d4) to a yellow/gold colour (approximately #FFD700 or similar warm gold)
2. Add dark navy (#081129) border accents at the top and bottom of the section

**Updated component:**

```tsx
const HealthAssetBanner = () => {
  return (
    <section className="bg-[#e70d69] py-6 sm:py-8 border-t-4 border-b-4 border-[#081129]">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white">
          Your <span className="text-[#FFD700]">health</span> is your greatest <span className="text-[#FFD700]">asset</span>!
        </h2>
      </div>
    </section>
  );
};

export default HealthAssetBanner;
```

---

## Summary of Changes

| Change | Before | After |
|--------|--------|-------|
| "health" span | `text-[#22c0d4]` | `text-[#FFD700]` (gold) |
| "asset" span | `text-[#22c0d4]` | `text-[#FFD700]` (gold) |
| Section borders | None | `border-t-4 border-b-4 border-[#081129]` |

---

## Files to Modify

| File | Action |
|------|--------|
| `src/components/sections/HealthAssetBanner.tsx` | **MODIFY** - Update highlight colour to gold, add navy border accents |

This will make the pink banner match the reference screenshot exactly, with gold-highlighted keywords and dark navy framing borders.

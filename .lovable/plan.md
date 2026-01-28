
# Create Pink Banner + Reorder Sections (Keep FeaturedPublications)

## Overview

Create the missing pink banner section matching the screenshot and move the "Our Partners Have Featured In" carousel to appear after "Your Health Journey Simplified".

---

## New Section Order

| Position | Component | Section Title |
|----------|-----------|---------------|
| 1 | `<Hero />` | Hero with search |
| 2 | `<MissionSection />` | "Your health is your greatest asset" (text + cards) |
| 3 | `<PartnersGrid />` | "Our Trusted Partners" (logo carousel) |
| 4 | **`<HealthAssetBanner />`** | **NEW - Pink banner** |
| 5 | `<JourneySimplified />` | "Your Health Journey Simplified" |
| 6 | `<FeaturedPublications />` | "Our Partners Have Featured In" (**MOVED here**) |
| 7 | `<MostPopularTestsSection />` | "Most Popular Tests" |
| 8 | `<TopConcernsSection />` | "Comprehensive Care" |
| ... | Rest unchanged | ... |

---

## Changes Required

### 1. Create New Component: HealthAssetBanner

**File:** `src/components/sections/HealthAssetBanner.tsx`

Full-width pink banner (#e70d69) with centered text:
- "Your **health** is your greatest **asset**!"
- "health" and "asset" highlighted in turquoise (#22c0d4)
- Rest of text in white
- Font: Montserrat bold, responsive sizing

```tsx
const HealthAssetBanner = () => {
  return (
    <section className="bg-[#e70d69] py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white">
          Your <span className="text-[#22c0d4]">health</span> is your greatest <span className="text-[#22c0d4]">asset</span>!
        </h2>
      </div>
    </section>
  );
};

export default HealthAssetBanner;
```

---

### 2. Update Homepage Section Order

**File:** `src/pages/Index.tsx`

**Changes:**
- Import new `HealthAssetBanner` component
- Insert `<HealthAssetBanner />` after `<PartnersGrid />`
- Move `<FeaturedPublications />` to appear after `<JourneySimplified />`

**Before:**
```tsx
<PartnersGrid />
<FeaturedPublications />  ← Current position
<JourneySimplified />
```

**After:**
```tsx
<PartnersGrid />
<HealthAssetBanner />     ← NEW
<JourneySimplified />
<FeaturedPublications />  ← MOVED here
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/sections/HealthAssetBanner.tsx` | **CREATE** - New pink banner component |
| `src/pages/Index.tsx` | **MODIFY** - Import banner, reorder sections |

---

## Visual Flow (After Changes)

```text
┌─────────────────────────────────┐
│           HERO                  │
│   (Search bar, trust signals)   │
├─────────────────────────────────┤
│       MISSION SECTION           │
│ "Your health is your greatest   │
│  asset" + Accreditation cards   │
├─────────────────────────────────┤
│    OUR TRUSTED PARTNERS         │
│     (Logo carousel)             │
├─────────────────────────────────┤
│  ████ PINK BANNER (NEW) ████    │
│  "Your health is your greatest  │
│          asset!"                │
├─────────────────────────────────┤
│  YOUR HEALTH JOURNEY SIMPLIFIED │
│     (3-step process)            │
├─────────────────────────────────┤
│ OUR PARTNERS HAVE FEATURED IN   │
│  (Publications carousel)        │
├─────────────────────────────────┤
│    MOST POPULAR TESTS           │
│         ...                     │
└─────────────────────────────────┘
```

This preserves the FeaturedPublications carousel while adding the pink banner and reordering to match your reference screenshot.

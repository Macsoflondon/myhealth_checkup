
# UI Refinements: Hero Button, H2 Headings, and Featured Publications

## Overview

Three visual refinements to improve consistency and reduce visual weight:

1. **Hero Search Button** - Remove icon, keep turquoise styling
2. **H2 Headings** - Standardise to single-line format with navy lead + gradient main text
3. **Featured Publications** - Reduce overall size and spacing

---

## Change 1: Hero "Start Your Search" Button

### Current State
```tsx
<Button className="... bg-[#22c0d4] ... text-white ...">
  <Search className="w-5 h-5 mr-3 flex-shrink-0" />
  <span>Start Your Search</span>
</Button>
```

### Target State
```tsx
<Button className="... bg-[#22c0d4] ... text-white ...">
  Start Your Search
</Button>
```

### File Changes
| File | Line | Change |
|------|------|--------|
| `src/components/sections/Hero.tsx` | 146 | Remove `<Search className="w-5 h-5 mr-3 flex-shrink-0" />` |
| `src/components/sections/Hero.tsx` | 147 | Change `<span>Start Your Search</span>` to plain text `Start Your Search` |

---

## Change 2: Standardise All H2 Headings to Single Line

### Current Pattern (SectionHeading component)
Two lines: Navy title on top, gradient subtitle below

### New Pattern (Single Line)
All on one line: "Navy Lead Words" + "Gradient Main Text"

Example: **"Your Health Journey"** (navy) **"Simplified"** (gradient) → becomes → **"Your Health Journey Simplified"** (navy + gradient inline)

### Update SectionHeading Component

**File:** `src/components/ui/section-heading.tsx`

Replace the two-element structure with a single inline h2:

```tsx
const SectionHeading = ({
  title,
  gradientText,
  className,
  titleClassName,
  gradientClassName,
  animate = true,
}: SectionHeadingProps) => {
  return (
    <div className={cn(
      "text-center mb-4 sm:mb-6",
      animate && "animate-fade-in",
      className
    )}>
      <h2 className={cn(
        "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold leading-tight",
        titleClassName
      )}>
        <span className="text-[#081129]">{title} </span>
        <span 
          className={cn(
            "bg-gradient-to-r from-[#22c0d4] to-[#e70d69] bg-clip-text text-transparent",
            gradientClassName
          )}
          style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          {gradientText}
        </span>
      </h2>
    </div>
  );
};
```

### Update Custom H2s in Other Sections

**File:** `src/components/sections/TopConcernsSection.tsx` (lines 119-124)

Current:
```tsx
<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
  Comprehensive Care for Your{" "}
  <span className="bg-gradient-to-r from-[#22c0d4] to-[#1a9aa8] bg-clip-text text-transparent">
    Top Concerns
  </span>
</h2>
```

Update to match standard gradient (turquoise to pink):
```tsx
<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
  <span className="text-[#081129]">Comprehensive Care for Your </span>
  <span 
    className="bg-gradient-to-r from-[#22c0d4] to-[#e70d69] bg-clip-text text-transparent"
    style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
  >
    Top Concerns
  </span>
</h2>
```

**File:** `src/components/sections/MostPopularTestsSection.tsx` (lines 91-96)

Current:
```tsx
<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
  The most popular tests from our{" "}
  <span className="bg-gradient-to-r from-[#e70d69] to-[#c70b5a] bg-clip-text text-transparent">
    providers
  </span>
</h2>
```

Update to standard format:
```tsx
<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-4">
  <span className="text-[#081129]">Most Popular Tests from Our </span>
  <span 
    className="bg-gradient-to-r from-[#22c0d4] to-[#e70d69] bg-clip-text text-transparent"
    style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
  >
    Providers
  </span>
</h2>
```

---

## Change 3: Shrink Featured Publications Section

### Current Sizes
- Section padding: `py-16 md:py-20`
- Title margin: `mb-12 md:mb-16`
- Publication text: `text-3xl sm:text-4xl lg:text-5xl xl:text-6xl`
- Grid gap: `gap-4 md:gap-6 lg:gap-8`

### Reduced Sizes
- Section padding: `py-8 md:py-12`
- Title margin: `mb-6 md:mb-8`
- Publication text: `text-xl sm:text-2xl lg:text-3xl xl:text-4xl`
- Grid gap: `gap-3 md:gap-4 lg:gap-5`

**File:** `src/components/sections/FeaturedPublications.tsx`

| Line | Current | New |
|------|---------|-----|
| 41 | `py-16 md:py-20` | `py-8 md:py-12` |
| 43 | `mb-12 md:mb-16` | `mb-6 md:mb-8` |
| 55 | `gap-4 md:gap-6 lg:gap-8` | `gap-3 md:gap-4 lg:gap-5` |
| 65 | `text-3xl sm:text-4xl lg:text-5xl xl:text-6xl` | `text-xl sm:text-2xl lg:text-3xl xl:text-4xl` |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/sections/Hero.tsx` | Remove Search icon from "Start Your Search" button |
| `src/components/ui/section-heading.tsx` | Restructure to single-line format with inline navy + gradient text |
| `src/components/sections/TopConcernsSection.tsx` | Update H2 to use standard turquoise-to-pink gradient |
| `src/components/sections/MostPopularTestsSection.tsx` | Update H2 to use standard format and gradient |
| `src/components/sections/FeaturedPublications.tsx` | Reduce padding, margins, and text sizes |

---

## Visual Result

### Before
- Hero button: Turquoise with magnifying glass icon + "Start Your Search"
- H2 headings: Two lines (title above, gradient below) OR mixed gradient directions
- Featured Publications: Large text, generous spacing

### After
- Hero button: Clean turquoise button with just "Start Your Search" text
- H2 headings: Single line with "Navy Lead Text" + "Turquoise-to-Pink Gradient" 
- Featured Publications: Compact section with ~40% size reduction

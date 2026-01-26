

# Implementation Plan: Import All Blog Articles and Style Updates

## Overview

This plan implements three key changes:
1. Import all 200+ articles from the CSV file into the blog system
2. Update "Read More" button styling (turquoise default, pink on hover)
3. Standardize all category badges to use the gradient style (turquoise to pink)

---

## Part 1: Import All CSV Articles

### CSV Analysis

The CSV file contains **approximately 215 unique articles** from four providers:
- **Lola Health**: ~150 articles across longevity, metabolic health, hormones, and testing guides
- **Medichecks**: ~35 articles on general health, blood testing, and lifestyle
- **Thriva**: ~50 articles on cholesterol, vitamins, women's health, mental health, and gut health
- **Goodbody Clinic**: ~10 articles on men's health, cancer screening, and nutrition

### Categories Found in CSV

The CSV includes these category topics that need mapping:
- Heart Health, Diabetes, Cancer Screening
- Men's Health, Women's Health
- Nutrition, Vitamins, Gut Health
- Hormones, Mental Health, Wellness
- Liver health, Blood tests, Cholesterol
- Fertility, Pregnancy, Menopause

### Data File Update

**File: `src/data/blogArticles.ts`**

The current file contains 31 articles. This will be expanded to include all 200+ unique articles from the CSV, structured with:
- Title from CSV
- Excerpt (blurb) from CSV
- URL to original provider blog
- Provider-specific stock images (using Unsplash URLs as placeholders)
- Provider name (Lola Health, Medichecks, Thriva, Goodbody Clinic)
- Primary category (first category from CSV category list)
- Publication date (generated based on article position)

---

## Part 2: "Read More" Button Styling

### Current Implementation

The "Read More" buttons currently use:
```
className="gap-1 text-[#e70d69] hover:text-[#e70d69]/80"
```
This shows pink text that fades on hover.

### New Implementation

Update to turquoise default with pink on hover:
```
className="gap-1 text-[#22c0d4] hover:text-[#e70d69] transition-colors"
```

### Files to Update

| File | Location | Change |
|------|----------|--------|
| `src/pages/HealthBlogPage.tsx` | Line 225 (FeaturedArticleCard) | Update button className |
| `src/pages/HealthBlogPage.tsx` | Line 295 (RecentArticleRow) | Update button className |

---

## Part 3: Category Badge Gradient Standardization

### Current Implementation

The `CategoryBadge` component uses a color mapping system:
- Turquoise: Blood tests, Heart health, Thyroid, Liver, Kidney
- Pink: Hormones, Women's health, Fertility, Sexual health, Men's health
- Navy: Cancer screening, Diabetes, Allergy testing
- Gradient: Only Vitamins, Wellness, Longevity

### New Implementation

All category badges will use the gradient style (turquoise blending to pink), matching the "Vitamins" badge styling.

**File: `src/components/ui/category-badge.tsx`**

Remove the color mapping system and always apply the gradient variant:
```tsx
export function CategoryBadge({ category, className, children }: CategoryBadgeProps) {
  return (
    <Badge 
      variant="gradient"
      className={cn("font-semibold", className)}
    >
      {children || category}
    </Badge>
  );
}
```

---

## Implementation Steps

### Step 1: Update Blog Data File
1. Parse all 215 unique articles from CSV
2. Remove duplicate articles (some appear on multiple pages)
3. Map categories to primary category
4. Generate appropriate dates for article ordering
5. Update `src/data/blogArticles.ts` with complete dataset

### Step 2: Update "Read More" Button Styling
1. Update `FeaturedArticleCard` button class in HealthBlogPage.tsx
2. Update `RecentArticleRow` button class in HealthBlogPage.tsx
3. Add transition-colors for smooth hover effect

### Step 3: Standardize Category Badges
1. Simplify `CategoryBadge` component to always use gradient variant
2. Remove the categoryColorMap constant (no longer needed)
3. Badge will show turquoise-to-pink gradient for all categories

---

## Expected Outcome

After implementation:

1. **Blog Page**: Will display 200+ articles from all four providers
   - Dynamic category filtering works with all new categories
   - Articles sorted by date with most recent first
   - External images load from Unsplash placeholders
   - "Read More" links open original provider blogs in new tabs

2. **Button Styling**: "Read More" buttons
   - Default: Turquoise (#22c0d4)
   - Hover: Pink (#e70d69)
   - Smooth colour transition

3. **Category Badges**: All badges display
   - Gradient from turquoise to pink
   - Consistent styling across all categories
   - White text for readability

---

## Technical Notes

### Image Handling

Since the CSV does not include actual image URLs, articles will use categorised Unsplash placeholder images:
- Health/Medical themed images
- Error fallback displays gradient placeholder
- Lazy loading for performance

### Category Normalization

The CSV uses various category formats (e.g., "Men's Health", "Women's health", "General health"). The system will normalize these to consistent formats for filtering.

### Duplicate Handling

Some articles appear on multiple CSV pages. The implementation will deduplicate by URL to ensure each article appears only once.


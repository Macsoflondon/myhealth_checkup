

# Implementation Plan: Dynamic Blog System and Tuli Health Removal

## Overview

This plan implements two major changes:
1. **Dynamic Blog System** - Replace static blog content with CSV-driven articles featuring external images and links to original provider blogs
2. **Tuli Health Removal** - Complete removal of Tuli Health from all frontend files and edge functions

---

## Part 1: Dynamic Blog System

### What We Are Building

A blog section that displays articles from your providers (Medichecks, Thriva, Goodbody, etc.) with:
- Article images loaded directly from external URLs
- "Read More" buttons linking to the original blog on the provider's website
- Provider badges showing which company wrote each article
- Category filtering to browse by topic
- Clean, responsive card layout matching the site design

### CSV Format Required

Your CSV file should contain these columns:

| Column | Description | Example |
|--------|-------------|---------|
| Title | Article headline | "Understanding Vitamin D Levels" |
| Excerpt | Short summary (50-100 words) | "Learn about vitamin D deficiency..." |
| URL | Link to original article | "https://medichecks.com/blog/vitamin-d" |
| Image | External image URL | "https://medichecks.com/images/vitamin-d.jpg" |
| Provider | Provider name | "Medichecks" |
| Category | Topic category | "Nutrition" |
| Date | Publication date | "2024-03-15" |

### Files to Create

**1. Blog Type Definition** (`src/types/blog.types.ts`)
- BlogArticle interface with all CSV fields
- Export types for use across components

**2. Blog Data File** (`src/data/blogArticles.ts`)
- Placeholder array ready for CSV content
- Once you upload your CSV, I will parse and populate this file
- Includes helper functions to get featured and recent articles

### Files to Update

**3. HealthBlogPage.tsx** - Complete refactor
- Remove static `featuredArticles` and `recentArticles` arrays (lines 11-57)
- Import blog data from new data file
- Add category filter state with active selection
- Update Featured Articles section:
  - Display external images with fallback handling
  - Add provider badge with provider logo
  - Link "Read More" to external URL (opens in new tab)
- Update Recent Articles section:
  - Show article thumbnail from external URL
  - Add provider badge
  - External link handling
- Dynamic category buttons that filter displayed articles

### Blog Card Design

Each article card will show:
- External image at top (with loading placeholder)
- Category badge (coloured by category type)
- Provider badge with provider logo
- Article title
- Excerpt (limited to 3 lines)
- Publication date
- "Read More" button linking to provider's original blog

---

## Part 2: Remove Tuli Health from Platform

### Frontend Files to Update (8 files)

| File | Line(s) | Change |
|------|---------|--------|
| `src/utils/providerUtils.ts` | 12, 24 | Remove `tuli-health` entries from logos and display names |
| `src/utils/providerRoutes.ts` | 24, 37, 84 | Remove `tuli-health` from route map, display names, and normalizeProviderFromName function |
| `src/components/sections/FeaturedProviders.tsx` | 68-77 | Remove Tuli Health from `featuredProviderData` array |
| `src/pages/FindClinicPage.tsx` | 186 | Remove Tuli Health from provider logos grid |
| `src/pages/TestDetailPage.tsx` | 61 | Remove `tuli-health` from providerRatings lookup |
| `src/components/header/MegaMenu.tsx` | 165 | Remove Tuli route check from getTestUrl function |
| `src/components/header/MobileMegaMenu.tsx` | 148 | Remove Tuli route check from getTestUrl function |
| `src/pages/AdminQuickClinicImportPage.tsx` | 114, 124 | Update description text to remove Tuli Health mentions |

### Edge Functions to Update (5 functions)

| Function | Change |
|----------|--------|
| `supabase/functions/ai-test-mapper/index.ts` | Remove `'tuli-health': 'TUL'` from PROVIDER_PREFIXES (line 64) |
| `supabase/functions/provider-scraper/index.ts` | Remove `'tuli-health'` test data block (lines 237-246) |
| `supabase/functions/bulk-add-clinics/index.ts` | Remove Tuli Health check from determineProvider function (line 181) |
| `supabase/functions/scrape-all-clinics/index.ts` | Remove `'scrape-tuli-clinics'` from scrapers array (line 90) |
| `supabase/functions/price-updates/index.ts` | Remove Tuli Health entries from seed data (lines 32-36, 50-54) |

---

## Implementation Steps

### Step 1: Create Blog Type and Data Structure
1. Create `src/types/blog.types.ts` with BlogArticle interface
2. Create `src/data/blogArticles.ts` with empty placeholder array
3. Add helper functions for filtering and sorting

### Step 2: Refactor Blog Page
1. Update imports in HealthBlogPage.tsx
2. Remove static article data
3. Add category filter state and handlers
4. Create BlogArticleCard component for featured articles
5. Create RecentArticleRow component for recent articles
6. Add external image handling with fallbacks
7. Add provider badges with logos
8. Configure "Read More" to open external URLs in new tabs

### Step 3: Remove Tuli Health (Frontend)
1. Update providerUtils.ts
2. Update providerRoutes.ts
3. Update FeaturedProviders.tsx
4. Update FindClinicPage.tsx
5. Update TestDetailPage.tsx
6. Update MegaMenu.tsx
7. Update MobileMegaMenu.tsx
8. Update AdminQuickClinicImportPage.tsx

### Step 4: Remove Tuli Health (Edge Functions)
1. Update ai-test-mapper/index.ts
2. Update provider-scraper/index.ts
3. Update bulk-add-clinics/index.ts
4. Update scrape-all-clinics/index.ts
5. Update price-updates/index.ts

### Step 5: Deploy and Test
1. Deploy updated edge functions
2. Test blog page renders correctly
3. Verify Tuli Health is completely removed
4. Confirm all provider pages still work

---

## After Approval

Once you approve this plan:

1. I will implement all changes immediately
2. The blog system will be ready to receive your CSV data
3. You can then upload your CSV file with the blog articles
4. I will parse the CSV and populate the blog data file
5. All Tuli Health references will be removed

---

## Provider Count After Changes

The platform will have **6 active providers**:
- Medichecks
- Goodbody Clinic
- Thriva
- Randox Health
- Lola Health
- London Medical Laboratory

---

## Technical Details

### External Image Handling

Images from provider URLs will be loaded with:
- Lazy loading for performance
- Error fallback to placeholder image
- Smooth fade-in transition when loaded
- Responsive sizing for mobile and desktop

### Category Filter Logic

The category filter will:
- Default to "All Articles" showing everything
- Allow single category selection
- Dynamically generate category list from article data
- Maintain brand colours (pink #e70d69, turquoise #22c0d4)

### External Link Security

All "Read More" links will:
- Open in new tab (`target="_blank"`)
- Include `rel="noopener noreferrer"` for security
- Display the provider name so users know where they are going


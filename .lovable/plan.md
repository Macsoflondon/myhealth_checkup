

# Standardise Hero Sections and Audit Home/Back Buttons Across All Pages

## Problem Summary

There are currently **three different hero/heading patterns** used across the site, with no consistency. Additionally, several pages are missing the Home and Back navigation buttons entirely.

### Current Hero Patterns Found

1. **HeroSection component** (navy background, white text, PageHeading + subtitle) -- used on ~25 pages (FAQs, Contact, Compare, Cancer Screening, health category pages, etc.)
2. **Inline PageHeading** with custom styling on a light or mixed background -- used on About Us, All Providers, Dashboard, etc.
3. **PageHeading inside a container** with Badge label, light grey background -- used on legal/policy pages (Terms, Cookie Policy, Accessibility, etc.)
4. **No hero at all** -- Sitemap, How It Works (uses its own component), and others

### Home/Back Button Audit

- `PageBreadcrumb` (renders the Home and Back icon buttons) is used on ~28 pages
- `PageNavButtons` (a fixed floating version) exists but is **never imported or used** anywhere
- **Pages missing Home/Back buttons entirely**: Terms and Conditions, Cookie Policy, Accessibility, Sitemap, Modern Slavery, Subscriptions, and several others

---

## Plan

### 1. Make HeroSection More Compact

Reduce the `HeroSection` component's vertical padding by approximately 3-4 lines worth of space. The current padding is `pt-10 pb-8` (mobile) up to `pt-16 pb-14` (desktop). This will be reduced to approximately `pt-6 pb-4` (mobile) up to `pt-10 pb-8` (desktop). The subtitle text size will also be reduced slightly for a tighter presentation.

### 2. Standardise All Pages to Use HeroSection

Every non-homepage page will be updated to use the shared `HeroSection` component with the navy (#081129) background and white text. This creates a uniform branded banner across the entire site.

**Pages requiring conversion from inline PageHeading to HeroSection:**
- AboutUsPage (currently custom navy layout with separate PageHeading)
- AllProvidersPage (currently inline PageHeading in a container)
- Dashboard (inline PageHeading)
- TermsConditionsPage (Badge + PageHeading on light bg)
- CookiePolicyPage (Badge + PageHeading on light bg)
- AccessibilityPage (Badge + PageHeading on light bg)
- SitemapPage (no hero at all)
- HowItWorksPage (no hero, uses own component)
- ModernSlaveryPage
- AffiliateDisclosurePage
- PrivacyPolicyPage
- FairTradingPolicyPage
- HowWeRankPage

**Pages already using HeroSection (will benefit from the compact sizing automatically):**
- FAQsPage, ContactPage, CompareTests, FindClinicPage, CancerScreeningPage, CancerComparisonPage, HealthBlogPage, LocationsPage, plus all health category pages (Thyroid, Heart, Gut, Diabetes, Vitamins, Men's Health, Women's Health, Fertility, Wellness, Conditions, At-Home Tests, Sports Performance, Hormones, etc.)

### 3. Ensure Home/Back Buttons on Every Page

Add `PageBreadcrumb` to every non-homepage page that currently lacks it. This will be placed directly below the hero section inside the main content container.

**Pages needing PageBreadcrumb added:**
- TermsConditionsPage
- CookiePolicyPage
- AccessibilityPage
- SitemapPage
- SubscriptionsPage
- ConditionsPage
- Any other pages found missing during implementation

### 4. Clean Up Unused Component

The `PageNavButtons` component (fixed floating version) is never used anywhere. It will be removed to reduce codebase clutter.

---

## Technical Details

### HeroSection Updated Padding (compact)
```
Before: pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12 lg:pt-16 lg:pb-14
After:  pt-6  pb-4  sm:pt-8  sm:pb-6  md:pt-10 md:pb-8  lg:pt-10 lg:pb-8
```

Subtitle text will reduce from `text-lg sm:text-xl md:text-2xl` to `text-base sm:text-lg md:text-xl` and bottom margin tightened.

### Standardised Page Structure
Every internal page will follow this pattern:
```
<Header />
<HeroSection title="Page Title" accent="Accent Text" subtitle="One-line description" />
<div className="container mx-auto px-4 pt-4">
  <PageBreadcrumb />
</div>
{/* Page content */}
<Footer />
```

### Files to Modify
- `src/components/sections/HeroSection.tsx` -- reduce padding
- ~15 pages converted to use HeroSection
- ~6 pages to add missing PageBreadcrumb
- `src/components/common/PageNavButtons.tsx` -- delete (unused)

### Estimated Scope
- 1 component update (HeroSection sizing)
- ~15 page refactors (hero standardisation)
- ~6 page additions (Home/Back buttons)
- 1 file deletion (PageNavButtons)


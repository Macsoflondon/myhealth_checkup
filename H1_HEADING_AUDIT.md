# H1 Heading Consistency Audit

## Standard: PageHeading Component
All H1 headings should use the `PageHeading` component from `@/components/ui/page-heading.tsx` which provides:
- **Font sizes**: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl`
- **Font family**: `font-heading` (Montserrat)
- **Font weight**: `font-bold`
- **Leading/tracking**: `leading-tight tracking-tight`
- **Two-line pattern**: Navy title + turquoise-to-pink gradient accent

## HeroSection Component
For category/landing pages, use `HeroSection` from `@/components/sections/HeroSection.tsx` which wraps `PageHeading` with a dark navy background section.

---

## ✅ COMPLIANT PAGES (Using PageHeading or HeroSection)

| Page | Component Used | Status |
|------|----------------|--------|
| AboutUsPage.tsx | PageHeading | ✅ |
| AllProvidersPage.tsx | PageHeading | ✅ |
| CancerBiomarkersReferencePage.tsx | HeroSection | ✅ |
| CancerComparisonPage.tsx | HeroSection | ✅ |
| CancerScreeningPage.tsx | HeroSection | ✅ |
| CompareTests.tsx | HeroSection | ✅ |
| ConditionsPage.tsx | HeroSection | ✅ |
| ContactPage.tsx | HeroSection | ✅ |
| CookiePolicyPage.tsx | PageHeading | ✅ |
| DiabetesTestingPage.tsx | HeroSection | ✅ |
| FAQsPage.tsx | HeroSection | ✅ |
| FertilityTestsPage.tsx | HeroSection | ✅ |
| GutHealthPage.tsx | HeroSection | ✅ |
| HealthBlogPage.tsx | HeroSection | ✅ |
| HeartHealthPage.tsx | HeroSection | ✅ |
| LocationsPage.tsx | HeroSection | ✅ |
| TermsConditionsPage.tsx | PageHeading | ✅ |

---

## 🔧 FIXED PAGES (Updated in this audit)

### H1 Fixes
| Page | Previous Issue | Fix Applied |
|------|----------------|-------------|
| HealthDataHub.tsx | Raw `<h1>` with `text-3xl font-bold` | Now uses PageHeading |
| AccessibilityPage.tsx | Raw `<h1>` with `text-4xl font-bold` | Now uses PageHeading |
| NotFound.tsx | Raw `<h1>` with `text-6xl font-bold` | Now uses PageHeading |
| EnhancedComparePage.tsx | Raw `<h1>` with `text-3xl md:text-4xl font-bold` | Now uses PageHeading |

### H2 Fixes (SectionHeading Component)
| Page | Previous Issue | Fix Applied |
|------|----------------|-------------|
| VitaminDeficiencyPage.tsx | 3× raw `<h2>` with inconsistent styles | Now uses SectionHeading |
| CallToAction.tsx | Raw `<h2>` with turquoise text | Now uses SectionHeading |
| MostPopularTests.tsx | Raw `<h2>` with `text-3xl font-bold` | Now uses SectionHeading |
| SportsPerformancePage.tsx | 8× raw `<h2>` with inconsistent styles | Now uses SectionHeading |
| TrustPlatformSection.tsx | Was PageHeading (H1) - reverted to section | Now uses SectionHeading |
| OutcomeTestimonials.tsx | Raw `<h2>` with inline pink span | Now uses SectionHeading |
| MedichecksTestDetailPage.tsx | Raw `<h2>` CTA heading | Now uses SectionHeading |

---

## ⚠️ SPECIAL CASES (Acceptable Variations)

| Page | Reason for Exception |
|------|---------------------|
| ClinicDetailPage.tsx | Dynamic clinic name H1 - needs custom sizing for long names |

---

## 📋 H2 AUDIT - REMAINING PAGES TO FIX

The following pages still have raw `<h2>` tags that should be converted to `SectionHeading`:

### High Priority (Public-facing pages)
- [x] MedichecksTestDetailPage.tsx ✅ Fixed
- [x] OutcomeTestimonials.tsx ✅ Fixed
- [ ] ProfileSettings.tsx (dashboard component)

### Medium Priority (65+ files total with H2 tags)
Many additional pages with H2s - to be addressed in future passes.

---

## Typography Standards Reference

### H1 (PageHeading)
```
text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight tracking-tight
```

### H2 (SectionHeading)
```
text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold
```

### Colours
- Navy (primary text): `#081129` / `text-[#081129]`
- Turquoise: `#22c0d4`
- Pink: `#e70d69`
- Gradient: `bg-gradient-to-r from-[#22c0d4] to-[#e70d69]`

---

## Audit Date
**Generated**: January 2026
**Last Updated**: January 2026



# Update Page Titles — All Routes

## Problem
- 6 pages have bloated titles (80–100+ chars) with the tagline "Your health. Your choice. One trusted platform!"
- 10 pages have overly long or multi-pipe titles exceeding 60 chars
- 16 pages have **no `<title>` tag at all** (no Helmet import)
- Inconsistent separator usage (some use `|`, some use `-`)

## Approach
Standardise all titles to `Page Name | myhealth checkup` format, under 60 characters. For pages without Helmet, add the import and a minimal `<Helmet><title>` block.

## Changes by file

### Pages WITH existing titles (update only the title string)

| File | Current title | New title |
|------|--------------|-----------|
| `Index.tsx` | "myhealth checkup - Compare Trusted Private Health Tests Across the UK" (70) | "myhealth checkup \| Compare UK Health Tests" (44) |
| `AboutUsPage.tsx` | "About Us - myhealth checkup" | "About Us \| myhealth checkup" (28) |
| `AssistedTestFinderPage.tsx` | "Find Your Perfect Health Test \| myhealth checkup - Your health..." (85) | "Find Your Health Test \| myhealth checkup" (41) |
| `MostPopularTestsPage.tsx` | "Most Popular Health Tests \| myhealth checkup - Your health..." (82) | "Most Popular Tests \| myhealth checkup" (38) |
| `WellnessPage.tsx` | "Wellness Blood Tests \| Comprehensive Health Screening \| myhealth checkup - ..." (97) | "Wellness Tests \| myhealth checkup" (34) |
| `HormonesPage.tsx` | "Hormone Blood Tests \| Comprehensive Hormone Testing \| myhealth checkup - ..." (93) | "Hormone Tests \| myhealth checkup" (33) |
| `HeartHealthPage.tsx` | "Heart Health Blood Tests \| Cholesterol & Cardiac Risk Testing \| myhealth checkup - ..." (98) | "Heart Health Tests \| myhealth checkup" (38) |
| `ThyroidPage.tsx` | "Thyroid Blood Tests \| TSH, T3, T4 & Antibody Testing \| myhealth checkup - ..." (94) | "Thyroid Tests \| myhealth checkup" (33) |
| `GutHealthPage.tsx` | "Gut Health & Microbiome Testing \| Compare UK Providers \| myhealth checkup" (75) | "Gut Health Tests \| myhealth checkup" (36) |
| `CompareTests.tsx` | "Compare Private Blood Tests - myhealth checkup \| Live Prices from UK Providers" (79) | "Compare Blood Tests \| myhealth checkup" (39) |
| `ProviderComparisonPage.tsx` | "Compare Health Test Providers \| Side-by-Side Comparison \| myhealth checkup" (76) | "Compare Providers \| myhealth checkup" (37) |
| `CancerBiomarkersReferencePage.tsx` | "Cancer Biomarkers Reference Library \| Tumour Markers Explained \| myhealth checkup" (83) | "Cancer Biomarkers Guide \| myhealth checkup" (44) |
| `CancerComparisonPage.tsx` | OK — 47 chars, keep as-is |
| `FindClinicPage.tsx` | OK — 49 chars, keep as-is |
| `LocationsPage.tsx` | "Clinic Locations \| Find Blood Test Clinics Near You \| myhealth checkup" (71) | "Clinic Locations \| myhealth checkup" (36) |
| `ClinicDetailPage.tsx` | Dynamic — already good pattern, keep |
| `ProviderProfilePage.tsx` | Dynamic — already good pattern, keep |
| `MedichecksMensHealthPage.tsx` | "Men's Health Checks and Blood Tests \| Medichecks \| myhealth checkup" (68) | "Men's Health \| Medichecks \| myhealth checkup" (46) |
| `MedichecksTestsCatalogPage.tsx` | "Medichecks Blood Tests \| Compare Health Tests UK" (49) | "Medichecks Tests \| myhealth checkup" (36) |
| `RecommendationsPage.tsx` | "AI Health Recommendations - Personalised Wellness..." (74) | "Health Recommendations \| myhealth checkup" (42) |
| `FAQsPage.tsx` | OK — 50 chars, keep as-is |
| `HowItWorksPage.tsx` | "How It Works - myhealth checkup" | "How It Works \| myhealth checkup" (31) |
| `ClientPortal.tsx` | "Your Health Portal \| MyHealth Checkup" | "Health Portal \| myhealth checkup" (33) |
| `HealthDashboardPage.tsx` | OK — 38 chars, keep as-is |
| `BloodTestAnalysisPage.tsx` | OK — 40 chars, keep as-is |
| `ConditionsPage.tsx` | OK — 42 chars, keep as-is |
| `TestCategoriesPage.tsx` | OK — 34 chars, keep as-is |
| `TrustedProvidersPage.tsx` | "Trusted UK Health Test Providers \| Quality Assured Testing Services" (67) | "Trusted Providers \| myhealth checkup" (37) |
| `GoodbodyClinicPage.tsx` | OK — 34 chars, keep as-is |

Also update matching `og:title` and `twitter:title` meta tags in each file.

### Pages WITHOUT Helmet (add import + title block)

| File | New title |
|------|-----------|
| `SportsPerformancePage.tsx` | "Sports Performance Tests \| myhealth checkup" |
| `MensHealthPage.tsx` | "Men's Health Tests \| myhealth checkup" |
| `WomensHealthPage.tsx` | "Women's Health Tests \| myhealth checkup" |
| `DiabetesTestingPage.tsx` | "Diabetes Testing \| myhealth checkup" |
| `CancerScreeningPage.tsx` | "Cancer Screening \| myhealth checkup" |
| `FertilityTestsPage.tsx` | "Fertility Tests \| myhealth checkup" |
| `ContactPage.tsx` | "Contact Us \| myhealth checkup" |
| `SitemapPage.tsx` | "Sitemap \| myhealth checkup" |
| `CookiePolicyPage.tsx` | "Cookie Policy \| myhealth checkup" |
| `TermsConditionsPage.tsx` | "Terms & Conditions \| myhealth checkup" |
| `NotFound.tsx` | "Page Not Found \| myhealth checkup" |
| `HealthBlogPage.tsx` | "Health Blog \| myhealth checkup" |
| `AtHomeTestsPage.tsx` | "At-Home Tests \| myhealth checkup" |
| `IntelligentSearchPage.tsx` | "Search \| myhealth checkup" |
| `PartnersPage.tsx` | "Our Partners \| myhealth checkup" |
| `NotificationHistoryPage.tsx` | "Notifications \| myhealth checkup" |

For each, add `import { Helmet } from 'react-helmet-async'` and wrap a `<Helmet><title>...</title></Helmet>` inside the return.

### Test page templates (dynamic titles from data)

Files like `VitaminDTestPage.tsx`, `GeneralHealthTestPage.tsx`, `IronProfileTestPage.tsx`, etc. use `TestPageTemplate` which receives `metaTitle`. These are already concise (e.g. "Vitamin D Test - Compare UK Providers \| MyHealth Checkup" at 55 chars). No changes needed.

## Summary
- ~20 files updated with shorter titles
- ~16 files get new Helmet blocks
- All titles follow `Page Name | myhealth checkup` pattern
- All under 60 characters


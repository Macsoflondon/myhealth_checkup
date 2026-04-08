

## Plan: Standardise All Legal Pages

### Summary
Apply consistent styling and correct contact information across all legal/compliance pages: Terms & Conditions, Privacy Policy, Cookie Policy, Modern Slavery, Affiliate Disclosure, Fair Trading Policy, How We Rank, and Accessibility.

### Changes

#### 1. Reduce PageBanner heading size (global change)
**File: `src/components/ui/page-heading.tsx`** (line 34)

Reduce the H1 sizes by roughly 25%:
- From: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl`
- To: `text-2xl sm:text-3xl md:text-4xl lg:text-5xl`

This affects all pages using PageBanner/PageHeading — keeping it uniform.

#### 2. Put titles on one line + white backgrounds

**Each legal page file** — two changes per file:

| Page | File | Title change | Background change |
|------|------|-------------|-------------------|
| Terms & Conditions | `TermsConditionsPage.tsx` | `title="Terms & Conditions"` (remove `accent`) | `bg-muted/30` → `bg-white` |
| Privacy Policy | `PrivacyPolicyPage.tsx` | `title="Privacy Policy"` (remove `accent`) | `bg-gray-50` → `bg-white` |
| Cookie Policy | `CookiePolicyPage.tsx` | `title="Cookie Policy"` (remove `accent`) | `bg-muted/30` → `bg-white` |
| Modern Slavery | `ModernSlaveryPage.tsx` | `title="Modern Slavery Statement"` (remove `accent`) | `bg-gray-50` → `bg-white` |
| Affiliate Disclosure | `AffiliateDisclosurePage.tsx` | `title="Affiliate Disclosure"` (remove `accent`) | `bg-gray-50` → `bg-white` |
| Fair Trading | `FairTradingPolicyPage.tsx` | `title="Fair Trading Policy"` (remove `accent`) | `bg-gray-50` → `bg-white` |
| How We Rank | `HowWeRankPage.tsx` | `title="How We Rank"` (remove `accent`) | `bg-gray-50` → `bg-white` |
| Accessibility | `AccessibilityPage.tsx` | `title="Accessibility Statement"` (remove `accent`) | `bg-muted/30` → `bg-white` |

#### 3. Update contact information to correct details

**Terms & Conditions** (`TermsConditionsPage.tsx`, lines 134-138):
- Email: `legal@myhealthcheckup.co.uk`
- Remove phone number line entirely
- Address: `Clapham, SW London, United Kingdom`
- Company Registration: `16589056`

**Accessibility** (`AccessibilityPage.tsx`, lines 121-123):
- Email: `accessibility@myhealthcheckup.co.uk` (keep as-is, appropriate for context)
- Remove phone number line
- Add: `Response time: We aim to respond within 2 business days` (keep)

**Cookie Policy** (`CookiePolicyPage.tsx`, line 120):
- Already shows `privacy@myhealthcheckup.co.uk` — keep as-is, appropriate

**Fair Trading** (contact info is inside `FairTradingPolicy.tsx` component, section 7):
- Already correct (Clapham, London, 07776330508, legal@myhealthcheckup.co.uk) — keep as-is

**Modern Slavery, Affiliate Disclosure, How We Rank** — no contact cards to update.

#### 4. Also update inner compliance component headings

The compliance components (`AffiliateDisclosure.tsx`, `ModernSlaveryStatement.tsx`, `HowWeRank.tsx`, `FairTradingPolicy.tsx`) have their own `PageHeading` inside the content area, duplicating the banner title. Remove these inner `PageHeading` calls since the `PageBanner` already provides the H1 — avoids duplicate headings.

### Files changed (up to 13 files)
- `src/components/ui/page-heading.tsx` — reduce font sizes
- 8 page files — title on one line, white background
- 2 page files — correct contact info (Terms, Accessibility)
- 4 compliance component files — remove duplicate inner PageHeading


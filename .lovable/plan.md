

## Plan: Legal Hub Page + Footer Copyright Line Update

### Summary
Create a new "Legal" hub page that lists all legal/compliance policies as links. Update the footer copyright line to show "Legal | Terms & Conditions" instead of "Privacy | Terms".

### Changes

#### 1. Create new Legal Hub page
**New file: `src/pages/LegalPage.tsx`**

A clean page with PageBanner title "Legal" listing all compliance pages as clickable cards/links:
- Privacy Policy → `/privacy-policy`
- Terms & Conditions → `/terms`
- Cookie Policy → `/cookies`
- Modern Slavery Statement → `/modern-slavery`
- Affiliate Disclosure → `/affiliate-disclosure`
- Fair Trading Policy → `/fair-trading`
- How We Rank → `/how-we-rank`

White background, consistent with other legal pages.

#### 2. Add route
**File: `src/routes/complianceRoutes.tsx`**

Add: `<Route path="/legal" element={<LegalPage />} />`

#### 3. Update footer copyright line
**File: `src/components/layout/Footer.tsx`** (lines 79-82)

- Change "Privacy" link to "Legal" pointing to `/legal`
- Change "Terms" to "Terms & Conditions" pointing to `/terms`

Result: `© 2026 myhealth checkup. All rights reserved. Legal | Terms & Conditions`

#### 4. Keep Legal column in footer grid as-is
The Legal column with its individual links stays — the new hub page is an additional convenience from the copyright bar.


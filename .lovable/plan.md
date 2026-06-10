Move the CMA & DMCC compliance statement from the global footer into the `/legal` hub page.

**What will change:**
1. **Remove** the `cma-dmcc-compliance` block from `src/components/layout/Footer.tsx` (lines 73-101).
2. **Add** the same compliance text as a full-width banner/section on `src/pages/LegalPage.tsx`, placed directly below the existing grid of legal-page cards and above the footer. The banner will keep its dark-theme glassmorphism styling (backdrop-blur, border, rounded-xl) so it remains visually distinct on the white legal-hub background.
3. **Preserve** all internal links (`/how-we-rank`, `/fair-trading`, `/complaints`) inside the moved text.

No new routes or components are required. The change is a straightforward relocate-and-style operation.
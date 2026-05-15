## Goal
Tidy the footer by removing the duplicated legal-links strip and the duplicated company line, and move the clinical reviewer reference into the Legal Hub.

## Changes

### 1. `src/components/layout/Footer.tsx`

**Company column** — add Legal Hub link directly under Contact:
```ts
const companyLinks = [
  ...,
  { name: t("footer.links.contact"), link: "/contact" },
  { name: "Legal Hub", link: "/legal" },
];
```

**Bottom legal/compliance strip** — delete the entire `<nav aria-label="Legal and compliance">` block containing Privacy, Cookie, Terms, Affiliate, Fair Trading, Modern Slavery, Accessibility, Medical Review, How We Rank, Legal Hub. Keep only the `© 2026 MYHEALTHCHECKUP LTD…` copyright line in that section.

**Medical disclaimer block** — simplify to a single concise paragraph:
- Remove the "Clinical content reviewed by Nathanial Smith, Registered Healthcare Professional (HCPC PA43353)" sentence and its `<Link>`.
- Remove the second paragraph "MYHEALTHCHECKUP LTD is the UK's leading health service comparison website. Company No. 16589056" (duplicates the © line).

Result:
```tsx
<div id="medical-disclaimer" ...>
  <p className="text-xs sm:text-sm leading-relaxed">
    <span className="font-semibold text-brand-pink">Medical disclaimer:</span>{" "}
    <span className="text-white/85">
      This site provides comparison information only and does not constitute
      medical advice. Consult your GP for medical guidance.
    </span>
  </p>
</div>
```

### 2. `src/pages/LegalPage.tsx`

Add the two items removed from the footer strip so the Legal Hub remains complete:
```ts
{ title: 'Accessibility Statement', path: '/accessibility', icon: <Icon>, description: '…' },
{ title: 'Medical Review & Editorial Standards', path: '/about/medical-review', icon: Stethoscope, description: 'Our clinical reviewer credentials and editorial process (Nathanial Smith, HCPC PA43353).' },
```

Pick lucide icons (e.g. `Eye` / `Accessibility`, `Stethoscope`) consistent with the existing list.

## Out of scope
- No copy changes elsewhere on site
- No route changes — all destinations already exist (`/legal`, `/about/medical-review`, `/accessibility`)
- No styling changes to Legal Hub cards

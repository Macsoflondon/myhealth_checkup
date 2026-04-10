

## Biomarker Library — Restyle Cards & Rename

### What changes

**1. Dark navy card backgrounds with white text**
- Card outer div: `bg-[#081129]` instead of `bg-white`, text classes switch to white
- Labels (Unit, Clinical Significance, etc.): `text-white`
- Description and body text: `text-white/70` instead of `text-muted-foreground`
- Range boxes: `bg-white/10` instead of `bg-[#081129]/5`, labels and values in white
- Chevron icons: `text-white/60`
- Border divider inside expanded card: `border-white/20`

**2. Biomarker code badges turn pink**
- The `<Badge>` showing the code (e.g. CTX, CGA): `bg-[#e70d69] text-white border-0` instead of `variant="outline"`

**3. Rename "Biomarker Database" → "Biomarker Library" across the platform**
Files to update:
- `src/pages/BiomarkerDatabasePage.tsx` — Helmet title, meta description, canonical URL, PageBanner title/accent, search placeholder
- `src/components/header/NavigationItems.tsx` — menu item name
- `plugins/ogMetaPlugin.ts` — OG meta title and description
- `src/routes/contentRoutes.tsx` — route path stays `/biomarker-database` (no URL break) but could optionally add `/biomarker-library` redirect

### Technical details

All changes are cosmetic class-name swaps and string replacements across 4 files. No structural or logic changes.


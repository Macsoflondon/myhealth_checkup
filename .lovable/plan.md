

# Plan: Health Resources Page — Gradient Line, Button Colours & Subtitle Rewrite

## Changes (all in `src/pages/HealthBlogPage.tsx`)

### 1. Replace white border with three-toned gradient line
The categories filter section (line 69) has `border-b` which renders as a white line. Remove `border-b` and add the standard gradient divider `<div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />` after the section closing tag.

### 2. Category filter buttons — turquoise idle state
Change inactive button styling (line 81) from `border-white/30 text-white` to turquoise background with white text, matching the platform button standard:
- Inactive: `bg-[#22c0d4] hover:bg-[#e70d69] text-white border-[#081129] border-2`
- Active: `bg-[#e70d69] hover:bg-[#e70d69]/90 text-white border-[#081129] border-2`

### 3. Rewrite subtitle
Change line 65 from:
> "Expert insights, health tips, and the latest research on preventive healthcare and health testing for UK adults aged 30-60."

To:
> "Expert insights, evidence-based guides, and the latest research to help you make informed decisions about your health."

This removes the age restriction, keeps the tone professional and inclusive, and appeals to the core demographic without excluding anyone.

### Scope
- 1 file modified: `HealthBlogPage.tsx`
- No structural or component changes


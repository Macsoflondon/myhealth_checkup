

## Invert Color Scheme on TestPageTemplate

The General Health test page (and all pages using `TestPageTemplate`) currently has a white/light background with white Card boxes and a navy header block. The request is to invert: **white background → white (stays), white boxes → dark navy, dark text → white**.

### Changes

**1. `src/components/tests/TestPageTemplate.tsx`**

- **Line 29**: Keep `bg-background` (white) — already correct
- **Lines 55-67** (Header block): Change `bg-[#081129]` to `bg-white`, text from `text-white` to `text-[#081129]`, add a subtle border
- **Lines 70-109** ("What's Included" Card): Add `bg-[#081129]` background, white text throughout — CardTitle, paragraph, section headings, marker list items, highlight sections
- **Line 102** (Feature badges): Change from `bg-[#081129]` to `bg-white` with navy text (inverting)
- **Lines 112-121** ("Why Choose" Card): Add `bg-[#081129]`, white CardTitle and list text

**2. `src/components/compare/ProviderComparisonSidebar.tsx`**

- **Line 12** (Card): Add `bg-[#081129]` with white text
- Provider sub-cards (line 17): Dark navy borders, white text for names/prices
- CardTitle (line 14): White text
- Button styling adjustments for visibility on dark background

**3. `src/components/compare/ProviderPriceComparison.tsx`**

- **Line 41** (Card): Add `bg-[#081129]` background
- CardTitle, price summary labels, provider names → white text
- Price summary grid background → darker navy variant
- Provider rows → adjusted borders/backgrounds for dark context

**4. `src/components/tests/SimilarTestsSection.tsx`**

- **Line 96** (Card): Add `bg-[#081129]` background
- CardTitle, description text, test names, provider badges → white/light text
- Inner bordered cards → navy-tinted borders with white text

All changes are CSS class swaps — no structural or data changes.


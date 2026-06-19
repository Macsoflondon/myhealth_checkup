## Goal
Replace every "Book with {provider}" call-to-action label on test cards and related booking buttons with a single "Book" label.

## Scope
All user-facing "Book with..." strings rendered inside test cards, detail modals, comparison tables, and provider-specific booking CTAs.

## Files to change
1. `src/components/cards/UnifiedTestCard.tsx` — lines 275, 287
2. `src/components/providers/ProviderTestCard.tsx` — line 216
3. `src/components/providers/ProviderTestDetailModal.tsx` — lines 393, 402
4. `src/components/compare/TestProviderPriceTable.tsx` — line 227
5. `src/components/compare/ProviderComparisonSidebar.tsx` — line 34
6. `src/pages/AtHomeTestsPage.tsx` — lines 251, 391
7. `src/pages/TestDetailPage.tsx` — line 389
8. `src/constants/providerTestPageConfig.ts` — all `ctaButtonText` entries (lines ~93, 139, 184, 229, 275, 321, 360, 399, 439)

## What stays the same
- Button styling, colours, and hover behaviour
- Navigation and routing logic
- The "Compare" secondary button on cards
- Any non-CTA "Book with Provider" strings (e.g. step titles)

## Technical detail
Each instance of the label text "Book with {providerName}" (or equivalent variable interpolation) will be replaced with the literal string "Book". No new dependencies. No functional changes.
---
name: Clinical spacing & accent tokens
description: Additive premium/success/alert tokens, warm surfaces, and clinical spacing utilities layered on top of locked brand palette
type: design
---

Brand colours remain locked: Turquoise `#22c0d4`, Pink `#e70d69`, Navy `#081129`. The tokens below are **additive** — never replace brand colours.

## New semantic colour tokens (index.css :root)
- `--premium-gold` `#D4A843` → `text-premium-gold` / `bg-premium-gold` — provider-of-the-month, premium badges only
- `--clinical-success` `#059669` → `text-clinical-success` / `bg-clinical-success` — biomarker "included" / positive states
- `--clinical-alert` `#DC2626` → `text-clinical-alert` / `bg-clinical-alert` — clinical alerts only, never decorative
- `--surface-warm` `#FAFAF8` → `bg-surface-warm` — warm off-white surfaces (avoid sterile pure white)
- `--text-charcoal` `#1A1A2E` → `text-text-charcoal` — primary text on warm surfaces (15.3:1 contrast)
- `--text-warm-grey` `#6B7280` → `text-text-warm-grey` — secondary text (4.5:1 on warm surface)

## Clinical spacing utilities
- `.container-clinical` — max-width **1200px** with responsive padding; replaces ad-hoc max-w-7xl wrappers
- `.section-y` — `py-12 lg:py-16` (48–64px section padding)
- `.section-y-lg` — `py-16 lg:py-24` for hero/feature bands
- `.card-clinical` — `rounded-xl p-6` (24px interior padding, 12px radius)
- `.grid-clinical` — `grid gap-8` (32px card gap, never 16px)

## Tailwind container
`container.screens.xl` and `2xl` both set to **1200px**. Default radius (`rounded`) is now **8px**, `rounded-lg` is **12px** (clinical standard).

## Rules
- Gold is for premium signalling only — not body accents.
- Success/alert greens & reds are semantic — never apply them decoratively.
- Pure white (`#fff`) is forbidden for large surfaces; use `bg-surface-warm` or existing pearl `bg-white` token (already pearl 97%).
- All new card grids should use `.grid-clinical`; tighter gaps require justification.

## Goal

Strip the "Popular Searches" block from the hero and reposition the search bar so it anchors to the bottom of the hero image, sitting just above the `TrustSignalsBar`.

## Changes in `src/components/sections/Hero.tsx`

1. **Remove the Popular Searches inner card** (lines ~252–282) — the entire `<div style={innerCardStyle} …>` wrapper plus both rows of chip buttons.
2. **Remove the now-unused `popularSearches` array** (lines 103–110).
3. **Remove the unused `innerCardStyle` definition** (lines ~155–159).
4. **Anchor the search bar to the bottom of the hero image**:
   - Change the inner content wrapper at line 181 from `pt-… pb-…` vertical padding to a flex column that fills the section height: `flex flex-col` with bottom-anchored search.
   - Give the section a defined height so "bottom" is meaningful: `min-h-[560px] sm:min-h-[640px] md:min-h-[720px] lg:min-h-[780px]` on the `<section>` at line ~156.
   - Inside the content wrapper, group the badge + headline + subline + divider + CTA buttons in a top block, then push the search bar group to the bottom with `mt-auto` (and a small bottom margin like `mb-6 sm:mb-8` so it doesn't touch the trust bar).
5. **Keep the search input card itself unchanged** — same glassmorphism, same width (`max-w-[855px] mx-auto`), same icon and placeholder. Just no inner Popular Searches card beneath it.

## Layout sketch (after)

```text
┌─ <section> hero image bg ──────────────┐
│  badge                                 │
│  headline                              │
│  subline                               │
│  ─ gradient divider ─                  │
│  [Find your test][Symptom][Goal]       │
│                                        │
│  (flex spacer pushes search down)      │
│                                        │
│  ┌ search bar (glass) ───────────┐     │
│  │ 🔍  Search from over 200…    │     │
│  └──────────────────────────────┘     │
└────────────────────────────────────────┘
   TrustSignalsBar (unchanged, below)
```

## Out of scope

- No changes to slides, headlines, badge, CTA buttons, trust bar, or downstream sections.
- No new search behaviour — same `handleKeyPress` → `/compare?search=…` routing.
- No copy changes.

## Files touched

- Edit: `src/components/sections/Hero.tsx` only.

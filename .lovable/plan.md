# Attach + stick the BrowseByCategoryBar

## Visual result

```text
┌──────────────────────────────────────┐
│ HeroMasthead                         │
└──────────────────────────────────────┘
            (gap)
┌──────────────────────────────────────┐  ← StatsBand "card"
│  [pill][pill][pill][pill][More][🌐👤] │  ← BrowseByCategoryBar (visually capped on top)
│  ┌────────────────────────────────┐  │
│  │ Your health is your greatest…  │  │  ← navy headline (unchanged)
│  │ [Find your test][Compare]      │  │
│  └────────────────────────────────┘  │
│  [stat][stat][stat][stat]            │  ← 4 stat cards (unchanged position)
└──────────────────────────────────────┘
```

Scrolling down: when the pill bar reaches the viewport top it detaches, pins to the top, and stays pinned through every section below. The navy block + stat cards continue scrolling up normally.

Scrolling back up: as the navy headline scrolls back past the pinned bar, the bar releases and re-merges into its original spot above the headline.

The 4 stat cards under the navy block **do not move** from their current position.

## How to build it

1. **`src/pages/Index.tsx`** — restructure so the sticky scope is the whole rest of the page (not just the small hero wrapper):
   - Close the current `mt-6 … space-y-6` wrapper after `<HeroMasthead />`.
   - Open a new wrapper that contains `<BrowseByCategoryBar />`, `<StatsBand />`, **and** every subsequent section (PartnersGrid, JourneySimplified, PartnerShowcaseGrid, etc.). This wrapper becomes the sticky parent, so the bar stays pinned for the entire downward scroll and releases naturally when scrolled back to its anchor.
   - Remove the vertical gap between `<BrowseByCategoryBar />` and `<StatsBand />` so they read as one card (no `space-y-*` between those two siblings, or wrap them in their own zero-gap flex column).
   - Drop the obsolete `#sticky-bar-hero-end` sentinel.

2. **`src/components/layout/BrowseByCategoryBar.tsx`** — minor styling tweak for the merged look:
   - When **not stuck**: square the bottom corners (`rounded-t-[22px] rounded-b-none`), drop the bottom shadow, and remove the bottom border so it flows seamlessly into StatsBand's pearl card.
   - When **stuck**: revert to fully rounded `rounded-[22px]` with the existing pinned shadow + blur background (current behaviour).
   - Keep the existing sentinel + IntersectionObserver "stuck" detection — it already works.
   - Sticky positioning, `top-0`, z-index, pill content, More dropdown, language/user cluster — all unchanged.

3. **`src/components/sections/StatsBand.tsx`** — minor styling tweak so the bar visually caps the navy card:
   - Square the **top** corners of the outer pearl card (`rounded-t-none rounded-b-[28px]`) and remove its top padding so the BrowseByCategoryBar above it sits flush.
   - Navy headline + CTAs unchanged.
   - 4 stat cards stay exactly where they are (under the navy block).

No changes to header, routes, or any other section.

## Why this works

`position: sticky` is bounded by its scrolling parent. By making the parent wrap *everything from the bar down to the end of the page*, the bar stays pinned through all sections and naturally re-merges with its anchor on scroll-up — no manual JS toggling, no flicker, no fixed-position clones.

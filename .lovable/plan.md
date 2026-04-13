

## Extend Layout Widths — Less Compacted, More Breathing Room

The platform currently constrains content too tightly. The Tailwind `container` maxes out at `1400px` on 2xl screens, and many sections add further inner constraints (`max-w-4xl` = 896px, `max-w-5xl` = 1024px, `max-w-6xl` = 1152px). On a 1572px viewport, this leaves large empty gutters.

### Changes

**1. Widen the Tailwind container (tailwind.config.ts)**
- Change `2xl` container screen from `1400px` → `1536px`
- Change `xl` from `1280px` → `1400px`
- This gives all `container mx-auto` sections more room automatically

**2. Widen inner max-width caps across sections**

These are the key bottlenecks. Each will be widened one step:

| Current | New | Affected areas |
|---------|-----|----------------|
| `max-w-4xl` (896px) | `max-w-5xl` (1024px) | About Us values grid, HowItWorks FAQs, CategoryPageBottom, compliance pages, PageBanner |
| `max-w-5xl` (1024px) | `max-w-6xl` (1152px) | TrustPlatformSection, TrustBadgesSection, Enhanced3StepProcess, PartnerShowcaseGrid inner grid, Dashboard |
| `max-w-6xl` (1152px) | `max-w-7xl` (1280px) | ExpertQuotes, HereToHelp, HealthResources, About Us values grid (already md:grid-cols-2) |
| `max-w-[1100px]` | `max-w-6xl` (1152px) | CategoryPageLayout card grid |

**3. Increase horizontal padding on wider screens**
- Add `lg:px-12 xl:px-16` to sections that currently only have `px-4 sm:px-6` so content breathes on large monitors without jumping to full-bleed

**4. Widen card grids where appropriate**
- Category page: allow `xl:grid-cols-4` for test cards on wide screens
- About Us values: allow `lg:grid-cols-4` instead of capping at `md:grid-cols-2`
- Partners/provider grids: ensure they fill the wider container

### Files to modify
- `tailwind.config.ts` — container screens
- `src/components/sections/PageBanner.tsx` — max-w-5xl → max-w-6xl
- `src/components/sections/Enhanced3StepProcess.tsx` — max-w-5xl → max-w-6xl
- `src/components/sections/TrustPlatformSection.tsx` — max-w-5xl → max-w-6xl
- `src/components/sections/TrustBadgesSection.tsx` — max-w-5xl → max-w-6xl
- `src/components/sections/ExpertQuotes.tsx` — max-w-6xl → max-w-7xl
- `src/components/sections/HereToHelp.tsx` — max-w-6xl → max-w-7xl
- `src/components/sections/CategoryPageBottom.tsx` — max-w-4xl → max-w-5xl
- `src/components/sections/PartnerShowcaseGrid.tsx` — max-w-5xl → max-w-6xl
- `src/components/category/CategoryPageLayout.tsx` — max-w-[1100px] → max-w-6xl, add xl:grid-cols-4
- `src/pages/AboutUsPage.tsx` — widen values grid, add lg:grid-cols-4
- `src/pages/HowItWorksPage.tsx` — max-w-4xl → max-w-5xl
- `src/pages/Dashboard.tsx` — max-w-5xl → max-w-6xl
- ~10 additional section/page files with tight max-w constraints

No structural or behavioural changes — purely spacing and width adjustments to let content breathe across the full viewport.


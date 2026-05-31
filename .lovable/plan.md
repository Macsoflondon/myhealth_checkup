## Goal

Bring the "Our Partners' Most Popular Tests" section (`DreamHealthShowcase.tsx`) into structural and typographic parity with the other homepage sections (Featured Partners, Start Your Journey, Testimonials, As Seen In, Accredited).

## Current state

- Filmstrip carousel renders first.
- The H2 heading + CTA button sit *below* the carousel and *above* the 9‑card grid.
- Heading uses `text-3xl sm:text-4xl md:text-5xl` — larger than every other homepage H2.
- No eyebrow badge above the title.

## Target structure (top → bottom)

```text
[ — Our Partners' Most Popular Tests — ]   ← eyebrow badge
       Find Your Perfect Test Match           ← H2 (standardised size)
       short supporting sentence               ← subhead
       [ Get my test match — 60 seconds ]     ← CTA button

       ───── carousel filmstrip ─────
       ───── 9 mixed-provider cards ─────
```

## Changes

### 1. `src/components/sections/DreamHealthShowcase.tsx`
- Move the existing `<div className="container … text-center mt-10 sm:mt-14">` block (heading + CTA) from below the carousel to **above** the carousel, inside the `<section>` before the filmstrip wrapper.
- Add an eyebrow badge directly above the H2 using the canonical pattern already used by `StartJourneySection`, `TestimonialCarousel`, and `FeaturedPublications`:
  ```tsx
  <div className="flex items-center justify-center gap-3 mb-4">
    <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
    <span className="text-brand-turquoise text-xs sm:text-sm font-semibold uppercase tracking-[0.25em]">
      Our Partners' Most Popular Tests
    </span>
    <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
  </div>
  ```
- Change the H2 copy to a benefit-led title (e.g. "Find Your Perfect Test Match") since the badge now carries the section label, and apply the standardised size class (see step 3).
- Keep the existing turquoise pill CTA, but place it under the H2 (with a one-line supporting sentence) so the header block is self-contained.
- Adjust top/bottom spacing on the carousel and grid so vertical rhythm matches neighbouring sections (`mt-10 sm:mt-14` between header→carousel, `mt-12 sm:mt-14` between carousel→grid).

### 2. Eyebrow badge consistency
Audit the other homepage sections for any that *don't* yet use the badge pattern and confirm: Featured Partners, Start Your Journey, Accredited & Verified, Testimonials, and As Seen In already use it (verified). Only `DreamHealthShowcase` is missing it — no other section changes required.

### 3. Standardised H2 size for all homepage sections
Adopt a single token via `SectionHeading` and direct H2s:

```text
text-2xl sm:text-3xl md:text-4xl font-heading font-bold leading-tight
```

- Update `src/components/ui/section-heading.tsx` default `h2` classes to the standardised size (currently `text-xl sm:text-2xl md:text-3xl lg:text-3xl` — slightly small).
- Update raw H2s in homepage sections to match. Files to touch:
  - `DreamHealthShowcase.tsx` (line 279)
  - `StartJourneySection.tsx` (line 14)
  - `FeaturedProvidersGlass.tsx` (line 159, currently `text-4xl md:text-6xl` — too large)
  - Any other homepage section H2 that diverges (sweep `src/components/sections/*` for `text-4xl|text-5xl|text-6xl` on H2 and normalise).

No copy changes outside the new badge text and the H2 rename in `DreamHealthShowcase`.

## Out of scope
- No changes to data fetching, scrapers, card content, or images — purely presentational header restructuring.
- No changes to non-homepage pages that reuse `SectionHeading` will be made unless the size change visibly regresses them; will spot-check after the edit.

## Validation
- Visually verify each homepage section's heading block now follows: badge → H2 → optional subhead → optional CTA → content.
- Confirm H2 font size is identical across all homepage sections at `sm`, `md`, and `lg` breakpoints.

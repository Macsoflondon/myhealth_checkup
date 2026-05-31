## Goal
Tidy the GOODBODY featured partner callout: remove the gradient dash divider between paragraph 2 ("...with confidence.") and paragraph 3 ("Choose from over..."), let the copy flow as one block, bump the body text slightly, and pull the existing "View Goodbody Profile" CTA inside the callout container so the whitespace is filled.

## Changes (single file: `src/components/sections/GoodbodyBentoShowcase.tsx`)

1. **Inside the row-2 callout div** (lines 76–87):
   - Delete the `<div className="w-12 h-px bg-gradient-to-r ... my-3" />` divider.
   - Merge to flowing copy. Proposed final text (3 short paragraphs, no divider):
     - P1: "**Goodbody Clinics** delivers **high-quality private blood tests** and **cancer screening** that are accessible, affordable, and convenient across the UK."
     - P2: "With **clinical-grade accuracy** and high-street accessibility, we empower people to take control of their health with confidence — no GP referral required."
     - P3: "Choose from over **60 blood and wellness tests**, each processed in **UKAS-accredited laboratories** and reviewed by a GP. Proactive health, made simple, reliable, and within reach."
   - Increase body size from `text-sm sm:text-base` to `text-base sm:text-lg` (with slightly tighter `leading-snug` on larger screens) so the text fills the taller callout.
   - Add a small "View Goodbody Profile" button at the bottom of the callout (same turquoise→pink hover styling, smaller padding to fit), wrapped in a `mt-4` flex container.

2. **Remove the duplicate CTA block** below the grid (lines 101–109) since the CTA now lives inside the callout.

3. Keep all kit tiles, logo tile, grid structure, spacing, and aspect ratios unchanged.

## Out of scope
- No changes to kit images, links, grid layout, or surrounding sections.
- No copy changes outside the callout.
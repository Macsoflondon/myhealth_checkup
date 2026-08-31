# Section spacing pass + fix bare "Most Popular Tests" cards

Two pieces of work:

## A. Homepage section-header spacing (as previously approved)

Tighten the gap between each homepage section's header and its content:

1. **"Accredited & Verified" label → logo carousel** (`PartnersGrid.tsx`): halve the dead space — heading margin `mb-8 sm:mb-10` → `mb-4 sm:mb-5`, eyebrow `mb-3` → `mb-2`.
2. **"Featured Partner of the Month"** (`FeaturedPartnerWheel.tsx`): section top padding cut by a quarter, `54px` → `40px`.
3. **"What We Compare"** (`TestCategoriesSection.tsx`): top padding `pt-16/20/24` → `pt-12/16/20`, header bottom margin `mb-10/14` → `mb-8/10`.
4. Sweep remaining homepage sections (Popular tests, Start journey, Testimonials, Clinic & Help, CTA, Newsletter) and apply the same ~25% reduction only where a header-to-content gap exceeds ~2.5rem. Sections already tight (Simple Process) stay untouched.

## B. Popular-tests cards show no test information

The screenshot cards come from `DreamHealthShowcase.tsx` ("Our Partners' Most Popular Tests"). Confirmed against the live data: the information **exists** — e.g. Goodbody Advanced Well Man has 48 biomarkers, "2-3 working days" turnaround, venous sample; Medichecks VLDL has turnaround "10 working days" but an empty description — the card simply never renders any of it. Today each card shows only provider, name, description, price.

Fix, aligned with the platform rule that every listing shows biomarkers, price, turnaround, and sample method:

- Add a compact metadata row under the description on each card: **biomarker count** ("48 biomarkers"), **turnaround** ("Results in ~2–3 working days", keeping non-guaranteed wording), and **sample method** (e.g. "Venous blood draw").
- When `description` is empty in the data (e.g. Medichecks VLDL), fall back to a factual composed line ("Single-biomarker test — VLDL cholesterol. Venous sample.") rather than rendering a blank paragraph, so no card looks empty.
- Where a field is genuinely missing, that chip is omitted — never a placeholder.

## What does not change

- No content, ordering, colour, or typography changes beyond the new metadata chips.
- Card grid, filmstrip carousel, modal, and data hooks untouched.

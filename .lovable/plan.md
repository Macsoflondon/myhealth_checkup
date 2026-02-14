

# Cleanup, Ticker Polish, and Testimonial Update

## 1. Delete StickyCtaBar Component

Remove the unused file `src/components/common/StickyCtaBar.tsx`. It is no longer imported anywhere after the previous edit.

## 2. Adjust Brand Ticker Scrolling Speed and Styling

Current animation runs at 25 seconds per cycle. Changes:

- **Slow the animation** from 25s to 35s for a calmer, more professional scroll pace
- **Add hover-to-pause** so users can read keywords more easily
- **Add a subtle fade effect** on both edges using CSS gradient masks, giving the ticker a polished "window" appearance rather than hard-cut edges

Files affected:
- `src/index.css` -- update the `.animate-ticker` duration to 35s, add hover pause rule
- `src/components/sections/BrandTicker.tsx` -- add gradient mask CSS classes to the container

## 3. Update Testimonial Carousel Quotes

Replace the current five testimonials with more specific, platform-focused quotes that reflect real user scenarios without making medical claims. Each quote will reference a concrete feature of the platform (comparison tools, accreditation transparency, pricing clarity, quiz functionality, no sign-up requirement). The testimonials will also include a short context line (e.g. "Used: Thyroid Comparison") to add credibility.

Updated testimonials:

| Name | Location | Context | Quote |
|------|----------|---------|-------|
| Sarah T. | London | Used: Blood Test Comparison | "I compared five different thyroid panels in under two minutes. Prices, biomarkers, turnaround -- all in one place. I wish I had found this sooner." |
| James R. | Manchester | Used: Cancer Screening Tests | "Knowing every provider listed uses UKAS-accredited labs made my decision straightforward. I did not have to second-guess the quality." |
| Priya K. | Birmingham | Used: Health Quiz | "The health quiz narrowed down exactly which blood test matched my concerns. No account required, no pressure -- just clear information." |
| David M. | Edinburgh | Used: Full Body MOT Comparison | "Other sites buried the total cost behind add-ons. Here, the pricing was upfront and honest. That transparency earned my trust." |
| Emma L. | Bristol | Used: Hormone Panel Comparison | "As a first-timer, I had no idea where to start. The side-by-side comparison made it simple to understand what each test actually covers." |
| Rachel H. | Cardiff | Used: Vitamin Testing | "Completely free, no sign-up, and genuinely independent. I have recommended it to everyone in my family." |

File affected:
- `src/components/sections/TestimonialCarousel.tsx` -- replace the testimonials array with the updated content above, add a `context` field rendered as a small badge or label beneath each reviewer's name

## Technical Summary

| Action | File | Type |
|--------|------|------|
| Delete | `src/components/common/StickyCtaBar.tsx` | Remove |
| Edit | `src/index.css` | Speed + hover pause |
| Edit | `src/components/sections/BrandTicker.tsx` | Gradient edge masks |
| Edit | `src/components/sections/TestimonialCarousel.tsx` | New testimonials + context label |

No new dependencies required.


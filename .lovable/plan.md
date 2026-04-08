

## Plan: Move "Take Control of Your Health Today" Between "Here to Help" and "Expert Quotes"

**File: `src/pages/Index.tsx`**

Reorder so `<CallToAction />` sits between `<HereToHelp />` and `<ExpertQuotes />`.

Current order:
1. TestimonialCarousel
2. **CallToAction** ← move from here
3. HereToHelp
4. ExpertQuotes

New order:
1. TestimonialCarousel
2. HereToHelp
3. **CallToAction** ← to here
4. ExpertQuotes


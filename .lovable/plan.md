

# Homepage Aesthetic Improvements Inspired by Healthy Metal

After reviewing healthy-metal.com and comparing it against the current myhealth checkup homepage, here are the key design techniques worth adopting -- all while preserving your existing content, brand colours, and information architecture.

## What Healthy Metal Does Well (Relevant to Us)

1. **Scrolling keyword ticker** -- a continuously scrolling horizontal strip of brand keywords that reinforces the value proposition
2. **Bold stat callouts** -- large percentage/number stats with short supporting text, displayed in a clean grid
3. **Stronger visual rhythm** -- alternating full-width coloured bands create clear section separation
4. **Testimonial carousel with category tabs** -- tabbed review carousel sorted by theme
5. **Expert endorsement section** -- authority quotes with photos, name, and credentials
6. **Comparison table** -- side-by-side "us vs others" to reinforce differentiation
7. **Cleaner FAQ accordion** -- inline expandable FAQ near the bottom of the page

## Proposed Improvements (7 Changes)

### 1. Add a Scrolling Brand Ticker Below the Hero Video

A horizontally auto-scrolling strip of brand keywords, similar to Healthy Metal's "CALM - RELAXATION - SLEEP" ticker. Ours would read:

**Blood Tests - Cancer Screening - Hormone Checks - Vitamin Testing - Heart Health - Thyroid - Full Body MOTs**

- Navy (#081129) background, white text, turquoise dot separators
- CSS-only infinite scroll animation (no JavaScript)
- Sits between the hero video and the hero content section

### 2. Add a Stats Highlight Section

A new section with large, bold numbers that build trust at a glance -- inspired by Healthy Metal's "95% Experienced better sleep" grid. For myhealth checkup:

| Stat | Label |
|------|-------|
| 200+ | Tests compared |
| 7 | Trusted providers |
| 100% | UKAS accredited labs |
| Free | No cost to compare |

- Four columns on desktop, two on mobile
- Large navy stat number, smaller grey label beneath
- White background with subtle turquoise top border
- Placed after the Mission Section heading banner

### 3. Add a "Why myhealth checkup?" Comparison Strip

A simple two-column comparison section (inspired by Healthy Metal's "vs Other brands" table) showing:

| myhealth checkup | Other comparison sites |
|---|---|
| UKAS accredited labs only | Mixed lab standards |
| CQC regulated providers | Unverified providers |
| No payments taken on our site | Payment intermediaries |
| Fully independent rankings | Pay-to-rank listings |
| Free to use, no registration | Account walls and upsells |

- Styled as a clean card with turquoise checkmarks for "us" and grey crosses for "others"
- Placed after the Journey Simplified section

### 4. Improve Section Separation with Full-Width Colour Banding

Currently several sections run together on white backgrounds. Healthy Metal uses alternating background colours to create strong visual rhythm. Changes:

- **JourneySimplified**: Change from `bg-white` to a light navy tint (`bg-[#081129]/[0.03]`) for subtle alternation
- **TopConcernsSection**: Add a top gradient divider (turquoise-to-pink) like the Mission Section already uses
- **FindClinicSection**: Add a subtle light turquoise background (`bg-[#f0fafb]`) instead of plain white
- These are CSS-only changes to existing section wrappers

### 5. Add a Testimonial/Review Highlights Section

A new carousel section showing curated user or provider quotes, similar to Healthy Metal's review carousel. Content would feature brief trust-building quotes from the platform's value proposition (not medical claims):

- Card-based carousel with auto-play
- Each card shows a quote, reviewer name, and a star rating
- Navy background section with white cards
- Placed before the "Here to Help" section

### 6. Streamline the Hero Content Card

The current hero has a lot of content stacked vertically (headline, mission text, comparison badges, CTAs, search bar, popular searches). Taking cues from Healthy Metal's cleaner hero layout:

- Move the mission text block out of the hero (it already exists in the MissionSection below)
- Remove the "Prices | Biomarkers | Turnaround Times" badges from the hero (they duplicate the trust signals bar)
- This makes the hero tighter: **Headline -> CTAs -> Search bar -> Popular searches -> Trust signals**

### 7. Add an Expert/Authority Quote Section

A new section featuring quotes from healthcare professionals or industry publications about the importance of health screening, styled like Healthy Metal's expert endorsement area:

- 2-3 quotes from published health guidance (NHS, NICE, or medical journals -- publicly available statements)
- Card layout with quote text, source name, and credentials
- Light background with turquoise accent borders
- Placed after FeaturedPublications

---

## Technical Details

### New Components to Create
- `src/components/sections/BrandTicker.tsx` -- CSS-only infinite scroll ticker
- `src/components/sections/StatsHighlight.tsx` -- Four-stat grid
- `src/components/sections/WhyChooseUs.tsx` -- Comparison table card
- `src/components/sections/TestimonialCarousel.tsx` -- Review card carousel
- `src/components/sections/ExpertQuotes.tsx` -- Authority quote cards

### Existing Components to Modify
- `src/components/sections/Hero.tsx` -- Remove mission text block and comparison badges
- `src/components/sections/JourneySimplified.tsx` -- Background colour change
- `src/components/sections/TopConcernsSection.tsx` -- Add top gradient divider
- `src/components/sections/FindClinicSection.tsx` -- Background colour change
- `src/pages/Index.tsx` -- Add new sections to the page layout

### Dependencies
- No new packages needed. The testimonial carousel reuses the existing `embla-carousel-react` and `embla-carousel-autoplay` already installed.

### Updated Homepage Section Order
1. Hero (streamlined)
2. Brand Ticker (new)
3. Mission Section heading banner
4. Stats Highlight (new)
5. Goodbody Feature
6. Partners Grid
7. Journey Simplified (new background)
8. Why Choose Us comparison (new)
9. Brand Video
10. Featured Publications
11. Expert Quotes (new)
12. Most Popular Tests
13. Top Concerns (with divider)
14. Testimonial Carousel (new)
15. Find Clinic (new background)
16. Here to Help
17. Trust Platform Section
18. Sticky CTA Bar


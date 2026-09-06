# Provider guides block on category pages

Add a short "guides" section of provider articles to the bottom of every category page, matched to the topic of the page you're on.

No press-logo row and no turquoise tick strip — those two parts of the reference screenshot are deliberately left out.

## Where it goes

Directly under the "Why Choose At Home Testing?" three containers, and above "Find the Right Health Test for You". Because that whole block is one shared section, this covers every page that uses it: At Home Test Kits, General Wellness, Women's Health, Men's Health, Sports & Fitness, Fertility, Paternity, Cancer Screening, plus symptom, goal and compare pages.

## What it looks like

- Heading in the page's own words: "At Home Test Kit Guides", "Women's Health Guides", "Cancer Screening Guides", and so on — derived from the page, not hard-coded per page.
- Three article cards across on desktop, one per row on mobile: hero image, provider name, category chip, title, short excerpt, date, linking out to the provider's original article.
- A "View all articles" link to the Health Resource Hub underneath.
- Navy text on white, turquoise/pink accents, same card look as the Health Resource Hub.

## How articles are matched

Per topic keyword set, in order:
1. keyword match on title and excerpt (at-home tests → finger-prick, home test kit, at-home, sample collection, blood spot; women's health → oestrogen, menopause, PCOS, fertility; cancer screening → PSA, early detection, bowel, prostate; and so on),
2. then article category match,
3. then most recent, so three slots always fill.

Provider spread is preferred so the three cards aren't all from one provider. If a topic has nothing relevant, the newest hub articles are shown rather than a gap.

## Technical notes

- New `src/components/sections/CategoryGuides.tsx` (heading + three cards + hub link) rendered inside `CategoryPageBottom` between the benefits grid and `QuizCTABanner`.
- New `src/lib/blog/topic-relevance.ts`: topic → keyword map, scoring and selection, with unit tests.
- New optional props on `CategoryPageBottom`: `topic?: string` and `guidesTitle?: string`, both defaulted from `benefitsTitle` so no existing call site breaks; pages that need a more precise topic (at-home, cancer, fertility, paternity) pass it explicitly.
- Article source is the existing static `src/data/blogArticles.ts` dataset the hub already falls back to — no new network calls, so SSR/prerender is unaffected.
- Presentation only: no data, scraper or route changes.

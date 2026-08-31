# Partner press strip + relevant provider articles below the quiz banner

Fill the empty white band that sits directly under the "Find the Right Health Test for You" quiz banner on category pages with two things:

1. **"Our partners have featured in"** — a static row of press logos (Bloomberg, The Guardian, Cosmopolitan, TechCrunch, and the rest of the existing set), styled light and restrained like the reference screenshot, not the navy scrolling carousel used on the homepage.
2. **Three provider articles from the Health Resource Hub**, matched to the topic of the page being viewed — so Women's Health / female hormones shows oestrogen, menopause and cycle-related pieces; Cancer Screening shows PSA / early-detection pieces; Thyroid shows thyroid pieces, and so on.

Each article card keeps the existing hub card look: hero image, provider name, category chip, title, excerpt, date, and a link out to the provider's original article. A "View all articles" link to the Health Resource Hub sits under the three cards.

## Relevance matching

Articles are selected by, in order:
1. keyword match on title + excerpt against a per-topic keyword set (e.g. female hormones → oestrogen, menopause, perimenopause, PCOS, fertility, period, HRT),
2. then blog `category` match (Hormones, Thyroid, Cancer Screening, Vitamins, Gut Health, Wellness…),
3. then most recent, to always fill three slots.

Provider spread is preferred so the three cards aren't all from one provider. If fewer than three relevant articles exist, the section falls back to the newest hub articles rather than rendering a gap.

## Where it appears

The block is added inside `CategoryPageBottom`, immediately after the quiz banner. That single change covers every page that already uses it: all category pages (Wellness, Women's/Men's Health, Cancer Screening, Most Popular, At-Home Kits), symptom and goal detail pages, and the compare pages. Pages pass their topic through a new optional prop; where it isn't passed, the section derives the topic from the page's benefits title/slug.

## Technical notes

- New component `src/components/sections/CategoryPressAndArticles.tsx` (press logo row + three article cards), plus `src/lib/blog/topic-relevance.ts` holding the topic → keyword map and the scoring/selection function, with unit tests.
- Press logo data is extracted from `FeaturedPublications.tsx` into a shared `src/data/pressLogos.ts` so both the homepage carousel and the new static strip read one list.
- Article source is the existing `blogArticles` dataset (same source the Health Resource Hub uses); no new network calls, so no impact on SSR/prerender.
- New optional `topic?: string` prop on `CategoryPageBottom`, defaulted so no existing call site breaks.
- Brand tokens only: navy text on the white band, turquoise/pink accents, no grey-on-grey; logos render greyscale with colour on hover.



# Update Goodbody Card Text and Tighten Slogan Spacing

## What will change

1. The slogan "Know more. Live Better." will move closer to the logo by removing remaining margin
2. The description paragraph will be replaced with the full version from the screenshot, split into three distinct paragraphs

## Updated description text (from the screenshot)

**Paragraph 1:** "GoodBody Clinics, provide comprehensive private health checks at affordable prices."

**Paragraph 2:** "Visit one of over 200 nationwide locations, or opt for their convenient home testing service. GoodBody Clinics has got you covered, Regulated by the CQC and we only exclusively utilise UKAS-accredited laboratory for our analysis."

**Paragraph 3:** "Providing you with a comprehensive GP review of your results. They offer a blend of clinical precision and convenient high-street accessibility. featuring over 60 different blood and wellness tests for you to choose from."

## Technical details

**File:** `src/components/sections/PartnerShowcaseGrid.tsx`

1. **Tighten slogan spacing**: Reduce the heading's `mb-3` to `mb-2` to bring it closer to the logo
2. **Replace the single `<p>` tag** (currently one condensed paragraph) with three separate `<p>` tags containing the full text from the screenshot
3. **Reduce paragraph bottom margin** from `mb-5` to `mb-4` to help fit the expanded content within the card


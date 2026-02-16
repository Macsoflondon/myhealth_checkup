

## Remove Text from Goodbody Card

Remove the two longer paragraphs from the Goodbody feature card, keeping only the first short paragraph ("GoodBody Clinics, provide comprehensive private health checks at affordable prices.").

### What will be removed
- "Visit one of over 200 nationwide locations, or opt for their convenient home testing service..." paragraph
- "Providing you with a comprehensive GP review of your results and featuring over 60 different blood and wellness tests..." paragraph

### What stays
- Logo
- "Know more. Live Better." heading
- First paragraph ("GoodBody Clinics, provide comprehensive private health checks at affordable prices.")
- "View Goodbody tests" button

### Technical detail
Delete lines 48-53 in `src/components/sections/PartnerShowcaseGrid.tsx` and adjust the bottom margin on the remaining paragraph from `mb-2` to `mb-3` for proper spacing before the button.


## Objective
Update the Featured Publications section heading so the main title is "Press & Media" rather than repeating the "As Seen In" section label.

## Change Details

### File: `src/components/sections/FeaturedPublications.tsx`
- **Line 71** (inside the `<h2>` element): change the text content from `As Seen In` to `Press & Media`.
- **Line 65** (the turquoise section label above the heading): leave as `As Seen In` — this acts as the section identifier.

### Verification
- Confirm no other "As Seen In" headings are duplicated within the same section context on the homepage.
- Ensure the visual hierarchy remains intact (turquoise label + white heading).
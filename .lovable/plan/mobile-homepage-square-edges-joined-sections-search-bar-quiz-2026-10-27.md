# Mobile homepage: square edges, joined sections, search bar, quiz button

## 1. Square corners on mobile only
- "Our trusted providers" (accredited & verified) and "Your health is your greatest asset" sections: no rounded corners and run edge to edge on phones; keep the current rounded corners from tablet width up.

## 2. Join the two sections with a search bar between them
- Remove the white gap between them on mobile, so the navy runs continuously.
- In that space, add a search bar (on the same navy, no white strip): "Search tests, biomarkers or symptoms" field plus search button. Submitting takes the visitor to the existing search results, reusing the site's current search rather than a new one.
- Desktop/tablet: search bar shown too, same placement; gap behaviour there unchanged apart from the bar.

## 3. "Take the health quiz" button
- Background: brand turquoise (#22c0d4) via the brand token, navy text kept legible.
- Soft shadow around the outside.
- On hover/focus: turns brand pink (#e70d69) with white text, smooth transition.

## Technical notes
- `PartnersGrid.tsx` and the quiz `<section>` in `Index.tsx`: `rounded-none sm:rounded-2xl`.
- Replace the `h-3 sm:h-4 bg-white` spacer in `Index.tsx` with a navy search band using `IntelligentSearch` (or a small form that navigates to the existing search route).
- Quiz CTA: `bg-brand-turquoise hover:bg-brand-pink focus-visible:bg-brand-pink shadow-lg`.
- Verify at 375px, 768px and 1351px; run homepage order test.

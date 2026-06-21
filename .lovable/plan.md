Re-insert the floating test-card overlay inside the hero image area (the dark carousel container) with the same auto-rotation logic that already drives `ad` and the slides.

### What to restore
- Positioned absolute at `right-[18px] bottom-[18px]` over the hero image.
- Glassmorphism white card (`bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_16px_40px_rgba(8,17,41,0.28)]`).
- Category pill on the left (`ad.color` background).
- Price on the right (`from £{ad.price}`).
- Test name in bold below.
- Provider name + optional provider logo (adapted to the current `Advert` shape which carries `providerLogo` and `providerKey`).

### What to omit this time
- The "Compare" CTA button and its `ArrowRight` icon at the bottom of the card.

### Technical details
- The `ad` variable and `ADVERTS` data already exist in `HeroMasthead.tsx`; only the JSX block needs re-inserting.
- Use `Link to={ad.url}` so the card remains clickable.
- Remove `ad.markers` references (that field no longer exists in the current `Advert` interface). Replace with the provider logo thumbnail if layout permits, or simply show `{ad.provider}` text.
- Ensure the overlay sits inside the relative hero-image container, after the gradient overlay div and before the closing `</div>` of that container.
- No other sections are touched; the compact stat-row footer stays as-is.
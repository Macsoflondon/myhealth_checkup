# Inset all live hero sections at tablet and desktop widths

## Scope
- Keep every unprefixed and `sm:` mobile style unchanged.
- Inset the homepage ticker, brand/category bar, and slide stage by approximately 57px per side from `md:` upwards.
- Increase the two shared page-hero insets from 40px to 97px at `md:` upwards.
- Increase the `/tests/:category` page’s existing 24px inset by 57px, to 81px at `md:` upwards, without redesigning the page.
- Leave the legacy `Hero.tsx` untouched. It is re-exported through barrel files but has no live component importer.

## Implementation
- Update only the responsive Tailwind classes in `HeroMasthead.tsx`, `CategoryStandardHero.tsx`, `StandardPageHero.tsx`, and `CategoryLandingPage.tsx`.
- For the homepage, use a 57px parent inset and stop the three child blocks cancelling it at `md:` and above; preserve the current full-bleed behaviour below `md`.
- Keep typography and mobile column sizing unchanged. Adjust only the `md:`/`lg:` copy-column width if viewport checks reveal awkward wrapping.

## Verification
- Capture the homepage at 390px, 768px, and 1280px+ and measure the slide-stage edges.
- Check all five homepage slides at tablet and desktop widths for clean headline, supporting-copy, and control wrapping.
- Capture representative routes using `CategoryStandardHero`, `StandardPageHero`, and the inline `/tests/:category` heading to confirm their new insets.
- Check horizontal overflow and run the relevant tests/lint checks available for these files.

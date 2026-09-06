# Redesign the /sitemap page

Rebuild `src/pages/SitemapPage.tsx` to match the chosen "Structured grid layout" direction, using the site's brand tokens.

## What changes

- **One file only:** `src/pages/SitemapPage.tsx`. Route, head metadata, Header/Footer and all link names + paths stay exactly as they are.
- **Surface:** pearl background (`#f7f9fc`) content area beneath the existing navy `PageBanner`, replacing the current full-navy body so the page reads as navy banner → light content, consistent with the rest of the site.
- **Structure:** 3-column grid on desktop (2 tablet, 1 mobile) of white cards with soft shadow and a light border that turns turquoise on hover.
- **Cards:** each of the five existing sections (Main Pages, Health Testing Services, Information & Support, Legal & Compliance, User Account) gets an icon tile — a small rounded square with a turquoise-tinted background and a Lucide icon, next to a navy Montserrat bold heading. Links in turquoise `#22c0d4`, medium weight, underline on hover. Existing link text and URLs unchanged (e.g. "Health Resources" still points to `/blog`).
- **Help panel:** sixth card in the grid — light turquoise-tinted background, navy heading, short copy, and a turquoise → pink brand-gradient button linking to `/contact` (worded "Contact us", not "chat", as there is no chat feature).
- **Typography:** Montserrat headings; Garamond serif accent only on the banner subtitle. No new fonts loaded.
- **Colours:** only brand tokens — navy `#081129`, turquoise `#22c0d4`, pink `#e70d69`, pearl `#f7f9fc`. No slate/teal from the prototype.

## Verification

- `bunx tsgo --noEmit` passes.
- Playwright: desktop and mobile screenshots of `/sitemap`, all links navigate, no overflow.

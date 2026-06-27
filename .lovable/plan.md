## Wire up the Goodbody wheel CTAs to real destinations

Update `src/components/sections/FeaturedPartnerWheel.tsx` so the three button groups deep-link to the right places instead of being dead `<button>` elements.

### 1. Modal "Book this test" → "Compare this test"

Rename the primary modal CTA and route it to the category compare page that matches the selected kit. Add a per-kit `compareHref` to the `FeaturedKit` type (optional) and a `categorySlug` on the built-in `DEFAULT_KITS`, then resolve through this map:

| Kit | Destination |
|---|---|
| Bowel Cancer Screening | `/tests/cancer` |
| HPV Cervical Cancer Screening | `/tests/cancer` |
| Early Cancer Screening | `/tests/cancer` |
| Lung Cancer Screening | `/tests/cancer` |
| Prostate PSA | `/tests/cancer` |
| Advanced Well Woman | `/tests/womens-health` |
| Female Hormone & Fertility | `/hormones` |
| Advanced Well Man | `/tests/mens-health` |
| Premium Complete | `/wellness` |
| Sports & Fitness | `/sports-performance` |

Convert the `<button>` to a react-router `<Link to={compareHref}>` styled identically. Label: **Compare this test**.

### 2. Idle blurb "Explore the range" → Goodbody Browse Available Tests

Change the existing `<button>Explore the range</button>` to a `<Link to="/providers/goodbody-clinic">` — that's the catalog route already used by the provider profile's "Browse Available Tests" CTA, so users land on the full Goodbody test list.

### 3. Idle blurb "Visit Goodbody" → Goodbody provider profile

Repoint the second button to `<Link to="/provider/goodbody-clinic">Visit Goodbody</Link>` (internal profile page), dropping the `ExternalLink` styling assumptions. Keep label "Visit Goodbody".

### Technical notes

- Add `import { Link } from "react-router-dom";` to the file.
- Keep the existing inline styles; just swap the element from `button` to `Link` (Link accepts `style`).
- The modal "Back" button stays as-is (close handler).
- No other files change. Provider profile and catalog routes already exist (`/provider/:providerId`, `/providers/goodbody-clinic`).

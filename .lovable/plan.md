

## Upgrade Provider Cards: Size, Ratings, Locations and Buttons

### Changes Overview

Four changes to `src/components/sections/FeaturedProviders.tsx`:

---

### 1. Increase card size by 50%

- Card padding: `p-6` to `p-8`
- Logo container: `w-16 h-16` to `w-24 h-24`
- Provider name: `text-lg` to `text-xl`
- Description: remove `line-clamp-2` so full text shows
- Grid gap: `gap-6` to `gap-8`
- Grid changes to 2 columns max on large screens (`lg:grid-cols-2`) so cards have more horizontal space, or stays at 3 columns with larger internal spacing -- recommend 2 columns for the 50% size increase

---

### 2. Correct star ratings and review counts to match Trustpilot/Feefo

Cross-checked ratings from provider review platforms:

| Provider | Current Rating | Actual Rating | Current Reviews | Actual Reviews | Source |
|---|---|---|---|---|---|
| Medichecks | 4.7 | 4.7 | 3,521 | 16,600+ | Feefo |
| Goodbody Clinic | 4.6 | 4.7 | 1,240 | 3,150+ | Trustpilot |
| Thriva | 4.5 | 4.4 | 2,156 | 2,800+ | Trustpilot |
| Randox Health | 4.8 | 4.6 | 1,847 | 26,100+ | Trustpilot |
| London Medical Lab | 4.4 | 4.5 | 892 | 3,250+ | Trustpilot |
| Lola Health | 4.3 | 4.5 | 567 | 143 | Trustpilot |

All ratings and review counts will be updated to match.

---

### 3. Standardise location to "UK Wide" for all providers

All six cards will show "UK Wide" instead of varying location text.

---

### 4. Restyle "Visit Website" button

- Remove the ExternalLink icon entirely
- Change from `variant="ghost"` to `variant="outline"` so it has a visible border/button shape
- Both "View Profile" and "Visit Website" sit side by side as equal-sized buttons on the same line (`flex-1` on both)
- Keep `flex-row` layout with `gap-2`

---

### Technical Detail

Single file change: `src/components/sections/FeaturedProviders.tsx`

- Update `featuredProviderData` array with corrected ratings, review counts, and standardised "UK Wide" locations
- Update card layout classes for larger sizing
- Update logo container dimensions
- Restyle the Visit Website button (remove icon, add outline variant, add `flex-1`)


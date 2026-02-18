

## Brand-Tailored Provider Profiles

### Scope

Update both the FeaturedProviders cards (at `/trusted-providers`) and the individual ProviderProfilePage (at `/provider/:id`) to reflect each provider's actual website branding. This means each card and profile page will have its own colour scheme, button styling, and visual identity based on what the provider actually uses on their own site.

### Provider branding extracted from websites

| Provider | Primary Colour | Accent/CTA | Text Style | Feel |
|---|---|---|---|---|
| Medichecks | Dark navy `#1C1C3A` | Hot pink `#E0005A` | White, clean sans-serif | Modern, clinical |
| GoodBody Clinic | Teal `#009B8D` | Dark navy `#1A2B4A` | White on teal, warm | Professional, accessible |
| Thriva | Deep purple `#3D1152` | Pink/coral `#E85D75` | White, rounded modern | Warm, friendly |
| Randox Health | Royal blue `#2D4BA0` | White/gold | White serif-inspired | Premium, clinical |
| Lola Health | Coral/salmon `#E8604C` | Dark teal `#1B4B5A` | Dark on light, modern | Friendly, wellness |
| London Medical Lab | Medical blue `#1565C0` | Purple `#6A1B9A` | White on blue, professional | Clinical, authoritative |

---

### Part 1: FeaturedProviders Cards

**File**: `src/components/sections/FeaturedProviders.tsx`

Currently all 6 cards use identical white cards with grey borders and the same turquoise "View Profile" button. The plan is to give each card a branded top accent bar and branded "View Profile" button colour.

**Changes per card:**

1. Add a `brandColors` map in the component that maps each provider ID to `{ accent, buttonBg, buttonHover, borderColor }`.

2. Apply a 4px coloured top border to each card using the provider's primary colour:
   - Medichecks: pink `#E0005A` top border
   - GoodBody: teal `#009B8D` top border
   - Thriva: purple `#3D1152` top border
   - Randox: blue `#2D4BA0` top border
   - Lola Health: coral `#E8604C` top border
   - London Medical Lab: blue `#1565C0` top border

3. Change each "View Profile" button background to match the provider's primary brand colour instead of the generic platform pink.

4. Update badge/tag styling per provider to use a lighter tint of their brand colour for the background.

---

### Part 2: ProviderProfilePage

**File**: `src/pages/ProviderProfilePage.tsx`

Currently the profile page uses a generic layout with the platform's primary colour for buttons and accents. The plan is to add a branded hero banner and buttons per provider.

**Changes:**

1. Create a `providerBranding` map (could live in a shared file like `src/data/providerBranding.ts`) containing:
   - `primaryColor` (hex)
   - `accentColor` (hex)
   - `heroGradient` (CSS gradient string using their colours)
   - `tagline` (from their website, e.g. "Unlock the Ultimate You" for Medichecks)

2. **Hero section** (lines 98-147): Replace the generic white card with a gradient banner using the provider's brand colours as the background. Provider name and description rendered as white text on the branded gradient.

3. **CTA buttons**: "Visit Website" and "Browse Available Tests" buttons styled with the provider's primary colour instead of the platform default.

4. **Trust signals banner** (lines 149-189): Tint the background with a light version of the provider's primary colour instead of generic `primary/5`.

5. **"Why Choose" section** (lines 354-398): Tint the feature cards with a light wash of the provider's accent colour.

---

### New shared file

**File**: `src/data/providerBranding.ts`

A single source of truth mapping provider IDs to brand data:

```text
medichecks:
  primary: "#E0005A"
  accent: "#1C1C3A"
  tagline: "Unlock the Ultimate You"
  gradient: "from-[#1C1C3A] to-[#E0005A]"

goodbody-clinic:
  primary: "#009B8D"
  accent: "#1A2B4A"
  tagline: "Know More. Live Better."
  gradient: "from-[#009B8D] to-[#1A2B4A]"

thriva:
  primary: "#3D1152"
  accent: "#E85D75"
  tagline: "Know your body. Own your health."
  gradient: "from-[#3D1152] to-[#E85D75]"

randox-health:
  primary: "#2D4BA0"
  accent: "#FFD700"
  tagline: "Your Health, Our Passion"
  gradient: "from-[#2D4BA0] to-[#1a2d6b]"

lola-health:
  primary: "#E8604C"
  accent: "#1B4B5A"
  tagline: "Unlock Your Longevity"
  gradient: "from-[#1B4B5A] to-[#E8604C]"

london-medical-laboratory (LondonMedicalLab):
  primary: "#1565C0"
  accent: "#6A1B9A"
  tagline: "Love My Life"
  gradient: "from-[#1565C0] to-[#6A1B9A]"
```

---

### Implementation sequence

1. Create `src/data/providerBranding.ts` with the brand data map
2. Update `FeaturedProviders.tsx` to import and apply per-card branding (border, buttons, tags)
3. Update `ProviderProfilePage.tsx` to import and apply per-provider branding (hero, buttons, trust section)

### What stays the same

- The overall myhealth checkup platform chrome (header, footer, nav) stays in platform brand colours
- The PartnerShowcaseGrid on the homepage is not affected (already has bespoke layouts for GoodBody and Medichecks)
- Provider data in `detailedProviders.ts` is unchanged
- Mobile-first responsive behaviour is preserved


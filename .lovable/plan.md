

## Replace GoodBody description with structured mission content

**File:** `src/pages/ProviderProfilePage.tsx`

**What changes:**
Replace the single `<p>` tag showing `provider.description` (line 149) with a conditional block for GoodBody that renders three structured sections — "Our Mission", "Who We Are", and "Our Services" — using the exact copy provided. For all other providers, the existing `provider.description` paragraph remains unchanged.

**Implementation:**
- At line 149, add a conditional: if `provider.id === 'goodbody-clinic'`, render the three sections with `<h3>` headings and `<p>` body text, styled consistently with the existing Medichecks expanded info block (same color/opacity logic using the `brand` variable).
- Otherwise, render the existing `<p>{provider.description}</p>`.

**Content to render for GoodBody:**

**Our Mission** — "You know your body better than anyone..." paragraph

**Who We Are** — "Goodbody Clinic is a trusted private health testing provider..." paragraph (250 partner clinics, 3,400+ Trustpilot reviews)

**Our Services** — "We offer one of the most comprehensive ranges..." paragraph (Well Man/Woman 48-51 biomarkers, Premium Complete 62 biomarkers, TruCheck™ cancer screening)


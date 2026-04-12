

## Add structured "What sets us apart" content for all provider profile pages

Currently, GoodBody Clinic has a structured content block with "What sets us apart" heading followed by "Our Mission", "Who We Are", and "Our Services" sections. Medichecks has a different expanded section. The remaining providers (Thriva, Randox, Lola Health, London Medical Laboratory) show only a single-line description.

This plan brings all six featured providers into the same structured format.

---

### Changes

**File: `src/pages/ProviderProfilePage.tsx`**

1. **Refactor the conditional block (lines 149-201)** — Replace the current `provider.id === 'goodbody-clinic'` check and separate Medichecks block with a single data-driven approach. Create a `providerStructuredContent` map keyed by provider ID, containing the three sections (mission, identity, services) for each provider. If the provider has an entry, render the structured block; otherwise fall back to the plain description paragraph.

2. **Remove the separate Medichecks block (lines 172-201)** — Fold Medichecks content into the same structured format, keeping the promo video after the sections.

### Content for each provider

**Medichecks** (update existing):
- **Our Mission**: Medichecks believe everyone deserves access to clear, reliable health information. Their mission is to make private blood testing simple, affordable, and clinically accurate — empowering you to understand your body and take proactive steps.
- **Who We Are**: Established in 2002, Medichecks is the UK's leading provider of at-home blood testing, offering over 300 tests across general health, hormones, vitamins, thyroid, sports performance, and more. All samples are analysed by UKAS-accredited laboratories. Rated 4.7/5 on Feefo with over 16,600 reviews.
- **Our Services**: From convenient finger-prick home kits to venous blood draws at nationwide partner clinics or home nurse visits. Every result includes a bespoke GP-reviewed report with personalised insights, delivered through the MyMedichecks online dashboard.

**Thriva**:
- **Our Mission**: Thriva exists to put health tracking in your hands. By making regular blood testing as routine as checking your phone, they help you spot changes early and stay on top of what matters.
- **Who We Are**: Thriva is a subscription-based health testing platform offering convenient at-home finger-prick kits with doctor-reviewed results. All samples are processed in UKAS-accredited partner laboratories. Rated 4.4/5 on Trustpilot with over 2,800 reviews.
- **Our Services**: Choose from a range of health tests covering heart health, liver function, diabetes risk, vitamins, and hormones. Results are delivered via the Thriva app with personalised insights and biomarker tracking over time. Subscription plans available for regular monitoring.

**Randox Health**:
- **Our Mission**: Randox Health is driven by a single goal: preventing disease before it starts. Using world-leading diagnostic technology, they deliver some of the most comprehensive health checks available in the UK.
- **Who We Are**: Part of Randox Laboratories, a global diagnostics leader with over 40 years of innovation. Randox Health operates state-of-the-art clinics in London, Liverpool, and Belfast, offering in-depth health assessments with UKAS-accredited and FDA-approved testing. Rated 4.6/5 on Trustpilot with over 26,100 reviews.
- **Our Services**: Comprehensive health packages including full-body checks, cancer risk screening, genetic testing, and cardiovascular assessments. All tests are conducted at modern clinic facilities with professional consultation and personalised health recommendations included.

**Lola Health**:
- **Our Mission**: Lola Health was built on a simple idea: professional blood testing should come to you. No finger-pricks, no clinics, no compromise — just accurate results from the comfort of your home.
- **Who We Are**: Lola Health is a modern health testing platform offering at-home phlebotomy — a trained professional visits your home to take a venous blood sample. All tests are processed in NHS-accredited (ISO 15189) laboratories and reviewed by qualified doctors. Rated 4.7/5 on Trustpilot with over 140 reviews.
- **Our Services**: Over 40 blood tests available, from comprehensive panels like Core Health 45 and Peak Insights to individual biomarkers starting from £11.88. Results are delivered via the Lola Health app with doctor-reviewed insights and health trend tracking.

**London Medical Laboratory**:
- **Our Mission**: London Medical Laboratory is committed to delivering fast, accurate diagnostic testing with clinical-grade precision. Their goal is to make professional laboratory services accessible to everyone, not just those with a GP referral.
- **Who We Are**: A UKAS-accredited (ISO 15189) laboratory offering over 100 blood tests with some of the fastest turnaround times in the UK — many results within 24 hours. Professional clinic-based venous blood collection with partner locations across the country. Rated 4.5/5 on Trustpilot with over 3,250 reviews.
- **Our Services**: Comprehensive test menu including health MOTs, hormone profiles, vitamin panels, allergy testing, and fertility assessments. All samples are processed in their own accredited laboratory with expert analysis and results delivered via online portal or email.

### Technical approach

- Define a `Record<string, { mission: string; whoWeAre: string; services: string }>` object inline or at the top of the component
- Single rendering block: if provider ID exists in the map, render "What sets us apart" + three `<h3>` sections; otherwise render `<p>{provider.description}</p>`
- Keep the Medichecks promo video as an additional element after the structured content for that provider only
- Same brand-aware styling as the existing GoodBody block


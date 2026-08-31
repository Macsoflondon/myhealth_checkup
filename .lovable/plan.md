# Update Trusted Providers hero strapline

## Goal
Replace the current strapline under the "ACCREDITED & VERIFIED" hero on `/trusted-providers` with copy that emphasises partner vetting, UKAS accreditation, and CQC regulation.

## Current text
"Only UKAS-accredited laboratories and CQC-regulated clinics we compare, with their accreditations shown in full."

## Proposed new text
"All our partners have been stringently assessed and are accredited and verified, using only UKAS-accredited laboratories and CQC-regulated clinics."

## Where to change
- File: `src/pages/TrustedProvidersPage.tsx`
- Prop: `strapline` on `<StandardPageHero />` (currently line 44)

## Acceptance criteria
- The hero paragraph displays the new strapline verbatim.
- No other page content or component structure is changed.

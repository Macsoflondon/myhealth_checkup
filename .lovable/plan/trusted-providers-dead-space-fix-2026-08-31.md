# Trusted Providers dead-space fix

## Goal
Remove the large empty white band between the `/trusted-providers` hero divider and the first provider card on mobile and desktop.

## Changes

### Remove both sources of the highlighted white space
- File: `src/components/sections/FeaturedProvidersGlass.tsx`
- Delete the empty decorative header block, including its `py-10` spacing.
- Remove the section's top padding (`py-16 md:py-24`) and retain only bottom padding, with a small mobile-safe top inset so the first card follows directly after the hero.
- Keep the provider grid and trust footer unchanged.

## Acceptance criteria
- No blank white band appears between the hero gradient divider and the first provider card.
- Verify the result at mobile and desktop widths in the live page.
- Provider cards and trust footer remain visually intact.

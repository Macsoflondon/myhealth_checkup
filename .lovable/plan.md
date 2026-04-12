

## Change "View Website" link color to match "Accredited" badge

The "Accredited" badge uses `text-green-800` (green). The website link in the Contact Information card currently uses the provider's brand primary color via `style={{ color: brand ? brand.primary : 'hsl(var(--primary))' }}`.

### Change in `src/pages/ProviderProfilePage.tsx`

**Line 325** — Change the website link color from brand primary to green-800 to match the "Accredited" badge:

```tsx
// From:
style={{ color: brand ? brand.primary : 'hsl(var(--primary))' }}

// To:
className="hover:underline text-sm md:text-base break-all touch-manipulation text-green-800"
```

Remove the inline `style` prop entirely so the link uses the same green as the accreditation badge.


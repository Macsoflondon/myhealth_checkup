

## Add "Accredited & Verified" Label and Clickable Provider Cards

### What changes

**File: `src/components/sections/AccreditedProvidersBar.tsx`**

1. **Add "Accredited & Verified" label** above the existing H2 heading, matching the uploaded screenshot style:
   - Uppercase turquoise text with `tracking-[0.25em]`
   - Flanked by turquoise horizontal lines (same pattern used in PartnerShowcaseGrid and FeaturedPublications)

2. **Make provider cards clickable** by wrapping each card in a `<Link>` from react-router-dom, routing to `/provider/{providerId}` (the existing provider profile route). The `goodbody-clinic` card will link to `/provider/goodbody` per the existing routing convention.

### Technical details

- Import `Link` from `react-router-dom`
- Add the label div before the `<SectionHeading>` component
- Replace the outer `<div>` of each provider card with `<Link to={/provider/${id === 'goodbody-clinic' ? 'goodbody' : id}}>`
- Add `cursor-pointer` to the card classes


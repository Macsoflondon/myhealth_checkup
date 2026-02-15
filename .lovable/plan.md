

# Standardise "As Seen In" Labels Across the Platform

## What is changing

There are two components that display an "As Featured/Seen In" label. The `FeaturedPublications` component has a polished, on-brand style while `PartnerShowcase` uses a plain grey heading. This plan brings the `PartnerShowcase` label in line with the sharp `FeaturedPublications` style.

## The target style (from FeaturedPublications)

- Turquoise text colour (`text-brand-turquoise`)
- Small uppercase text with wide letter-spacing (`text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em]`)
- Flanked by two horizontal turquoise lines (`h-px w-8 sm:w-12 bg-brand-turquoise/40`)
- Centred with flexbox and gap

## Change

**File: `src/components/PartnerShowcase.tsx` (line 28)**

Replace the plain grey `<h3>` heading:

```tsx
<h3 className="text-center text-lg text-gray-500 font-semibold mb-6">AS FEATURED IN</h3>
```

With the standardised "As Seen In" label using the same markup and classes as `FeaturedPublications`:

```tsx
<div className="flex items-center justify-center gap-3 mb-6">
  <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
  <span className="text-brand-turquoise text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em]">
    As Seen In
  </span>
  <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
</div>
```

This also unifies the wording from "AS FEATURED IN" to "As Seen In" for consistency.


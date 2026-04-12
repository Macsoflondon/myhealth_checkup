

## Add "What sets them apart:" heading above the GoodBody mission content

**File:** `src/pages/ProviderProfilePage.tsx` (line 150)

**Change:** Insert a styled heading "What sets them apart:" at the top of the GoodBody conditional block, before the "Our Mission" section. It will use the same brand-aware color styling as the existing `<h3>` headings but slightly larger/bolder to serve as an introductory label.

**Implementation:**
- Inside the `<div className="space-y-4 ...">` block (line 150), add as the first child:
```tsx
<h2 className="font-bold text-xl mb-2" style={{ color: brand ? '#fff' : 'hsl(var(--foreground))' }}>
  What sets them apart:
</h2>
```
- Everything else remains unchanged.




## Remove video from Medichecks profile page

### Change

**File: `src/pages/ProviderProfilePage.tsx` (lines 253-264)**

Delete the conditional block that renders the Medichecks promo video:

```tsx
// Remove this entire block:
{provider.id === 'medichecks' && (
  <div className="pt-2">
    <video ... />
  </div>
)}
```

Single deletion, no other files affected.


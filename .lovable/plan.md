## Changes to `UnifiedTestCard.tsx` (single source of truth — all category pages already render through it, so updating it standardises every card automatically)

### 1. Widen card by ~0.5 cm (~19 px)
In `CategoryPageLayout.tsx`, the card is constrained by `className="w-full max-w-[340px]"`. Bump to `max-w-[360px]` (≈ +20 px ≈ 0.5 cm at 96 dpi).

### 2. Shaded container around each biomarker
The "Key Markers" pills currently render with no background (the `style` was set on the `<span>` but the pill styling is missing padding/radius). Update each marker chip to:

```tsx
<span
  key={m}
  className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
  style={{ backgroundColor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)" }}
>
  {m}
</span>
```

Also add a small gap above the chips row (`mt-1.5`) and keep the "Key Markers:" label as the existing styled span.

### 3. Standardise all cards
Because every category page (`WomensHealthPage`, `MensHealthPage`, `HeartHealthPage`, `HormonesPage`, etc.) already passes data into `UnifiedTestCard` via `CategoryPageLayout`, the two edits above propagate to every card. No per-page changes required.

### Files touched
- `src/components/cards/UnifiedTestCard.tsx` — biomarker pill styling
- `src/components/category/CategoryPageLayout.tsx` — `max-w-[340px]` → `max-w-[360px]`

### Out of scope
No data, routing, or business-logic changes. Pure presentation.

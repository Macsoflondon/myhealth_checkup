## Move "Most Popular" badge to the right end of the top strip

In `UnifiedTestCard.tsx` (lines ~138–157), the top strip currently renders the category pill and the "Most Popular" badge side-by-side on the left inside a `flex items-center gap-2` row.

### Change
Add `justify-between` to the strip and wrap the two badges so:
- Category pill (e.g. "Hormones") stays on the **left**
- "Most Popular" badge moves to the **right**

```tsx
<div className="flex items-center justify-between gap-2 mb-3 bg-[#22bed3] rounded-2xl">
  {badge?.toLowerCase().includes("most popular") && (
    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide text-white"
          style={{ backgroundColor: categoryColor }}>
      {category}
    </span>
  )}
  {badge && (
    <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide text-white ml-auto"
          style={{ backgroundColor: categoryColor }}>
      {badge}
    </span>
  )}
</div>
```

The `ml-auto` on the badge ensures it sits flush right even when the category pill is missing.

### Files touched
- `src/components/cards/UnifiedTestCard.tsx` — single line edit on the strip wrapper + add `ml-auto` to the badge span.

### Out of scope
No data, copy, or colour changes.

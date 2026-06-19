Extend `ProviderTestCardData` in `src/components/providers/ProviderTestCard.tsx` with the optional display-only fields that `UnifiedTestCardProps` consumes, so a single object can be passed both as `testDetails` and to derive card props.

Add (all optional, alongside existing fields):

```ts
categoryColor?: string;
badge?: string;
rating?: number | null;
// reviews already added
price_from?: boolean;
markers?: string[];
compare_selected?: boolean;
onCompareToggle?: () => void;
```

Notes:
- `name`, `biomarkers`, `turnaround`, `collection`, `provider` are already covered by existing fields (`test_name`, `biomarker_count`, `turnaround_days_text`, `sample_type`/`collection_options`, `provider_id`) — no rename needed; mapping happens at the call site.
- `testDetails` in `UnifiedTestCardProps` already accepts the existing shape (`id`, `provider_id`), so no change needed there.
- No consumer changes; all additions are optional.
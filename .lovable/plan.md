Update the `markers` field in the `ProviderTestCardData` interface to allow explicit `null` values.

## Technical Detail

In `src/components/providers/ProviderTestCard.tsx`, change:

```ts
markers?: string[];
```

to:

```ts
markers?: string[] | null;
```

This mirrors the recent change to `categoryColor` and allows the interface to accept `null` from the data layer without casting.
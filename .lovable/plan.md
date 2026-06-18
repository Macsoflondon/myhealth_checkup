Add `reviews?: number | null` to the `ProviderTestCardData` interface in `src/components/providers/ProviderTestCard.tsx` (line 8).

This makes the interface consistent with other test data shapes that expose a review count, allowing cards and modals to optionally display star/rating metadata when available.

No other files need to change — the field is optional (`?`) and nullable, so all existing consumers remain compatible.
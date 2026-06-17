## Increase Card Shadow Depth

The test cards in `DreamHealthShowcase.tsx` currently use `shadow-sm` (default) and `shadow-lg` (on hover). Bump both up by two shades:

- Grid cards (line 319): `shadow-sm` → `shadow-lg`, `hover:shadow-lg` → `shadow-2xl`
- Filmstrip cards (line 285): `shadow-md` → `shadow-lg`
- Filmstrip skeleton placeholders (line 274): `shadow-md` → `shadow-lg`

No other files or logic change.
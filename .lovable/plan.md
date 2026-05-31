## Fix Medichecks Sports Hormone image fallback

**Root cause** — `src/components/sections/DreamHealthShowcase.tsx`

The latest scrape renamed the row from `Sports Hormone Blood Test` to `Sports Performance Hormone Blood Test for Health and Fitness`. The provider override lookup uses an exact key match on a cleaned name:

```ts
"medichecks": { "sports hormone": "https://www.medichecks.com/cdn/shop/files/sports-hormone-blood-test-618906.png", ... }
```

After `cleanName` the new title becomes `Sports Performance Hormone`, which no longer equals `"sports hormone"`. `image_url` is `null` in the DB, so it falls through to the topic regex and lands on the generic `bloodTestKit` asset (the "generated image" you're seeing).

### Fix

In `src/components/sections/DreamHealthShowcase.tsx`:

1. Change `providerOverrides` matching from exact key equality to substring/regex contains, so `"sports hormone"` matches inside `"sports performance hormone"`.
   - Iterate the provider's entries and return the first whose key appears as a substring of the cleaned, lowercased test name.
2. Keep the existing entries intact (advanced well man/woman, advanced thyroid function, optimal health, etc.) — substring match still works for those.
3. As belt-and-braces, also add the explicit entry `"sports performance hormone": <same medichecks URL>` so future exact-key edits remain unambiguous.

No DB / migration / scraper changes needed.
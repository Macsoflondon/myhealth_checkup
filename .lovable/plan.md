## Goal
Restrict `/at-home-tests` to **finger-prick tests only**. Today the page also surfaces saliva, urine, stool, swab, venous-only, and NULL sample-type tests.

## Current vs. proposed filter

Database breakdown of `home_kit_available=true, is_addon=false, is_active=true`:

```text
Finger-prick or Venous              59  ✅ keep
Finger-prick                        34  ✅ keep
At-home finger-prick                13  ✅ keep
Venous or finger-prick blood ...     1  ✅ keep
At-home finger-prick or venous       2  ✅ keep
Stool sample                         4  ❌ drop
Stool                                2  ❌ drop
Blood (venous)                       3  ❌ drop
Swab or Urine                        2  ❌ drop
Urine                                1  ❌ drop
NULL                                 1  ❌ drop
```

Net result: ~109 finger-prick tests shown (down from ~122).

## Changes

**`src/hooks/queries/useAtHomeTests.ts`** — both `useAtHomeTests` and `useAtHomeCategories`:

Replace the current broad `.or(...)` with a single strict filter:

```ts
.ilike("sample_type", "%finger%")
```

This keeps every variant that contains "finger" (covers "Finger-prick", "At-home finger-prick", "Finger-prick or Venous", etc.) and drops stool / urine / swab / venous-only / NULL.

Categories list will auto-rebuild from the filtered set, so any category that becomes empty (e.g. a stool-only "Gut Health" entry) drops out of the chip rail automatically.

## Copy
No copy changes needed — the hero already says "Finger-prick blood tests, delivered to your door".

## Out of scope
- No schema changes, no new columns, no admin tooling.
- Other pages (`/popular-tests`, category pages, provider catalogs) are untouched.
- The universal card/modal work from the previous turn is unaffected.

## Goal

The trust-signal strip currently lives inline at the bottom of `src/components/sections/Hero.tsx` (the white bar with Shield / FlaskConical / MapPin / Clock / Stethoscope items). Alignment and spacing tweaks have been made repeatedly to it — extract it once so future changes happen in a single place and the same styling can be reused on other pages (e.g. category pages, provider pages, FAQs hero) without copy-paste drift.

## What to build

A new presentational component:

```text
src/components/common/TrustSignalsBar.tsx
```

Responsibilities:
- Render a horizontally-scrollable, centered row of icon + label items.
- Own all alignment/spacing rules currently inlined in Hero (container padding, gap, icon size, font weight, leading, `whitespace-nowrap`, `overflow-x-auto scrollbar-hide`).
- Accept an `items` prop so callers can pass their own list, with a sensible default matching the current Hero list so existing usage doesn't change.
- Accept an optional `className` for outer-wrapper overrides (e.g. removing the bottom border on dark sections).

Proposed API:

```ts
type TrustSignal = { icon: LucideIcon; text: string };

interface TrustSignalsBarProps {
  items?: TrustSignal[];        // defaults to the 5 Hero signals
  className?: string;           // outer wrapper override
}
```

Default items (unchanged copy):
- Shield — "UKAS-accredited labs"
- FlaskConical — "200+ tests available"
- MapPin — "Clinics nationwide"
- Clock — "Results in 3–5 days"
- Stethoscope — "No GP referral needed"

## Refactor in Hero

In `src/components/sections/Hero.tsx`:
- Remove the local `trustSignals` array and the inline `<div className="bg-white py-2 …">…</div>` block (currently lines ~112–118 and ~299–310).
- Render `<TrustSignalsBar />` in its place, immediately after the closing `</section>`.
- Drop the now-unused `Shield, FlaskConical, MapPin, Clock, Stethoscope` imports from Hero.

## Styling baseline (carried over verbatim)

```text
wrapper:  bg-white py-2 sm:py-3 px-2 sm:px-4 border-b border-border
          overflow-x-auto scrollbar-hide
inner:    container mx-auto
row:      flex items-center justify-center gap-x-4 sm:gap-x-7 lg:gap-x-10
          flex-nowrap
item:     flex items-center justify-center gap-2 leading-none whitespace-nowrap
icon:     w-4 h-4 sm:w-6 sm:h-6 text-primary flex-shrink-0
label:    text-primary font-extrabold text-[11px] sm:text-xl leading-none
```

These are the values currently shipping in Hero — no visual change on the homepage; the refactor is purely structural.

## Out of scope

- No new placements on other pages in this pass — the component is created and adopted in Hero only. Adding it elsewhere is a follow-up.
- No design changes (colors, weights, sizes stay identical to the current Hero implementation).
- No data-source changes — items remain hardcoded defaults inside the component.

## Files touched

- Add: `src/components/common/TrustSignalsBar.tsx`
- Edit: `src/components/sections/Hero.tsx` (remove inline bar + array, import & render new component, prune lucide imports)
- Optional: re-export from `src/components/common/index.ts` for ergonomic imports.

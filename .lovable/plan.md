## Plan

### Root cause summary
Do I know what the issue is? Yes.

`PromoTracker` is not failing because of Supabase, API calls, or edge functions. It is a purely client-side marquee.

The actual problems are:
1. **It diverges from the working ticker pattern** used elsewhere in the app.
   - `PromoTracker` runs at `0.09 px/ms` (~90 px/s), which is much faster than the other working tickers.
   - It renders **8 duplicated sets**, adding unnecessary DOM and measurement work.
   - It adds extra stateful UI (`dbg` button + overlay + pause timers) inside the sticky strip.
2. **Its wrap logic is less robust than the simpler working trackers.**
   - It starts translating even when the measured set width is not yet stable.
   - If width is stale/zero during initial layout or font settling, it can drift off-screen before wrap logic becomes reliable.
3. **There is a separate homepage runtime regression that makes the whole page feel broken/sluggish.**
   - Console shows repeated `Map container is already initialized.` from Leaflet in the homepage `UKRegionMap` path.
   - That is not PromoTracker itself, but it is inflating script/style work and hurting perceived smoothness.

### Functional issues and exact fixes

#### 1) Harden PromoTracker itself
Update `src/components/sections/PromoTracker.tsx` to match the working marquee architecture:
- Remove the always-rendered debug toggle from production UI.
- Keep debug info only behind the `debugTickers` query param.
- Do **not** advance `positionRef` until a valid `singleSetWidth` has been measured.
- Reset position safely when width changes after resize/font load.
- Reduce duplicate sets from `8` to the minimum needed for seamless looping.
- Normalise velocity to roughly the same range as working tickers.

Planned code changes:
- `SETS: 8 -> 4` or dynamic clone count based on viewport width.
- `pxPerMs: 0.09 -> ~0.045 to 0.055`.
- Gate animation:
  - if `setWidth <= 0`, measure and skip movement for that frame.
- Keep `ResizeObserver`, but rebase the current offset when measured width changes.
- Convert static arrays to memoised constants so render work stays flat.

#### 2) Remove header-stack coupling issues
Update `src/components/layout/Header.tsx`:
- Keep PromoTracker as the first sticky element.
- Make toolbar offset depend on the actual rendered ticker strip height only.
- Avoid letting debug UI or extra padding affect sticky calculations.

#### 3) Fix the unrelated homepage Leaflet remount loop
Update the homepage map path so it stops throwing repeated errors:
- `src/components/clinic/MapErrorBoundary.tsx`
- `src/components/sections/UKRegionMap.tsx`
- possibly align `src/components/clinic/ClinicMap.tsx` / `ClinicFinder.tsx`

Planned fix:
- Stop relying on retry-only recovery for `Map container is already initialized.`
- Use a stricter mount pattern compatible with Suspense/Strict Mode so the map container is created once per DOM node lifecycle.
- Remove duplicate local boundary logic and align all map components to one implementation.

### Performance bottlenecks

#### PromoTracker bottlenecks
- Over-duplicated DOM (`8x` sets)
- Faster-than-benchmark animation velocity
- Extra state/UI in a constantly visible sticky region
- Width measurement that can be temporarily invalid during first paint/font readiness

#### Homepage bottlenecks affecting perception
From the current runtime profile:
- Repeated Leaflet error recovery on the homepage
- High style recalculation count
- Long script duration on first load
- Large media/image cost unrelated to the ticker, but still competing for main-thread time

### Differences vs working Brand Trackers
Compared with `TestCategoryTicker`, `PartnersGrid`, `FeaturedPublications`, and `TestimonialCarousel`, `PromoTracker` currently has more moving parts:
- more DOM clones
- more state
- more event handling
- a faster scroll speed
- stickier layout coupling with the header

The working trackers are simpler: fixed motion, fewer clones, minimal state, predictable wrap distance.

### Optimisation steps with expected gains
1. **Simplify PromoTracker render path**
   - Fewer clones + no production debug button
   - Expected gain: lower DOM cost and fewer style/layout touches in the sticky header region
2. **Match benchmark speed**
   - Slower, steadier motion improves readability and perceived smoothness immediately
3. **Stabilise width measurement before motion starts**
   - Prevents off-screen drift and false “not working” states
4. **Fix Leaflet homepage remount errors**
   - Biggest page-wide win; should reduce unnecessary recovery work and improve smoothness across the homepage, including the ticker

### Data / query / backend review
There are **no PromoTracker database queries, Supabase calls, RPCs, or edge function calls** in the current implementation path.

So for this feature:
- no SQL optimisation is required
- no index work is required
- no API sequencing work is required

The fix is entirely in the React render/animation path plus the separate homepage map runtime issue.

### Recommended final architecture
- Keep `PromoTracker` as a lightweight, client-only marquee.
- Align it to the same minimal animation pattern as the working trackers.
- Make debug tooling opt-in via query param only, with no on-screen control in production.
- Keep sticky layout measurement isolated from decorative/debug content.
- Standardise the Leaflet mount pattern so homepage runtime errors stop degrading unrelated UI.

### Files to update
- `src/components/sections/PromoTracker.tsx`
- `src/components/layout/Header.tsx`
- `src/components/clinic/MapErrorBoundary.tsx`
- `src/components/sections/UKRegionMap.tsx`
- possibly `src/components/clinic/ClinicMap.tsx`
- possibly `src/components/clinic/ClinicFinder.tsx`

<lov-actions>
  <lov-open-history>View History</lov-open-history>
</lov-actions>

<lov-actions>
<lov-link url="https://docs.lovable.dev/tips-tricks/troubleshooting">Troubleshooting docs</lov-link>
</lov-actions>
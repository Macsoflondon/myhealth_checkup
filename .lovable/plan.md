

## Target

The "Find a Clinic Near You" card sits inside `src/components/sections/PartnerShowcaseGrid.tsx` (lines 84–136), directly under the Medichecks profile button. Four discrete changes, plus a new interactive UK map component.

## Changes

### 1. `src/components/sections/PartnerShowcaseGrid.tsx`

**Add buffer between Medichecks CTA and Find Your Clinic card**
- The Find Your Clinic wrapper `<div className="md:col-span-2">` (line 85) gets `mt-10 sm:mt-14` to create a clear gap below the "View Medichecks profile" button.

**Buttons side-by-side at all viewports**
- Line 116: change `flex flex-col sm:flex-row gap-2` → `flex flex-row gap-2 flex-wrap`.
- Add `flex-1 min-w-0` to both `<Link>` buttons so they share the row equally on mobile (599px viewport).
- Reduce button padding from `px-8 py-3` → `px-3 sm:px-5 py-2` and font from `text-sm sm:text-base` → `text-xs sm:text-sm` so two fit cleanly side-by-side at 599px wide. Add `whitespace-nowrap text-center`.

**Remove all walk-in references**
- Line 100: copy changes from `"…health screenings. Walk in or book online."` → `"…health screenings. Book online for a convenient appointment."`
- Line 133: delete the entire `<span>✓ Walk-in Available</span>` trust point. Keep `CQC Regulated` and `200+ Locations`.

**Insert interactive UK map above the Find Your Clinic card content**
- Render new `<UKRegionMap />` component immediately inside the navy card, before the "Find Your Clinic" eyebrow label, with `mb-5` spacing.

### 2. New component: `src/components/sections/UKRegionMap.tsx`

Interactive Leaflet map of UK + Northern Ireland with hoverable/clickable region pins.

**Design**
- Compact map: `h-[260px] sm:h-[320px]` rounded-xl with `overflow-hidden`, sitting full-width inside the navy card.
- Centred on UK: `[54.5, -3.5]`, zoom 5 (mobile) / 6 (desktop), `scrollWheelZoom={false}` to avoid hijacking page scroll.
- Uses CartoDB dark-matter tile layer (`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png`) so it blends with the navy card.

**Region markers (12 UK + NI hubs)**
Static array of `{ name, lat, lng, slug }` for: London, Manchester, Birmingham, Leeds, Liverpool, Bristol, Newcastle, Edinburgh, Glasgow, Cardiff, Belfast, Southampton.

Each rendered as a circular brand-turquoise pin (custom `L.divIcon` with hover scale via CSS). On hover → tooltip with region name. On click → navigates to `/find-clinic?region={slug}` using `useNavigate`.

**Behaviour**
- Pins use `L.divIcon({ html: '<div class="uk-region-pin" />' })` styled in a small inline `<style>` block: 14px turquoise dot with white border, hover grows to 20px and shows pink ring.
- Wrapped in `MapErrorBoundary` (already in `src/components/clinic/MapErrorBoundary.tsx`) for safety.
- Cast `MapContainer`/`TileLayer`/`Marker` to `any` — same convention used in `ClinicMap.tsx`.

### 3. `src/pages/FindClinicPage.tsx` (light touch)

If `?region=` query param present, scroll to clinic list and pre-filter postcode/area. Already has search infrastructure — confirm during implementation; if non-trivial, leave as plain navigation to `/find-clinic` and treat region pre-filter as a follow-up task.

## Files

- Edit `src/components/sections/PartnerShowcaseGrid.tsx`
- Create `src/components/sections/UKRegionMap.tsx`
- (Conditional) light edit to `src/pages/FindClinicPage.tsx` to read `?region=`


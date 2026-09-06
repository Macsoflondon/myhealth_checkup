# Unify the At Home Test Kits landing page with the General Wellness style

The `/at-home-tests` landing view currently sits on a dark navy panel (`bg-[#08122b]`) with white text and a simpler card grid, while `/wellness` (General Wellness) uses a white background, white accent cards with tag chips, hover glow and animated "View Tests →" buttons, plus a gradient-framed quiz CTA banner at the bottom. This plan makes the at-home landing match the wellness landing so both pages feel like the same design system.

## Changes

### 1. `src/pages/AtHomeTestsPage.tsx` — landing view (no `?subcategory=`) only
- Replace the dark navy section (`bg-[#08122b]`, white heading/copy) with a white-background section matching the wellness layout: `background: #ffffff`, `padding: 32px 40px 72px`, `max-width: 1280px` centred container.
- Keep the "Browse at home test kits by category" heading and intro copy, but restyle to light theme: navy `#060b18` heading, muted navy body text — same typographic treatment as wellness content.
- Keep loading/error/empty states visually consistent with the new light background (dark text on white instead of white on navy).
- Add the same bottom quiz CTA banner used on `/wellness` (gradient pink→turquoise frame, navy inner panel, "Find the Right Health Test for You" → `/find-test`), rendered after the grid, so both pages end identically. The existing `CategoryPageBottom` benefits strip stays.

### 2. `src/components/athome/AtHomeSectionGrid.tsx` — card parity with wellness cards
Upgrade each section card to the wellness card spec:
- White card, `border-radius: 20px`, padding `28px 28px 24px`, base shadow `0 4px 18px rgba(0,0,0,0.12)`, hover `translateY(-4px)` with shadow `0 18px 40px rgba(0,0,0,0.18)` and accent top-glow line (already partially present — align exactly).
- Top row: 48px accent icon tile + right-aligned live count ("N kits").
- CTA button changed from the flat tinted "View kits" to the wellness style: accent border, `linear-gradient(135deg, accent20, accent10)` background, accent text, bold 13px with letter-spacing, label "View Kits" with an arrow that slides right on hover.
- No tag chips are added: at-home sections have no tag taxonomy (unlike wellness), and inventing labels would drift from the data.

### 3. Verification
- `bunx tsgo --noEmit`.
- Playwright at `http://localhost:8080/at-home-tests` (1280×1800): confirm white background, light-theme heading, wellness-style cards with arrow CTAs, and the quiz banner; confirm a `?subcategory=` listing view is unchanged.

## Out of scope
- The `?subcategory=` filtered listing view (already uses the shared `CategoryPageLayout`).
- `/wellness` itself, filter-pill row (wellness-only tag taxonomy), and any other category page.
- No data, hook, or route changes; counts logic stays as-is.

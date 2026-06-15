# Homepage Polish Plan

Grouped into 8 tracks. I'll batch related edits.

## 1. Top navigation (Navbar)
- Increase nav link / button font size by 2 steps (e.g. `text-sm` → `text-base`, `text-base` → `text-lg`).
- Smooth sticky transition: animate background, blur, padding, shadow with `transition-all duration-500 ease-out` based on scroll Y, rather than the current abrupt class swap. Cross-fade between transparent and glass state.

## 2. Hero headline
- "Your health is your greatest asset. It deserves clarity, not confusion." — on desktop (lg+) drop font size enough to fit on **one line** (likely `lg:text-4xl` or `lg:text-[2rem]` with `lg:whitespace-nowrap`). Mobile/tablet unchanged.

## 3. "Take control of your health today" section
- Convert to a horizontal side-by-side: text block on the left, CTA buttons on the right (`lg:flex lg:items-center lg:justify-between`).
- Move this block to sit **above** the Live Comparison section.
- In its previous vertical slot (next to Live Comparison), insert a new **video** element:
  - Generate with `videogen--generate_video` (1080p, ~5s, 16:9) — prompt: realistic HD shot of a branded test-kit package dropping through a UK letterbox, hands picking it up, opening the box to reveal a blood-test kit inside.
  - Save to `src/assets/letterbox-kit.mp4`, embed via `<video autoPlay muted loop playsInline>`.

## 4. Live Comparison data fixes
Edit `src/hooks/useLiveComparisonPanel.ts` (and/or underlying data source):
- **Lola Health**: add in-clinic price/method (verify price).
- **Randox**: add at-home kit option alongside in-clinic.
- **Goodbody**: add at-home kit option alongside in-clinic.
- **London Medical Laboratory**: in-clinic only (keep as-is, remove home if present).

Note: I'll need to read the file to confirm structure; will use the existing provider rows and extend collection methods/prices.

## 5. Partner of the Month — Goodbody logo
- Increase logo fill inside the existing white container (no container resize). Change `object-contain` padding / max-height so the logo + tagline reach closer to the card edges, matching the attached screenshot.

## 6. "What We Compare" CTA routing
On the three boxes (Explore Tests / Explore Screening / Explore Tests):
- **Blood test panel / general wellness** → `/tests/general-health` (general wellness landing).
- **Private cancer screening** → `/cancer-screening`.
- **Wellness & Longevity** → `/wellness` (or relevant test-categories filter).
Currently all three route to the comparison page — fix the `to`/`href` props.

## 7. "Side by Side / Full Picture" section
- Keep the header + intro copy.
- **Remove the provider comparison table** rendered beneath it.

## 8. Footer restructure
- **Health Tests column**: append a divider then a "Follow Us" row with the Instagram / Facebook / TikTok social icons.
- **Company column**: append a divider then the compliance badges (ICO, Companies House, Cyber Essentials).
- **Connect column**: replace its contents with the **Stay Informed** newsletter block (currently elsewhere on the page). Move "Stay Informed" out of its current location into this footer slot.
- Remove now-empty old Stay Informed section.

## Technical notes
- Files I expect to touch:
  - `src/components/layout/Navbar.tsx` (font size + sticky transition)
  - Hero component on `Index.tsx` (likely `src/components/sections/Hero*`)
  - `src/components/sections/FeaturedProvidersGlass.tsx` (logo fill)
  - `src/components/sections/` — Take Control / Live Comparison / What We Compare / Side-by-Side / Stay Informed (need to identify exact filenames on first read)
  - `src/hooks/useLiveComparisonPanel.ts` (provider methods/prices)
  - `src/components/layout/Footer.tsx` (column reshuffle)
  - `src/pages/Index.tsx` (section reorder)
- New asset: `src/assets/letterbox-kit.mp4` via videogen.

## Risks / confirmations
- Generated video realism is variable — if first render looks off I'll regenerate once, otherwise keep.
- Lola Health in-clinic price: I'll source from existing provider data if present; if missing I'll mark TBC rather than invent a number — please confirm if you have it.
- "Wellness & Longevity" target route: confirm `/wellness` is correct, or should it be `/test-categories?cat=wellness`?

Ready to switch to build mode and execute in the order above (data + layout first, video render last since it's the slowest).
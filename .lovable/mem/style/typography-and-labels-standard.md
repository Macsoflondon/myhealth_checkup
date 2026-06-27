---
name: Typography & Labels Standard
description: Brand typography rules — Montserrat (headings) + DM Sans (body), with weight/size hierarchy across PageHeading, SectionHeading, body, prices, disclaimers.
type: design
---

## Font stack (self-hosted via @fontsource in `src/main.tsx`)

- **Headings:** Montserrat — weights 400/500/600/700/800
- **Body / UI:** DM Sans — weights 400/500/700
- **Elegant accent:** EB Garamond (CDN, used sparingly)
- **Serif (editorial):** Lora
- **Mono:** JetBrains Mono

Tailwind: `font-sans` → DM Sans, `font-heading` → Montserrat, `font-body` → DM Sans, `font-elegant` → EB Garamond.

Do NOT reintroduce Lato. Do NOT load Montserrat/DM Sans via Google Fonts CDN — use `@fontsource` imports in `main.tsx`.

## Hierarchy rules

| Element | Font / weight | Size |
|---|---|---|
| Hero H1 (`PageHeading`) | Montserrat 800 | `text-3xl sm:text-4xl md:text-5xl lg:text-6xl`, `leading-[1.05]`, `tracking-tight` |
| Section H2 (`SectionHeading`) | Montserrat 700 | `text-2xl sm:text-3xl md:text-[2rem]`, `leading-[1.15]`, `tracking-tight` |
| H3 / H4 | Montserrat 700 | `text-xl` / `text-lg` |
| Body | DM Sans 400 | 16px, line-height 1.6 (set on `body`) |
| Buttons / nav / prices | DM Sans 500 (`font-medium`) | 14–16px (CTAs), 20–24px (prices) |
| Disclaimers | DM Sans 400, muted | 14px / `text-sm`, use `.text-disclaimer` or `[data-disclaimer]` |

Base `body` styles (in `src/index.css`) enforce 16px / 1.6 line-height and DM Sans. Heading element selectors enforce Montserrat with weight defaults (h1=800, h2=700, h3/h4=700) and negative tracking.

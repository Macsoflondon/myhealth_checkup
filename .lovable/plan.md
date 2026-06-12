## Goal

Run a coordinated, parallel sub-agent sweep across the entire site to verify links, refresh provider data against live sources, fix layout/proportion issues (mobile-first), add smooth section transitions, and make the toolbar two lines taller.

## Approach

Work in waves. Wave 1 = parallel read-only audits (sub-agents). Wave 2 = fixes I apply directly based on their reports. Wave 3 = verification (build + spot-check screenshots on mobile + desktop).

## Wave 1 — Parallel audits (read-only sub-agents)

1. **Link audit** — Walk `src/App.tsx` route table + every `<Link>`, `<a>`, `navigate(...)`, and button `onClick` across `src/pages/**` and `src/components/**`. Report: dead routes, 404 targets, mismatched provider slugs, external links missing `target/rel`, CTAs with no handler. Output: file:line + suggested fix.

2. **Provider data freshness** — For each provider in `mem://providers/integrations-overview` (9 providers, incl. GOODBODY, Medichecks, Lola, etc.), Firecrawl-scrape the live provider site and cross-check against UI strings + `provider_tests` rows referenced in components (taglines, turnaround, accreditation badges, prices shown statically, contact details, logos URL). Output: per-provider diff table.

3. **Layout & proportion audit (mobile-first)** — Static scan of every homepage section in `src/components/sections/**` and key pages (`/`, `/find-clinic`, `/compare-tests`, `/biomarkers`, `/cancer-screening`, `/providers/*`, `/health-resource-hub`, `/ai-tools/*`, `/about`, `/contact`). Flag: missing responsive classes, fixed widths, overflow risk, inconsistent container widths vs `mem://style/layout-container-standards`, image aspect-ratio issues, CLS risk.

4. **Transitions & toolbar** — Inventory current section enter/exit animations and the `Header.tsx` height/padding. Identify a single shared transition primitive (Framer Motion `whileInView` or CSS `@starting-style`) and the exact Tailwind classes to bump header height by ~2 line-heights without breaking sticky offsets / scroll anchors / `scroll-mt-*` values.

All four run in parallel. I synthesize once results land.

## Wave 2 — Fixes (I apply)

Priorities and scope (mobile-first; verify desktop after):

- **Header**: increase height by 2 lines (≈ +32px mobile / +40px desktop). Update `Header.tsx` padding, logo size if needed, and adjust any `pt-*`, `scroll-mt-*`, sticky offsets, and `GlobalPageBackground` spacers that depend on header height. Single source-of-truth constant if one exists.
- **Links**: patch every broken/incorrect link and dead CTA. Provider links must respect `mem://providers/goodbody-routing-convention`.
- **Provider data**: update component-level copy + any seed strings to match scraped truth. DB-level corrections to `provider_tests` only if absolutely required — flagged separately for approval, not auto-applied (DB writes are out of UI scope).
- **Layout**: enforce shared container widths, fix overflow, standardise section vertical rhythm (`py-16 md:py-24`), align grid breakpoints. Mobile baseline first, then tablet/desktop.
- **Transitions**: add a single `<SectionReveal>` wrapper (Framer Motion, `whileInView`, `opacity+translateY`, `viewport={{ once: true, margin: "-10%" }}`, `transition={{ duration: 0.5, ease: "easeOut" }}`) and apply to every top-level homepage section + key landing pages. Respect `prefers-reduced-motion`.

## Wave 3 — Verification

- Build passes.
- Browser screenshot key routes at 375px and 1440px; spot-check header, hero, partner showcase, test categories, journey, testimonials, footer.
- Sub-agent re-runs the link audit on the patched tree as a final pass.

## Out of scope

- Database schema changes.
- Pricing/biomarker reconciliation against `tests_master` (separate audit system already exists at `/admin/biomarker-audit`).
- New features or copy rewrites beyond data correctness.

## Risks

- Header height change can cascade into every page's sticky/anchor offsets — handled by updating the shared constant + grepping `scroll-mt-`/`top-`/`pt-` usages.
- Live scraping may hit Firecrawl rate limits with 9 providers in parallel — sub-agents will batch sequentially per provider, parallel across providers.
- Provider sites change pricing frequently; I'll report numeric drift but only auto-fix copy/taglines/accreditation, not prices (those should flow through the scraper pipeline).

# Pre-launch Audit & Remediation Plan

This brief covers a complete pre-launch audit (14 sections) and full remediation. That is genuinely large — realistically a week or more of focused work, not a single execution. To deliver something useful (and verifiable) rather than a shallow tick-box pass, I propose breaking it into **5 sequenced chunks**, each with a discrete report + fix cycle that you can review before the next begins.

If you'd rather I attempt all 14 sections in one shot, I can — but the report will be substantially less rigorous (sampled rather than exhaustive) and Phase 2 fixes will likely need rework. Recommendation is the chunked path below.

---

## Chunk A — Security, Headers, Compliance (Sections 12 + 14)
Highest launch risk. Mostly verifiable from code and HTTP responses.

**Audit:**
- Inspect `vercel.json`, `public/_headers`, `index.html`, `functions/_middleware.ts` for CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- Test live headers and TLS via the published domain (`www.myhealthcheckup.co.uk`).
- Audit cookie consent: `src/lib/consent.ts`, GTM/analytics loaders, third-party scripts in `index.html`.
- Privacy/Cookie/Terms pages: confirm presence, links, ICO/Article 9 coverage.
- Re-run `npm audit` and Supabase linter; confirm no exposed secrets in client bundle.
- Confirm admin MFA hook (`useAdminMFA`) is enforced on every admin route.
- Check `/.well-known/security.txt`, exposed paths (`/.git`, `/admin` without auth), open Supabase endpoints.

**Fix:** add/strengthen response headers, tighten CSP (no `unsafe-inline` for scripts; use nonces or hashes), gate non-essential cookies behind consent, enforce admin MFA on all admin routes, add any missing legal pages, patch CVEs.

---

## Chunk B — Performance, Images, Media (Sections 1 + 2)

**Audit:**
- Lighthouse / Web Vitals run on Home, a category page, a provider profile, a test detail page, the comparison hub, and the clinic finder — at mobile + desktop.
- Inventory every `<img>` and CSS background: format, dimensions vs displayed size, `loading="lazy"`, `width`/`height`, `alt`.
- Check provider logos for size/weight consistency (registry in `src/data/providerBranding.ts`, `src/constants/providerRatings.ts`).
- Bundle analysis — large chunks, render-blocking JS/CSS in `<head>`, font preload, third-party scripts.
- Cache headers from `vercel.json` / `public/_headers`.

**Fix:** convert raster assets to WebP, add `loading="lazy"` and explicit dimensions, preload hero LCP image and primary font, defer/async non-critical scripts, code-split heavy routes, set immutable cache headers on hashed assets.

---

## Chunk C — CTAs, Provider Links, Ratings, Pricing (Sections 3 + 4 + 5 + 6)

**Audit:**
- Crawl the codebase for every `<Link>`, `<a>`, and CTA button — flag `#`, empty `href`, dead routes (cross-checked against `src/routes/*`), and external links missing `target="_blank" rel="noopener noreferrer"`.
- Spot-check provider booking URLs against live provider sites (sample 3 tests per provider).
- Star ratings: verify `src/constants/providerRatings.ts` matches what's rendered everywhere; check ARIA labels.
- Pricing: scan for hardcoded prices in `src/data/*` vs database (`provider_tests`); flag `£0`, missing `£`, VAT ambiguity, cross-page inconsistencies.

**Fix:** repair broken links, standardise external-link attributes, normalise CTA copy, fix rating display bugs and ARIA, replace hardcoded prices with DB-backed values where stale, add VAT-status note in test card footer.

---

## Chunk D — Test Cards, Responsive, Typography, Accessibility (Sections 7 + 8 + 9 + 13)

**Audit:**
- Test card component (`src/components/.../TestCard*`): verify every field (name, turnaround, sample, biomarkers, accreditation, clinic vs home, price). Diff coverage across providers — flag any provider missing a field others have.
- Responsive sweep at 375 / 768 / 1280 on Home, category, provider profile, test detail, comparison, clinic finder, dashboard. Browser tool screenshots; flag overflow, sub-44px tap targets, sub-16px body text, horizontal scroll.
- Typography: confirm Montserrat/Lato/Garamond scale; flag inconsistent heading hierarchy; check FOUT/CLS on font load.
- WCAG 2.1 AA: contrast (semantic tokens audit in `index.css`), keyboard nav, focus states, alt text, form labels, ARIA correctness.

**Fix:** standardise test card schema with placeholder fallbacks, mobile-first spacing/touch-target fixes, type-scale unification in Tailwind config, contrast token adjustments, focus-visible styles, alt-text and ARIA repairs.

---

## Chunk E — Navigation, UX Flow, SEO & Structured Data (Sections 10 + 11)

**Audit:**
- Walk the journey: home → category → provider profile → test detail → external booking. Flag dead ends.
- Test menus, search, filters, comparison, modals, accordions, 404 page.
- Per-page `<title>`, `<meta description>`, canonical, OG tags (`src/lib/seo.ts`, `plugins/ogMetaPlugin.ts`).
- Structured data: MedicalTest / Product / Review / LocalBusiness coverage.
- `public/sitemap.xml` accuracy, `robots.txt` correctness, duplicate/missing H1s (cross-check `H1_HEADING_AUDIT.md`).

**Fix:** add missing meta/canonical/OG, generate JSON-LD where absent, regenerate sitemap, repair internal links, fix dead-end UX, tidy 404.

---

## Deliverables per chunk
1. **Audit report** with the requested structure: Location · Issue · Severity · Suggested fix.
2. **Severity totals** + recommended fix order.
3. **Fix pass** applying everything Critical → Low.
4. **Validation pass** with the relevant items from your launch checklist (✅ checks).
5. Memory updates where rules emerge (e.g. test-card field schema, security headers baseline).

## Items that cannot be done in-tool — flagged for manual action
- TLS version & certificate inspection on the live domain (requires hosting/DNS access — Vercel dashboard).
- Formal CE+ assessor sign-off and ICO registration confirmation.
- Live verification of every provider's current price against their public site (sampling only is feasible automatically).
- Manual penetration testing beyond automated scanners.
- Enabling MFA per-admin-account (each admin must enrol via the UI).

## Suggested order
A → C → B → D → E. Security and broken links/prices are launch-blockers; performance and a11y polish follow; SEO last.

## How I'd like to proceed
Reply with one of:
1. **"Start with Chunk A"** (recommended) — I'll do the security + compliance audit and fixes first.
2. **"Do all five in order, don't stop"** — I'll work through A→E without pausing for review.
3. **"Single mega-pass anyway"** — one combined report + fixes, accepting reduced depth.



# SEO Audit Results & Prerendering Plan

## Part 1: SEO Audit Findings

### Meta Descriptions

**19 of 48 pages** have meta descriptions. The following public-facing pages are missing them:

- AccessibilityPage, AffiliateDisclosurePage, AtHomeTestsPage
- CancerScreeningPage, CookiePolicyPage, DiabetesTestingPage
- FairTradingPolicyPage, FemaleHormonesTestPage, FertilityTestsPage
- GeneralHealthTestPage (uses TestPageTemplate — has metaDescription in data but not in its own Helmet)
- HowWeRankPage, IntelligentSearchPage, IronProfileTestPage
- LipidProfileTestPage, MaleHormoneTestPage, MensHealthPage
- ModernSlaveryPage, PartnersPage, PrivacyPolicyPage
- ProviderTestCatalogPage, ProviderTestDetailPage, SitemapPage
- SportsPerformancePage, TermsConditionsPage, VitaminDTestPage
- VitaminDeficiencyPage, WellWomanTestPage, WomensHealthPage

Note: TestPageTemplate-based pages (GeneralHealthTestPage, VitaminDTestPage, etc.) DO inject meta descriptions via the template — they are covered. The remaining ~20 pages genuinely lack descriptions.

### Canonical URLs

**23 of 48 pages** have canonical URLs. Missing from 25 pages including high-traffic ones like AboutUsPage, ContactPage, HowItWorksPage, GutHealthPage, and all compliance/legal pages.

### Structured Data (JSON-LD)

**16 pages** have structured data. Missing from all compliance pages, most test-specific pages (handled by TestPageTemplate which does include it), and utility pages.

### Summary: What needs fixing

| Issue | Count | Priority |
|-------|-------|----------|
| Missing meta description | ~20 pages | High |
| Missing canonical URL | ~25 pages | High |
| Missing structured data | ~32 pages | Medium |

---

## Part 2: Prerendering Solution

### The core problem

The app is a Vite + React SPA. Crawlers receive `<div id="root"></div>` with no content. `react-helmet-async` injects meta tags only after JS executes. Googlebot can render JS but with delays; social media bots (Facebook, Twitter, LinkedIn) cannot render JS at all.

### Recommended approach: Vite prerender plugin

Since the site is hosted on Lovable (static hosting with SPA fallback), the best approach is **build-time prerendering** using `vite-plugin-prerender`. This generates static HTML for every route at build time — no external service needed, no ongoing cost.

### Implementation

1. **Install `vite-plugin-prerender`** — generates static HTML files during `vite build`

2. **Configure in `vite.config.ts`** — list all ~60 public routes to prerender

3. **Each route gets a fully rendered HTML file** with:
   - Correct `<title>` and `<meta name="description">`
   - Open Graph and Twitter Card tags
   - JSON-LD structured data
   - Full visible content

4. **How it works**: The plugin launches a headless browser during build, visits each route, waits for React to render, then saves the resulting HTML as a static file. When a crawler or user hits `/thyroid`, they get the prerendered HTML instantly. Client-side React then hydrates on top.

### Changes required

**File: `vite.config.ts`**
- Add `vite-plugin-prerender` with full route list
- Configure `renderAfterDocumentEvent` to wait for React render completion

**File: `src/main.tsx`**
- Dispatch a custom event after React mounts so the prerenderer knows the page is ready

**File: `package.json`**
- Add `vite-plugin-prerender` dependency

**~20 page files** (listed above)
- Add missing `<meta name="description">` tags
- Add missing `<link rel="canonical">` tags
- Each gets a unique, SEO-optimised description under 160 characters

### What this solves

- Search engines index fully rendered HTML with correct metadata
- Social media link previews show correct titles, descriptions, and images
- No external service dependency (Prerender.io, Cloudflare Workers)
- Zero ongoing cost
- Works with Lovable hosting as-is (static files served directly)

### Scope

- `vite.config.ts` — prerender config
- `src/main.tsx` — render-complete event
- `package.json` — new dependency
- ~20 page files — add missing meta descriptions and canonical URLs
- No visual, layout, or functionality changes


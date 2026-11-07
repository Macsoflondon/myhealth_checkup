# Architecture decisions

- EDGE keeps the sports-blood-tests catalogue ID; exact product prices refresh through the shared provider upsert in a six-hourly GitHub workflow, while biomarker articles join the existing daily source aggregator. Why: stable IDs preserve links and the provider's £35 navigation offer must never replace product prices.

- Navigation: the brand-bar menu drawer is the full nav at every width; a desktop-only category pill row (DesktopCategoryToolbar, homepage hero) was restored on 03/11/2026 at the owner's request. Why: the owner wants quick category access on desktop while keeping one complete menu.

- FHIR shared reads require the owner's latest export consent and prohibit response caching; withdrawal updates all active export-consent records so older grants cannot restore access.
- Translation quotas use the server-verified user ID and fail closed on quota-storage errors, because request forwarding headers are caller-controlled.
- Approved access hardening keeps health-score writes and rejected scrape-label reads internal, and restricts kit-image listing without changing public image delivery; database changes remain drafts for Claude to apply.

- Public comparison metadata and JSON-LD belong in route heads through the shared SEO builders; test Product offers use provider-listed prices and omit unverified stock claims, so SSR and visible catalogue evidence cannot diverge.

- Provider article listings share one live query and image renderer; valid source images take priority, with local topic illustrations on missing or failed images, so category guides cannot silently use dated fixtures.

- Category mappings retain full biomarker lists and confirmed collection variants, including zero-fee routes, so previews cannot truncate modal counts or lose home-nurse availability.

- Lola add-on presentation and homepage eligibility share a source-backed status resolver; explicit provider add-on categories or opening descriptions override a conflicting false flag without altering stored catalogue data.

- Both homepage test showcases share a bounded per-provider catalogue query and round-robin selection, so global popularity flags cannot exclude providers; unranked catalogue selections never gain popularity badges.
- The shared provider roster includes EDGE, and both homepage showcases render the complete selected set without a separate eight-card cap; configured provider identity never supplies fabricated catalogue rows or accreditation. Why: roster counts and card eligibility must agree without claiming activation is verified.

- Public assistant history uses only the dedicated server-only CHAT_SIGNING_SECRET for bounded-age reply proofs; validate every supplied assistant reply before truncation, reject invalid history with HTTP 400 and timestamp/endpoint/reason-only logs, and reset client history so untrusted roles never reach the model.

- Error-boundary diagnostics render only after the existing server admin/MFA endpoint verifies the current user; failed, pending or signed-out checks render no diagnostic DOM so public fallback pages never expose the tab or stack.

- Provider navigation and profile lookup use the shared provider-ID normaliser; legacy aliases redirect to canonical profiles so directory links and catalogue lookups cannot disagree.

- Randox scrapers share their pure sample parser under `_shared/scrape`, because edge deployment bundles include shared files but not sibling function folders.

- Homepage bands use the hero's available outer width and homepage-section-inner for shared gutters; the featured partner is not hidden behind a lazy-mount reveal, so empty navy reservations cannot precede its heading.

- Test-card pictures share TestCardImage and use source product URLs with a neutral failure fallback; provider identity logos remain separate so image behaviour cannot drift across listings.
- Audited Medichecks kit-only photographs live in the shared image resolver and take priority for their exact test names; all gallery slots reject blocked promotional images. Why: first-image scraping must not overwrite approved product photography or reintroduce promotions in detail views.
- Active comparison headers also render TestCardImage from the catalogue image_url alongside their existing provider identity logo, so stored kit photographs appear consistently without replacing provider identification.

- Collection variants use the view's selected-route pricing and public provider fee rules for additional routes; availability flags, not charges, establish clinic options so postage and clinical review cannot become blood-draw fees.

- Public MCP server lives in `src/lib/mcp/public.ts` and is generated into `supabase/functions/mcp-public`. It needs no sign-in, has seven read-only catalogue tools and allows 60 requests per minute per IP through a `Deno.serve` wrapper. Why: the SDK can't set sign-in per tool and has no middleware hook.
- The signed-in MCP server (`src/lib/mcp/index.ts` → `supabase/functions/mcp`) keeps OAuth, admin role checks and audit logging. Why: favourites and admin tools need a verified user.
- The Human Context Engine resolves OpenAI credentials through its local configuration helper, preferring the canonical secret and accepting the existing legacy name so deployed naming differences do not disable recommendations.
- Homepage comparison slots share one cached service-layer catalogue query and a single compact presentation component, so their appearance and panel allocation cannot drift.
- The homepage loader prefetches that shared public comparison query before rendering; query failure keeps the existing unavailable state instead of failing the page. Why: crawlers need source-backed comparison rows in the initial HTML, not a loading-only catalogue.
- The upper comparison reserves full blood count; deduplicate panel slugs before rotating the lower pair so no test panel appears in multiple slots.
- The upper comparison renders at the component's compact size and its text column stretches to the card's height, so the quiz block's bottom edge always meets the card's bottom edge instead of leaving a gap under it. Why: the card beside a text column must not make the section taller than that column.
- Reusable library exports live in the self-contained `src/design-system` subtree; preview routes and data services stay outside it so attached consumers receive no application dependencies.
- The library barrel imports its self-contained theme, not the preview stylesheet, so attached consumers receive the comparison utilities and tokens without site-wide application styling.
- Medical Diagnosis kit boxes are pre-rendered per test name in `src/assets/providers/medical-diagnosis-kits` and take priority over stored provider photos for that provider, so every Medical Diagnosis card looks consistent.
- The homepage test explainer lives in `src/lib/ai/` (types / server-only Claude call / public server functions) with the UI in `src/components/sections/TestExplainerSection.tsx`; explanations are zod-validated with a catalogue-only fallback and a fixed server-side disclaimer. Why: AI output must never reach the page unvalidated, and anonymous homepage traffic is cost-controlled by a per-test cache plus per-IP limit instead of sign-in.

- Page, section and card headings use the shared type-page-title / type-section-title / type-card-title / type-body utilities in src/styles.css, sized to the homepage standard. Why: per-file hardcoded sizes caused heading drift across pages.

- Security headers (CSP, X-Frame-Options, Permissions-Policy, HSTS, nosniff, Referrer-Policy) are set by request middleware in src/start.ts from src/lib/security-headers.ts; zod runs jitless (src/lib/zod-jitless.ts, first import of each entry) so the CSP needs no unsafe-eval. Why: Lovable hosting ignores public/_headers and vercel.json.
- Category names that double as catalogue keys stay unchanged in data; menus render them through displayLabel() in src/lib/display-label.ts. Why: sentence-case display must not break catalogue matching.

- Product photos with baked-in provider promotions are blocked by path in src/lib/promotional-images.ts (checked in TestCardImage and resolveTestCardImage) and fall back to the neutral placeholder. Why: comparison content must not carry provider marketing.
- Page titles pass through withBrand() in src/lib/seo/route-head.ts so every route and Helmet title ends with the brand once. Why: per-file suffixes drifted.

- Anonymous visitors have no database write privileges; public writes go only through `/api/public/*` handlers using the server-only key with strict zod schemas, a 4 KB cap and the shared salted IP-hash limit in `src/lib/server/visitor-rate-limit.ts` (booking clicks: catalogue-validated, server-derived host, redirect to the catalogue URL only; quiz funnel: `/api/public/quiz-event`, known events and quiz node IDs only). Admin-only table writes carry restrictive aal2 policies. Why: public writes must pass server validation and admin edits must need two-factor sign-in.

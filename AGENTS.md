# Architecture decisions

- Public assistant history uses only the dedicated server-only CHAT_SIGNING_SECRET for bounded-age reply proofs; validate every supplied assistant reply before truncation, reject invalid history with HTTP 400 and timestamp/endpoint/reason-only logs, and reset client history so untrusted roles never reach the model.

- Error-boundary diagnostics render only after the existing server admin/MFA endpoint verifies the current user; failed, pending or signed-out checks render no diagnostic DOM so public fallback pages never expose the tab or stack.

- Provider navigation and profile lookup use the shared provider-ID normaliser; legacy aliases redirect to canonical profiles so directory links and catalogue lookups cannot disagree.

- Randox scrapers share their pure sample parser under `_shared/scrape`, because edge deployment bundles include shared files but not sibling function folders.

- Homepage bands use the hero's available outer width and homepage-section-inner for shared gutters; the featured partner is not hidden behind a lazy-mount reveal, so empty navy reservations cannot precede its heading.

- Test-card pictures share TestCardImage and use source product URLs with a neutral failure fallback; provider identity logos remain separate so image behaviour cannot drift across listings.
- Active comparison headers also render TestCardImage from the catalogue image_url alongside their existing provider identity logo, so stored kit photographs appear consistently without replacing provider identification.

- Collection variants use the view's selected-route pricing and public provider fee rules for additional routes; availability flags, not charges, establish clinic options so postage and clinical review cannot become blood-draw fees.

- Public MCP server lives in `src/lib/mcp/public.ts` and is generated into `supabase/functions/mcp-public`. It needs no sign-in, has seven read-only catalogue tools and allows 60 requests per minute per IP through a `Deno.serve` wrapper. Why: the SDK can't set sign-in per tool and has no middleware hook.
- The signed-in MCP server (`src/lib/mcp/index.ts` → `supabase/functions/mcp`) keeps OAuth, admin role checks and audit logging. Why: favourites and admin tools need a verified user.
- The Human Context Engine resolves OpenAI credentials through its local configuration helper, preferring the canonical secret and accepting the existing legacy name so deployed naming differences do not disable recommendations.
- Homepage comparison slots share one cached service-layer catalogue query and a single compact presentation component, so their appearance and panel allocation cannot drift.
- The upper comparison reserves full blood count; deduplicate panel slugs before rotating the lower pair so no test panel appears in multiple slots.
- Reusable library exports live in the self-contained `src/design-system` subtree; preview routes and data services stay outside it so attached consumers receive no application dependencies.
- The library barrel imports its self-contained theme, not the preview stylesheet, so attached consumers receive the comparison utilities and tokens without site-wide application styling.
- Medical Diagnosis kit boxes are pre-rendered per test name in `src/assets/providers/medical-diagnosis-kits` and only used when a test has no product photo of its own, so a working provider photo always wins.

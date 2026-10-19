# Architecture decisions

- Public MCP server lives in `src/lib/mcp/public.ts` and is generated into `supabase/functions/mcp-public`. It needs no sign-in, has seven read-only catalogue tools and allows 60 requests per minute per IP through a `Deno.serve` wrapper. Why: the SDK can't set sign-in per tool and has no middleware hook.
- The signed-in MCP server (`src/lib/mcp/index.ts` → `supabase/functions/mcp`) keeps OAuth, admin role checks and audit logging. Why: favourites and admin tools need a verified user.
- The Human Context Engine resolves OpenAI credentials through its local configuration helper, preferring the canonical secret and accepting the existing legacy name so deployed naming differences do not disable recommendations.
- Homepage comparison slots share one cached service-layer catalogue query and a single compact presentation component, so their appearance and panel allocation cannot drift.
- The upper comparison reserves full blood count; deduplicate panel slugs before rotating the lower pair so no test panel appears in multiple slots.
- Reusable library exports live in the self-contained `src/design-system` subtree; preview routes and data services stay outside it so attached consumers receive no application dependencies.
- The library barrel imports its self-contained theme, not the preview stylesheet, so attached consumers receive the comparison utilities and tokens without site-wide application styling.

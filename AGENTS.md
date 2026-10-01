# Architecture decisions

- Public MCP server lives in `src/lib/mcp/public.ts` and is generated into `supabase/functions/mcp-public`. It needs no sign-in, has seven read-only catalogue tools and allows 60 requests per minute per IP through a `Deno.serve` wrapper. Why: the SDK can't set sign-in per tool and has no middleware hook.
- The signed-in MCP server (`src/lib/mcp/index.ts` → `supabase/functions/mcp`) keeps OAuth, admin role checks and audit logging. Why: favourites and admin tools need a verified user.

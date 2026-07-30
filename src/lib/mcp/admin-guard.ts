import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ToolContext } from "@lovable.dev/mcp-js";

/**
 * Shared authorisation + audit helpers for the operational admin MCP tools.
 *
 * Rules enforced here (server-side, never client-side):
 *  - the caller must present a verified OAuth token;
 *  - `has_role(auth.uid(), 'admin')` must return true;
 *  - every query runs with the caller's own token, so RLS stays a second line of defence.
 *
 * The service role key is deliberately never referenced in this module.
 */

export type ToolTextResult = {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
  structuredContent?: Record<string, unknown>;
};

export const DENIED: ToolTextResult = {
  content: [{ type: "text", text: "You do not have permission to use this tool." }],
  isError: true,
};

export type AdminSession = { client: SupabaseClient; userId: string };

function callerClient(ctx: ToolContext): SupabaseClient {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Returns an admin session, or null when the caller is not a verified admin. */
export async function requireAdmin(ctx: ToolContext): Promise<AdminSession | null> {
  if (!ctx.isAuthenticated()) return null;
  const client = callerClient(ctx);
  const userId = ctx.getUserId();
  if (!userId) return null;
  const { data, error } = await client.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || data !== true) return null;
  return { client, userId };
}

/** Writes one audit row per successful admin tool call. Never throws. */
export async function logAdminToolCall(
  session: AdminSession,
  toolName: string,
  args: unknown,
): Promise<void> {
  try {
    await session.client.from("admin_activity_log").insert({
      admin_user_id: session.userId,
      action: `mcp.${toolName}`,
      resource_type: "mcp_tool",
      resource_name: toolName,
      new_value: { arguments: args ?? {}, via: "mcp" },
      success: true,
    });
  } catch {
    // Auditing must not break a read-only tool response.
  }
}

export function ok(payload: Record<string, unknown>): ToolTextResult {
  return {
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    structuredContent: payload,
  };
}

export function fail(message: string): ToolTextResult {
  return { content: [{ type: "text", text: `Error: ${message}` }], isError: true };
}

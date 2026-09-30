import type { SupabaseClient } from "@supabase/supabase-js";
import type { ToolContext } from "@lovable.dev/mcp-js";
import { fail, ok, userClient, type ToolTextResult } from "./shared";

/**
 * Authorisation + audit helpers for the read-only admin MCP tools.
 *  - caller must present a verified OAuth token;
 *  - has_role(auth.uid(), 'admin') must return true;
 *  - every query runs with the caller's own token, so RLS stays a second line of defence;
 *  - the audit row is written before any data is returned; if it fails, no data is returned;
 *  - denied attempts by signed-in callers are logged too.
 * The service role key is deliberately never referenced here.
 */

export { fail, ok, type ToolTextResult };

export const DENIED: ToolTextResult = {
  content: [
    { type: "text", text: "You do not have permission to use this tool." },
  ],
  isError: true,
};

export type AdminSession = { client: SupabaseClient; userId: string };

/** Returns an admin session, or null when the caller is not a verified admin. */
export async function requireAdmin(
  ctx: ToolContext,
): Promise<AdminSession | null> {
  if (!ctx.isAuthenticated()) return null;
  const userId = ctx.getUserId();
  if (!userId) return null;
  const client = userClient(ctx);
  const { data, error } = await client.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error || data !== true) return null;
  return { client, userId };
}

/** Records a denied call with the caller's user id and tool name. Best effort. */
export async function logDeniedToolCall(
  ctx: ToolContext,
  toolName: string,
): Promise<void> {
  if (!ctx.isAuthenticated() || !ctx.getUserId()) return;
  try {
    await userClient(ctx).rpc("mcp_log_denied_tool_call", { p_tool: toolName });
  } catch {
    // A denial is returned regardless of whether it could be logged.
  }
}

/** Writes the audit row. Returns an error message when the write fails. */
export async function logAdminToolCall(
  session: AdminSession,
  toolName: string,
  args: unknown,
): Promise<string | null> {
  try {
    const { error } = await session.client.from("admin_activity_log").insert({
      admin_user_id: session.userId,
      action: `mcp.${toolName}`,
      resource_type: "mcp_tool",
      resource_name: toolName,
      new_value: { arguments: args ?? {}, via: "mcp" },
      success: true,
    });
    return error ? error.message : null;
  } catch (e: unknown) {
    return e instanceof Error ? e.message : "unknown error";
  }
}

export type AdminRunResult =
  { payload: Record<string, unknown> } | { error: string };

/**
 * Standard wrapper for every admin tool: guard, run, audit, then return.
 * Data is only released after the audit row has been written successfully.
 */
export async function runAdminTool(
  ctx: ToolContext,
  toolName: string,
  args: unknown,
  run: (session: AdminSession) => Promise<AdminRunResult>,
): Promise<ToolTextResult> {
  const session = await requireAdmin(ctx);
  if (!session) {
    await logDeniedToolCall(ctx, toolName);
    return DENIED;
  }
  const result = await run(session);
  if ("error" in result) return fail(result.error);
  const logError = await logAdminToolCall(session, toolName, args);
  if (logError)
    return fail(
      `Audit log write failed, so no data was returned (${logError}).`,
    );
  return ok(result.payload);
}

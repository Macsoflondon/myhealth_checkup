import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function userClient(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "save_favourite",
  title: "Save a test to my favourites",
  description:
    "Save a diagnostic test to the signed-in user's favourites on myhealth checkup.",
  inputSchema: {
    test_id: z.string().min(1).describe("Test id (uuid from search_tests, or provider slug)."),
    name: z.string().min(1).describe("Test name."),
    provider: z.string().min(1).describe("Provider name."),
    category: z.string().optional(),
    price: z.number().nonnegative().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ test_id, name, provider, category, price }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await userClient(ctx)
      .from("favorites")
      .insert({ user_id: ctx.getUserId(), test_id, name, provider, category, price })
      .select()
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    return {
      content: [{ type: "text", text: `Saved "${name}" to favourites.` }],
      structuredContent: { favourite: data },
    };
  },
});

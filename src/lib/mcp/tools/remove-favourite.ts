import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fail, ok, userClient } from "../shared";

export default defineTool({
  name: "remove_favourite",
  title: "Remove a test from my favourites",
  description:
    "Remove a test from the signed-in user's own favourites by test id. Only the caller's own saved row is affected.",
  inputSchema: {
    test_id: z.string().uuid().describe("Test UUID to remove."),
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ test_id }, ctx) => {
    const userId = ctx.getUserId();
    if (!ctx.isAuthenticated() || !userId) return fail("Not authenticated");
    const { data, error } = await userClient(ctx)
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("test_id", test_id)
      .select("id");
    if (error) return fail(error.message);
    const removed = (data ?? []).length;
    return ok({ removed, test_id });
  },
});

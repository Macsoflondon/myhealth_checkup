import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fail, ok, userClient } from "../shared";

export default defineTool({
  name: "save_favourite",
  title: "Save a test to my favourites",
  description:
    "Save a diagnostic test to the signed-in user's favourites by test id. The test name, provider, category and price are looked up from the catalogue. Saving the same test twice has no further effect.",
  inputSchema: {
    test_id: z.string().uuid().describe("Test UUID from search_tests."),
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ test_id }, ctx) => {
    const userId = ctx.getUserId();
    if (!ctx.isAuthenticated() || !userId) return fail("Not authenticated");
    const client = userClient(ctx);
    const { data: test, error: lookupError } = await client
      .from("unified_provider_tests")
      .select("id, test_name, provider_name, category_primary, price")
      .eq("id", test_id)
      .maybeSingle();
    if (lookupError) return fail(lookupError.message);
    if (!test) return fail("Test not found in the catalogue.");
    const row = test as {
      test_name: string;
      provider_name: string;
      category_primary: string | null;
      price: number | null;
    };

    const { error } = await client.from("favorites").upsert(
      {
        user_id: userId,
        test_id,
        name: row.test_name,
        provider: row.provider_name,
        category: row.category_primary,
        price: row.price,
      },
      { onConflict: "user_id,test_id", ignoreDuplicates: true },
    );
    if (error) return fail(error.message);

    const { data: saved, error: readError } = await client
      .from("favorites")
      .select("id, test_id, name, provider, category, price, created_at")
      .eq("user_id", userId)
      .eq("test_id", test_id)
      .maybeSingle();
    if (readError) return fail(readError.message);
    return {
      ...ok({ favourite: saved }),
      content: [
        { type: "text", text: `Saved "${row.test_name}" to favourites.` },
      ],
    };
  },
});
